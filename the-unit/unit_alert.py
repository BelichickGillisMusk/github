#!/usr/bin/env python3
"""
THE UNIT — Daily Project Alert
Scans your local Hub directories under ``The_Unit_Assembly`` and prints a
daily list of code files (.py / .txt) that are still pending review and
finalization.

Usage:
    python3 unit_alert.py
    python3 unit_alert.py --dir /custom/path/to/The_Unit_Assembly
"""
import argparse
import datetime
import os
import sys

DEFAULT_UNIT_DIRECTORY = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "The_Unit_Assembly",
)


def scan_projects(unit_directory: str) -> int:
    """Scan local Hub directories and print a daily alert of pending work.

    Returns the total number of pending files found.
    """
    today = datetime.date.today()
    print("\n====================================================")
    print(f" 🚨 THE UNIT: DAILY PROJECT ALERT for {today} 🚨")
    print("====================================================\n")

    if not os.path.exists(unit_directory):
        print(f"Directory '{unit_directory}' not found.")
        print("Please create it and add your 'Hub' folders to get started.")
        return 0

    hubs = sorted(
        f.name for f in os.scandir(unit_directory) if f.is_dir()
    )

    if not hubs:
        print("Your Unit directory is currently empty.")
        print("Action: Run the AI Extraction Prompts and paste the code into your Hubs!")
        return 0

    total_files = 0

    for hub in hubs:
        hub_path = os.path.join(unit_directory, hub)
        files = sorted(
            f for f in os.listdir(hub_path)
            if f.endswith(".py") or f.endswith(".txt")
        )

        print(f"📁 HUB: {hub.replace('_', ' ').upper()}")
        if not files:
            print("   - Empty (No pending tasks here)")
        else:
            for file in files:
                print(f"   📄 {file}  ->  Status: Needs review and finalization")
                total_files += 1
        print("")

    print(f"--- Summary: You have {total_files} pieces of code waiting to be finished. ---")
    print("Pick ONE file today, share it with your Coding Partner, and let's complete it.")
    return total_files


def main() -> int:
    parser = argparse.ArgumentParser(description="THE UNIT — Daily Project Alert")
    parser.add_argument(
        "--dir",
        default=DEFAULT_UNIT_DIRECTORY,
        help=f"Path to The_Unit_Assembly directory (default: {DEFAULT_UNIT_DIRECTORY})",
    )
    args = parser.parse_args()
    scan_projects(args.dir)
    return 0


if __name__ == "__main__":
    sys.exit(main())
