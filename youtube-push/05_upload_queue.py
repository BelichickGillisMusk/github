#!/usr/bin/env python3
"""
youtube-push — Stage 5: Upload Queue

CSV-based tracker for which clips have been posted to YouTube Shorts
and TikTok. Manual posting (YouTube/TikTok APIs need OAuth; that's a
future add) — this script hands you the exact copy-paste text and
remembers what's done.

Usage:
    python3 05_upload_queue.py list                              # all pending
    python3 05_upload_queue.py next                              # next clip to post
    python3 05_upload_queue.py next --video carb-explainer       # from specific video
    python3 05_upload_queue.py mark clip_01 --platform youtube --url https://youtu.be/abc
    python3 05_upload_queue.py mark clip_01 --platform tiktok  --url https://tiktok.com/...
    python3 05_upload_queue.py rebuild data/<slug>/shorts_plan.json  # (re)create CSV
"""
import argparse
import csv
import glob
import json
import os
import sys
from datetime import datetime

from config import DATA_DIR


QUEUE_HEADERS = [
    "clip_id", "video_slug", "topic", "title", "duration",
    "yt_posted_date", "yt_url",
    "tiktok_posted_date", "tiktok_url",
    "notes",
]


def queue_path_for(video_slug):
    return os.path.join(DATA_DIR, video_slug, "upload_queue.csv")


def load_queue(queue_csv):
    if not os.path.isfile(queue_csv):
        return []
    with open(queue_csv, "r", newline="") as f:
        return list(csv.DictReader(f))


def save_queue(queue_csv, rows):
    os.makedirs(os.path.dirname(queue_csv), exist_ok=True)
    with open(queue_csv, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=QUEUE_HEADERS)
        w.writeheader()
        for row in rows:
            w.writerow({k: row.get(k, "") for k in QUEUE_HEADERS})


def rebuild_queue(plan_path):
    plan_path = os.path.expanduser(plan_path)
    with open(plan_path, "r") as f:
        plan = json.load(f)

    video_slug = plan.get("video_slug", "video")
    queue_csv = queue_path_for(video_slug)
    existing = {row["clip_id"]: row for row in load_queue(queue_csv)}

    rows = []
    for short in plan["shorts"]:
        row = existing.get(short["clip_id"], {})
        row.update({
            "clip_id": short["clip_id"],
            "video_slug": video_slug,
            "topic": short["topic"],
            "title": short["title_draft"],
            "duration": f"{short['duration']:.1f}",
        })
        rows.append(row)

    save_queue(queue_csv, rows)
    print(f"  ✓ Rebuilt queue with {len(rows)} clips: {queue_csv}")


def find_all_queues():
    pattern = os.path.join(DATA_DIR, "*", "upload_queue.csv")
    return sorted(glob.glob(pattern))


def list_pending(video_slug=None):
    queues = [queue_path_for(video_slug)] if video_slug else find_all_queues()
    if not queues:
        print("  No upload queues found. Run `push.py` or `05_upload_queue.py rebuild` first.")
        return

    total = 0
    pending = 0
    for q in queues:
        rows = load_queue(q)
        if not rows:
            continue
        video = os.path.basename(os.path.dirname(q))
        print(f"\n  ── {video} ──")
        for row in rows:
            total += 1
            yt = "✓" if row.get("yt_url") else "·"
            tt = "✓" if row.get("tiktok_url") else "·"
            status = f"YT{yt} TT{tt}"
            if not row.get("yt_url") or not row.get("tiktok_url"):
                pending += 1
            print(f"    [{status}] {row['clip_id']}  {row['duration']}s  {row['title']}")
    print(f"\n  {pending} pending / {total} total\n")


def next_clip(video_slug=None):
    queues = [queue_path_for(video_slug)] if video_slug else find_all_queues()
    if not queues:
        print("  No upload queues found.")
        return

    # Pick the first clip missing a YT url (then TikTok url)
    for q in queues:
        rows = load_queue(q)
        video = os.path.basename(os.path.dirname(q))
        for row in rows:
            if not row.get("yt_url"):
                show_next(video, row, "youtube")
                return
        for row in rows:
            if not row.get("tiktok_url"):
                show_next(video, row, "tiktok")
                return

    print("  ✓ All clips posted to both platforms. Great work.")


def show_next(video_slug, row, platform):
    """Print the copy-paste-ready upload package for a specific clip."""
    meta_path = os.path.join(DATA_DIR, video_slug, f"{row['clip_id']}_metadata.json")
    if not os.path.isfile(meta_path):
        print(f"  WARN: metadata not found: {meta_path}")
        print(f"        Run `04_generate_metadata.py` first.")
        return

    with open(meta_path, "r") as f:
        meta = json.load(f)

    print(f"\n{'═' * 60}")
    print(f"  NEXT UPLOAD — {platform.upper()}")
    print(f"  {video_slug} · {row['clip_id']} · {row['duration']}s")
    print(f"{'═' * 60}\n")

    clip_file = os.path.join(DATA_DIR, video_slug, meta["clip_file"])
    print(f"  FILE:     {clip_file}")
    print(f"  TITLE:    {meta['title']}\n")

    if platform == "youtube":
        print(f"  DESCRIPTION (paste into YouTube):")
        print(f"  {'─' * 40}")
        for line in meta["youtube_description"].split("\n"):
            print(f"  {line}")
        print(f"  {'─' * 40}\n")
        print(f"  After posting, run:")
        print(f"    python3 05_upload_queue.py mark {row['clip_id']} --platform youtube --url <URL>\n")
    else:
        print(f"  CAPTION (paste into TikTok):")
        print(f"  {'─' * 40}")
        print(f"  {meta['tiktok_caption']}")
        print(f"  {'─' * 40}\n")
        print(f"  After posting, run:")
        print(f"    python3 05_upload_queue.py mark {row['clip_id']} --platform tiktok --url <URL>\n")


def mark_posted(clip_id, platform, url, video_slug=None):
    queues = [queue_path_for(video_slug)] if video_slug else find_all_queues()

    for q in queues:
        rows = load_queue(q)
        for row in rows:
            if row["clip_id"] == clip_id:
                today = datetime.now().strftime("%Y-%m-%d")
                if platform == "youtube":
                    row["yt_posted_date"] = today
                    row["yt_url"] = url
                elif platform == "tiktok":
                    row["tiktok_posted_date"] = today
                    row["tiktok_url"] = url
                else:
                    print(f"  ERROR: unknown platform: {platform}")
                    return
                save_queue(q, rows)
                video = os.path.basename(os.path.dirname(q))
                print(f"  ✓ Marked {video}/{clip_id} posted to {platform}")
                return

    print(f"  ERROR: clip_id '{clip_id}' not found in any queue.")
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Track YouTube Shorts / TikTok uploads")
    sub = parser.add_subparsers(dest="command")

    list_p = sub.add_parser("list", help="Show all clips and their posting status")
    list_p.add_argument("--video", default="", help="Restrict to one video_slug")

    next_p = sub.add_parser("next", help="Show next clip to upload (copy-paste ready)")
    next_p.add_argument("--video", default="", help="Restrict to one video_slug")

    mark_p = sub.add_parser("mark", help="Mark a clip as posted")
    mark_p.add_argument("clip_id")
    mark_p.add_argument("--platform", required=True, choices=["youtube", "tiktok"])
    mark_p.add_argument("--url", required=True)
    mark_p.add_argument("--video", default="", help="Restrict to one video_slug")

    rebuild_p = sub.add_parser("rebuild", help="Rebuild upload queue from shorts_plan.json")
    rebuild_p.add_argument("plan", help="Path to shorts_plan.json")

    args = parser.parse_args()

    if args.command == "list":
        list_pending(args.video or None)
    elif args.command == "next":
        next_clip(args.video or None)
    elif args.command == "mark":
        mark_posted(args.clip_id, args.platform, args.url, args.video or None)
    elif args.command == "rebuild":
        rebuild_queue(args.plan)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
