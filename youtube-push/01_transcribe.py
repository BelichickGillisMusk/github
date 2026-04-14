#!/usr/bin/env python3
"""
youtube-push — Stage 1: Transcribe

Runs Whisper on a long video to produce a timestamped transcript.
Alternatively, load an existing SRT (e.g. Squarespace auto-captions)
to skip the Whisper step and save time.

Usage:
    python3 01_transcribe.py ~/Movies/carb-explainer.mp4
    python3 01_transcribe.py ~/Movies/carb-explainer.mp4 --srt captions.srt
    python3 01_transcribe.py ~/Movies/carb-explainer.mp4 --model small

Output:
    data/<video_name>/transcript.json
"""
import argparse
import json
import os
import re
import sys

from config import DATA_DIR


def video_slug(video_path):
    """Slugify a video filename for use as a data folder name."""
    name = os.path.splitext(os.path.basename(video_path))[0]
    slug = re.sub(r"[^a-zA-Z0-9_-]+", "_", name).strip("_").lower()
    return slug or "video"


def parse_srt_timestamp(ts):
    """Parse an SRT timestamp like 00:01:23,456 into seconds."""
    ts = ts.replace(",", ".")
    parts = ts.split(":")
    h, m, s = int(parts[0]), int(parts[1]), float(parts[2])
    return h * 3600 + m * 60 + s


def load_srt(srt_path):
    """Convert an SRT file into Whisper-like segment structure."""
    with open(srt_path, "r", encoding="utf-8") as f:
        content = f.read()

    # SRT blocks are separated by blank lines
    blocks = re.split(r"\n\s*\n", content.strip())
    segments = []

    for block in blocks:
        lines = block.strip().splitlines()
        if len(lines) < 3:
            continue
        # lines[0] = index, lines[1] = "00:00:01,000 --> 00:00:04,000", lines[2+] = text
        try:
            start_str, end_str = lines[1].split(" --> ")
            start = parse_srt_timestamp(start_str.strip())
            end = parse_srt_timestamp(end_str.strip())
            text = " ".join(lines[2:]).strip()
            segments.append({
                "start": start,
                "end": end,
                "text": text,
            })
        except (ValueError, IndexError):
            continue

    return {
        "segments": segments,
        "language": "en",
        "source": "srt",
    }


def transcribe_with_whisper(video_path, model_name="base"):
    """Run Whisper locally. Requires: pip3 install openai-whisper."""
    try:
        import whisper
    except ImportError:
        print("ERROR: openai-whisper is not installed.")
        print("       Install with: pip3 install openai-whisper")
        sys.exit(1)

    print(f"  Loading Whisper model: {model_name} (first run downloads ~1GB)...")
    model = whisper.load_model(model_name)

    print(f"  Transcribing {video_path}...")
    result = model.transcribe(
        video_path,
        word_timestamps=True,
        verbose=False,
    )

    # Normalize to the shape we'll use downstream
    segments = []
    for seg in result["segments"]:
        segments.append({
            "start": seg["start"],
            "end": seg["end"],
            "text": seg["text"].strip(),
            "words": [
                {"word": w["word"], "start": w["start"], "end": w["end"]}
                for w in seg.get("words", [])
            ],
        })

    return {
        "segments": segments,
        "language": result.get("language", "en"),
        "source": f"whisper-{model_name}",
    }


def main():
    parser = argparse.ArgumentParser(description="Transcribe a long video for youtube-push")
    parser.add_argument("video", help="Path to video file")
    parser.add_argument("--srt", default="", help="Use existing SRT instead of running Whisper")
    parser.add_argument("--model", default="base",
                        choices=["tiny", "base", "small", "medium", "large"],
                        help="Whisper model size (default: base; use 'small' for better accuracy)")
    parser.add_argument("--out-dir", default="", help="Override output directory")
    args = parser.parse_args()

    video_path = os.path.expanduser(args.video)
    if not os.path.isfile(video_path):
        print(f"ERROR: Video not found: {video_path}")
        sys.exit(1)

    slug = video_slug(video_path)
    out_dir = args.out_dir or os.path.join(DATA_DIR, slug)
    os.makedirs(out_dir, exist_ok=True)
    transcript_path = os.path.join(out_dir, "transcript.json")

    print(f"\n  ── STAGE 1: TRANSCRIBE ──")
    print(f"  Video: {video_path}")
    print(f"  Output: {transcript_path}")

    if args.srt:
        srt_path = os.path.expanduser(args.srt)
        print(f"  Using SRT file: {srt_path}")
        data = load_srt(srt_path)
    else:
        data = transcribe_with_whisper(video_path, args.model)

    data["video_path"] = os.path.abspath(video_path)
    data["video_slug"] = slug

    with open(transcript_path, "w") as f:
        json.dump(data, f, indent=2)

    duration = data["segments"][-1]["end"] if data["segments"] else 0
    print(f"\n  ✓ {len(data['segments'])} segments transcribed")
    print(f"  ✓ Duration: {duration/60:.1f} min")
    print(f"  ✓ Saved: {transcript_path}\n")

    return transcript_path


if __name__ == "__main__":
    main()
