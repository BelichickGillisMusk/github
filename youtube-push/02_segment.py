#!/usr/bin/env python3
"""
youtube-push — Stage 2: Segment

Reads a Whisper transcript and produces a plan of 30-60 sec shorts
grouped by topic. Each short is a candidate for LLM-friendly upload.

Strategy:
1. Walk segments looking for topic keyword matches (CARB terminology)
2. Expand each match outward to sentence boundaries and target 30-60s
3. Also keep segments that start with a question pattern ("What is...")
4. De-duplicate overlapping candidates, keep best per topic
5. Emit shorts_plan.json with timing, topic, transcript, draft title

Usage:
    python3 02_segment.py data/<video_slug>/transcript.json
    python3 02_segment.py data/<video_slug>/transcript.json --max 15
"""
import argparse
import json
import os
import re
import sys

from config import (
    SHORT_MIN_SECONDS, SHORT_TARGET_SECONDS, SHORT_MAX_SECONDS,
    TOPIC_KEYWORDS, QUESTION_PATTERNS,
)


def find_topic(text):
    """Return the first topic whose keywords appear in text, else None."""
    low = text.lower()
    for topic, keywords in TOPIC_KEYWORDS.items():
        for kw in keywords:
            if kw.lower() in low:
                return topic
    return None


def starts_with_question(text):
    """True if the segment opens with a question pattern."""
    low = text.lower().strip()
    return any(low.startswith(p) for p in QUESTION_PATTERNS)


def expand_window(segments, center_idx, min_sec, target_sec, max_sec):
    """
    Expand from a center segment to cover target_sec of transcript,
    snapping to segment boundaries.
    """
    center = segments[center_idx]
    start = center["start"]
    end = center["end"]

    left = center_idx
    right = center_idx

    while (end - start) < target_sec:
        # Try to grow right first (keeps the matched moment near the start of clip)
        if right + 1 < len(segments) and (segments[right + 1]["end"] - start) <= max_sec:
            right += 1
            end = segments[right]["end"]
        elif left - 1 >= 0 and (end - segments[left - 1]["start"]) <= max_sec:
            left -= 1
            start = segments[left]["start"]
        else:
            break

    duration = end - start
    if duration < min_sec:
        return None  # too short, skip

    text = " ".join(segments[i]["text"].strip() for i in range(left, right + 1))
    return {
        "start": start,
        "end": end,
        "duration": duration,
        "text": text,
        "segment_range": [left, right],
    }


def draft_title(topic, text):
    """Generate a question-style draft title. User can refine per clip."""
    topic_titles = {
        "obd_test": "What Is an OBD Test?",
        "ovi_test": "What Is an OVI Smoke Opacity Test?",
        "ovi_vs_obd": "OBD vs OVI: What's the Difference?",
        "carb_2027": "CARB 2027: Quarterly Testing Explained",
        "fleet_testing": "Mobile Fleet Emissions Testing — How It Works",
        "hd_im": "CARB Clean Truck Check (HD I/M) Explained",
        "non_compliance": "What Happens If You Fail CARB Testing?",
        "who_needs_testing": "Does Your Truck Need CARB Testing?",
        "frequency": "How Often Do Diesel Trucks Need CARB Testing?",
        "cost": "How Much Does CARB Emissions Testing Cost?",
    }
    if topic in topic_titles:
        return topic_titles[topic]

    # Fallback: pull the first question-like sentence from the transcript
    sentences = re.split(r"(?<=[.?!])\s+", text.strip())
    for s in sentences:
        if "?" in s:
            return s.strip()[:80]
    return sentences[0][:80] if sentences else "NorCal Carb Mobile — Quick Tip"


def dedupe(candidates):
    """Drop candidates that overlap significantly; prefer earlier/longer ones."""
    # Sort by start time
    candidates.sort(key=lambda c: (c["start"], -c["duration"]))
    kept = []
    for cand in candidates:
        overlaps = False
        for k in kept:
            # >50% overlap with something already kept → drop
            overlap_start = max(cand["start"], k["start"])
            overlap_end = min(cand["end"], k["end"])
            if overlap_end > overlap_start:
                overlap = overlap_end - overlap_start
                if overlap / min(cand["duration"], k["duration"]) > 0.5:
                    overlaps = True
                    break
        if not overlaps:
            kept.append(cand)
    return kept


def main():
    parser = argparse.ArgumentParser(description="Segment transcript into shorts")
    parser.add_argument("transcript", help="Path to transcript.json")
    parser.add_argument("--max", type=int, default=20, help="Max shorts to plan")
    parser.add_argument("--min-seconds", type=int, default=SHORT_MIN_SECONDS)
    parser.add_argument("--target-seconds", type=int, default=SHORT_TARGET_SECONDS)
    parser.add_argument("--max-seconds", type=int, default=SHORT_MAX_SECONDS)
    args = parser.parse_args()

    transcript_path = os.path.expanduser(args.transcript)
    with open(transcript_path, "r") as f:
        data = json.load(f)

    segments = data["segments"]
    print(f"\n  ── STAGE 2: SEGMENT ──")
    print(f"  Transcript: {transcript_path}")
    print(f"  Source segments: {len(segments)}")

    candidates = []

    # Pass 1: topic keyword matches
    for i, seg in enumerate(segments):
        topic = find_topic(seg["text"])
        if not topic:
            continue
        window = expand_window(
            segments, i,
            args.min_seconds, args.target_seconds, args.max_seconds,
        )
        if window:
            window["topic"] = topic
            window["match_type"] = "keyword"
            candidates.append(window)

    # Pass 2: question-pattern starters without keyword match
    for i, seg in enumerate(segments):
        if not starts_with_question(seg["text"]):
            continue
        if find_topic(seg["text"]):
            continue  # already captured in pass 1
        window = expand_window(
            segments, i,
            args.min_seconds, args.target_seconds, args.max_seconds,
        )
        if window:
            window["topic"] = "general_qa"
            window["match_type"] = "question"
            candidates.append(window)

    deduped = dedupe(candidates)[:args.max]

    # Build the final plan
    plan = []
    for idx, c in enumerate(deduped, start=1):
        clip_id = f"clip_{idx:02d}"
        plan.append({
            "clip_id": clip_id,
            "topic": c["topic"],
            "match_type": c["match_type"],
            "start": round(c["start"], 2),
            "end": round(c["end"], 2),
            "duration": round(c["duration"], 2),
            "transcript": c["text"],
            "title_draft": draft_title(c["topic"], c["text"]),
        })

    out_dir = os.path.dirname(transcript_path)
    plan_path = os.path.join(out_dir, "shorts_plan.json")
    with open(plan_path, "w") as f:
        json.dump({
            "video_slug": data.get("video_slug"),
            "video_path": data.get("video_path"),
            "shorts": plan,
        }, f, indent=2)

    print(f"\n  ✓ Planned {len(plan)} shorts")
    for s in plan:
        print(f"    [{s['clip_id']}] {s['topic']:18s} {s['duration']:5.1f}s  — {s['title_draft']}")
    print(f"\n  ✓ Saved: {plan_path}\n")


if __name__ == "__main__":
    main()
