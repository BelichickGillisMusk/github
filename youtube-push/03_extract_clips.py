#!/usr/bin/env python3
"""
youtube-push — Stage 3: Extract Clips

Reads shorts_plan.json and runs ffmpeg to produce 1080x1920 vertical
clips with burned-in captions. Output is ready to upload to YouTube
Shorts and TikTok.

Requires: ffmpeg on PATH (brew install ffmpeg)

Usage:
    python3 03_extract_clips.py data/<video_slug>/shorts_plan.json
    python3 03_extract_clips.py data/<video_slug>/shorts_plan.json --video ~/Movies/custom.mp4
    python3 03_extract_clips.py data/<video_slug>/shorts_plan.json --only clip_03
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys

from config import OUTPUT_WIDTH, OUTPUT_HEIGHT


def check_ffmpeg():
    if shutil.which("ffmpeg") is None:
        print("ERROR: ffmpeg is not installed or not on PATH.")
        print("       Install with: brew install ffmpeg")
        sys.exit(1)


def fmt_srt_timestamp(seconds):
    """Format seconds as SRT timestamp HH:MM:SS,mmm (relative to clip start)."""
    ms = int(round(seconds * 1000))
    h = ms // 3_600_000
    ms %= 3_600_000
    m = ms // 60_000
    ms %= 60_000
    s = ms // 1000
    ms %= 1000
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def build_clip_srt(transcript_json_path, clip_start, clip_end, out_srt_path):
    """
    Build an SRT for the clip using the relevant segments from the
    full Whisper transcript. Timestamps are re-based so 0 = clip start.
    """
    with open(transcript_json_path, "r") as f:
        data = json.load(f)

    lines = []
    idx = 1
    for seg in data["segments"]:
        # Keep any segment that overlaps the clip window
        if seg["end"] <= clip_start or seg["start"] >= clip_end:
            continue
        s = max(seg["start"], clip_start) - clip_start
        e = min(seg["end"], clip_end) - clip_start
        if e - s < 0.3:
            continue
        text = seg["text"].strip()
        lines.append(f"{idx}\n{fmt_srt_timestamp(s)} --> {fmt_srt_timestamp(e)}\n{text}\n")
        idx += 1

    with open(out_srt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def slugify(text, max_len=30):
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", text.lower()).strip("_")
    return slug[:max_len].rstrip("_") or "clip"


def extract_clip(video_path, start, end, out_mp4, srt_path):
    """
    Run ffmpeg: seek, crop to 9:16, burn in captions.
    Using -ss before -i for fast seek; re-encoding because we're
    cropping + scaling + adding subtitles.
    """
    # subtitle filter expects forward-slashes and escaped colons
    srt_escaped = srt_path.replace("\\", "/").replace(":", "\\:")
    vf = (
        f"scale={OUTPUT_WIDTH}:{OUTPUT_HEIGHT}:force_original_aspect_ratio=increase,"
        f"crop={OUTPUT_WIDTH}:{OUTPUT_HEIGHT},"
        f"subtitles='{srt_escaped}':force_style='Alignment=2,FontSize=14,"
        f"BorderStyle=3,Outline=2,Shadow=0,PrimaryColour=&H00FFFFFF&,"
        f"OutlineColour=&H00000000&,MarginV=120'"
    )

    cmd = [
        "ffmpeg", "-y",
        "-ss", f"{start:.2f}",
        "-to", f"{end:.2f}",
        "-i", video_path,
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "20",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        out_mp4,
    ]

    print(f"  ffmpeg → {os.path.basename(out_mp4)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ERROR extracting {out_mp4}:")
        print(result.stderr[-800:])
        return False
    return True


def main():
    parser = argparse.ArgumentParser(description="Extract vertical shorts with burned captions")
    parser.add_argument("plan", help="Path to shorts_plan.json")
    parser.add_argument("--video", default="", help="Override source video path")
    parser.add_argument("--only", default="", help="Extract only this clip_id (e.g. clip_03)")
    args = parser.parse_args()

    check_ffmpeg()

    plan_path = os.path.expanduser(args.plan)
    with open(plan_path, "r") as f:
        plan = json.load(f)

    out_dir = os.path.dirname(plan_path)
    transcript_path = os.path.join(out_dir, "transcript.json")
    if not os.path.isfile(transcript_path):
        print(f"ERROR: transcript.json not found next to plan: {transcript_path}")
        sys.exit(1)

    video_path = args.video or plan.get("video_path")
    if not video_path or not os.path.isfile(video_path):
        print(f"ERROR: Source video not found: {video_path}")
        print("       Pass --video <path> to override.")
        sys.exit(1)

    print(f"\n  ── STAGE 3: EXTRACT CLIPS ──")
    print(f"  Source: {video_path}")
    print(f"  Output: {out_dir}")

    succeeded = 0
    for short in plan["shorts"]:
        if args.only and short["clip_id"] != args.only:
            continue

        topic_slug = slugify(short["topic"])
        base = f"{short['clip_id']}_{topic_slug}"
        srt_path = os.path.join(out_dir, f"{base}.srt")
        mp4_path = os.path.join(out_dir, f"{base}.mp4")

        build_clip_srt(transcript_path, short["start"], short["end"], srt_path)

        if extract_clip(video_path, short["start"], short["end"], mp4_path, srt_path):
            succeeded += 1

    print(f"\n  ✓ Extracted {succeeded} clip(s)\n")


if __name__ == "__main__":
    main()
