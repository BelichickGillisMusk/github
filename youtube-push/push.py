#!/usr/bin/env python3
"""
youtube-push — Orchestrator

Runs all four stages for a long video:
    1. Transcribe (Whisper or existing SRT)
    2. Segment into 30-60 sec topic-focused shorts
    3. Extract vertical clips with burned-in captions (ffmpeg)
    4. Generate LLM-optimized metadata per clip
    5. Initialize upload queue CSV

Usage:
    python3 push.py ~/Movies/carb-explainer.mp4
    python3 push.py ~/Movies/carb-explainer.mp4 --srt captions.srt --max 15
    python3 push.py ~/Movies/carb-explainer.mp4 --model small

After this completes:
    python3 05_upload_queue.py next     # see the first clip to post
"""
import argparse
import os
import sys
import subprocess

from config import DATA_DIR


HERE = os.path.dirname(os.path.abspath(__file__))


def run(script, extra_args):
    cmd = [sys.executable, os.path.join(HERE, script)] + extra_args
    print(f"\n  $ {' '.join(cmd)}")
    result = subprocess.run(cmd)
    if result.returncode != 0:
        print(f"\n  ✗ {script} failed with exit code {result.returncode}")
        sys.exit(result.returncode)


def video_slug(video_path):
    import re
    name = os.path.splitext(os.path.basename(video_path))[0]
    slug = re.sub(r"[^a-zA-Z0-9_-]+", "_", name).strip("_").lower()
    return slug or "video"


def main():
    parser = argparse.ArgumentParser(description="Full video → shorts pipeline")
    parser.add_argument("video", help="Path to long video file")
    parser.add_argument("--srt", default="", help="Use existing SRT file instead of Whisper")
    parser.add_argument("--model", default="base",
                        choices=["tiny", "base", "small", "medium", "large"],
                        help="Whisper model size")
    parser.add_argument("--max", type=int, default=20, help="Max shorts to produce")
    args = parser.parse_args()

    video_path = os.path.expanduser(args.video)
    if not os.path.isfile(video_path):
        print(f"ERROR: Video not found: {video_path}")
        sys.exit(1)

    slug = video_slug(video_path)
    out_dir = os.path.join(DATA_DIR, slug)
    transcript_path = os.path.join(out_dir, "transcript.json")
    plan_path = os.path.join(out_dir, "shorts_plan.json")

    print(f"\n{'█' * 60}")
    print(f"  YOUTUBE-PUSH — {slug}")
    print(f"  {video_path}")
    print(f"{'█' * 60}")

    # Stage 1
    stage1_args = [video_path]
    if args.srt:
        stage1_args += ["--srt", os.path.expanduser(args.srt)]
    else:
        stage1_args += ["--model", args.model]
    run("01_transcribe.py", stage1_args)

    # Stage 2
    run("02_segment.py", [transcript_path, "--max", str(args.max)])

    # Stage 3
    run("03_extract_clips.py", [plan_path])

    # Stage 4
    run("04_generate_metadata.py", [plan_path])

    # Stage 5 — build the upload queue
    run("05_upload_queue.py", ["rebuild", plan_path])

    print(f"\n{'█' * 60}")
    print(f"  ✓ PIPELINE COMPLETE — {slug}")
    print(f"  Clips + metadata in: {out_dir}")
    print(f"{'█' * 60}\n")
    print(f"  Next: python3 05_upload_queue.py next")
    print(f"        (or open one of the clip_*.mp4 files in QuickTime to preview)\n")


if __name__ == "__main__":
    main()
