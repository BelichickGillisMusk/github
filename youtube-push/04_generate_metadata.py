#!/usr/bin/env python3
"""
youtube-push — Stage 4: Generate Metadata

For every short in shorts_plan.json, write a clip_XX_metadata.json with:
  - LLM-friendly question title
  - YouTube description (full transcript + NAP + hashtags)
  - TikTok caption (hook-first, short)
  - VideoObject JSON-LD schema (for Squarespace code injection)

These files are copy-paste-ready when uploading to YouTube/TikTok or
when embedding a clip on norcalcarbmobile.com.

Usage:
    python3 04_generate_metadata.py data/<video_slug>/shorts_plan.json
"""
import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone

from config import (
    BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_WEBSITE, BUSINESS_EMAIL,
    BAR_LICENSE, CARB_TESTER_ID,
    HASHTAGS_CORE, HASHTAGS_BY_TOPIC,
)


def hashtags_for(topic):
    extra = HASHTAGS_BY_TOPIC.get(topic, [])
    return extra + HASHTAGS_CORE


def answer_sentence(topic, transcript):
    """Extract or build a one-sentence direct answer for the description."""
    # Use the first sentence of the transcript as the answer
    sentences = re.split(r"(?<=[.?!])\s+", transcript.strip())
    for s in sentences:
        s = s.strip()
        if len(s) > 20 and len(s) < 200:
            return s
    return sentences[0].strip() if sentences else ""


def youtube_description(title, transcript, topic):
    answer = answer_sentence(topic, transcript)
    tags = " ".join(hashtags_for(topic))
    return (
        f"{title}\n\n"
        f"{answer}\n\n"
        f"── Full transcript ──\n{transcript}\n\n"
        f"Mobile CARB emissions testing for NorCal fleets — we come to your yard.\n"
        f"📞 {BUSINESS_PHONE}\n"
        f"🌐 {BUSINESS_WEBSITE}\n"
        f"BAR License: {BAR_LICENSE}\n"
        f"CARB Tester ID: {CARB_TESTER_ID}\n\n"
        f"{tags}"
    )


def tiktok_caption(title, topic):
    tags = " ".join(hashtags_for(topic)[:5])  # TikTok caption is short
    return f"{title} 👇 Mobile CARB testing in NorCal — link in bio. {tags}"


def iso_duration(seconds):
    """Convert seconds to ISO 8601 duration (PT1M23S)."""
    total = int(round(seconds))
    m = total // 60
    s = total % 60
    if m and s:
        return f"PT{m}M{s}S"
    if m:
        return f"PT{m}M"
    return f"PT{s}S"


def video_object_schema(short, clip_path):
    title = short["title"]
    return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": title,
        "description": short["youtube_description"].split("\n\n── Full transcript ──")[0],
        "transcript": short["transcript"],
        "uploadDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S%z"),
        "duration": iso_duration(short["duration"]),
        "contentUrl": f"{BUSINESS_WEBSITE}/videos/{os.path.basename(clip_path)}",
        "thumbnailUrl": f"{BUSINESS_WEBSITE}/videos/{os.path.splitext(os.path.basename(clip_path))[0]}.jpg",
        "publisher": {
            "@type": "Organization",
            "name": BUSINESS_NAME,
            "telephone": BUSINESS_PHONE,
            "email": BUSINESS_EMAIL,
            "url": BUSINESS_WEBSITE,
        },
    }


def main():
    parser = argparse.ArgumentParser(description="Generate LLM-optimized metadata per short")
    parser.add_argument("plan", help="Path to shorts_plan.json")
    args = parser.parse_args()

    plan_path = os.path.expanduser(args.plan)
    with open(plan_path, "r") as f:
        plan = json.load(f)

    out_dir = os.path.dirname(plan_path)

    print(f"\n  ── STAGE 4: GENERATE METADATA ──")
    print(f"  Plan: {plan_path}")

    written = 0
    for short in plan["shorts"]:
        clip_id = short["clip_id"]
        topic = short["topic"]
        title = short["title_draft"]
        transcript = short["transcript"]

        # Find the matching mp4 (may not exist yet if extract hasn't run)
        topic_slug = re.sub(r"[^a-z0-9]+", "_", topic.lower()).strip("_")[:30]
        clip_filename = f"{clip_id}_{topic_slug}.mp4"
        clip_path = os.path.join(out_dir, clip_filename)

        enriched = {
            "clip_id": clip_id,
            "clip_file": clip_filename,
            "topic": topic,
            "duration": short["duration"],
            "title": title,
            "transcript": transcript,
            "youtube_description": youtube_description(title, transcript, topic),
            "tiktok_caption": tiktok_caption(title, topic),
            "hashtags": hashtags_for(topic),
        }
        enriched["video_schema"] = video_object_schema(enriched, clip_path)

        meta_path = os.path.join(out_dir, f"{clip_id}_metadata.json")
        with open(meta_path, "w") as f:
            json.dump(enriched, f, indent=2)
        written += 1

    print(f"\n  ✓ Wrote metadata for {written} clip(s)")
    print(f"  ✓ Location: {out_dir}\n")


if __name__ == "__main__":
    main()
