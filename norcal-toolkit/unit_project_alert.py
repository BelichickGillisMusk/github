#!/usr/bin/env python3
"""
THE UNIT: Daily Project Alert

Scans local Hub folders and prints a daily list of Python/text files waiting
for review and finalization.
"""
import argparse
import datetime
import os


UNIT_DIRECTORY = "./The_Unit_Assembly"
PENDING_EXTENSIONS = (".py", ".txt")


def scan_projects(unit_directory=UNIT_DIRECTORY):
    """Scan local Hub directories and generate a daily alert of pending work."""
    today = datetime.date.today()
    print("\n====================================================")
    print(f" 🚨 THE UNIT: DAILY PROJECT ALERT for {today} 🚨")
    print("====================================================\n")

    if not os.path.exists(unit_directory):
        print(f"Directory '{unit_directory}' not found.")
        print("Please create it and add your 'Hub' folders to get started.")
        return 0

    hubs = sorted(f.name for f in os.scandir(unit_directory) if f.is_dir())

    if not hubs:
        print("Your Unit directory is currently empty.")
        print("Action: Run the AI Extraction Prompts and paste the code into your Hubs!")
        return 0

    total_files = 0

    for hub in hubs:
        hub_path = os.path.join(unit_directory, hub)
        files = sorted(
            file_name
            for file_name in os.listdir(hub_path)
            if file_name.endswith(PENDING_EXTENSIONS)
        )

        print(f"📁 HUB: {hub.replace('_', ' ').upper()}")
        if not files:
            print(" - Empty (No pending tasks here)")
        else:
            for file_name in files:
                print(f" 📄 {file_name} -> Status: Needs review and finalization")
                total_files += 1
        print("")

    print(f"--- Summary: You have {total_files} pieces of code waiting to be finished. ---")
    print("Pick ONE file today, share it with your Coding Partner, and let's complete it.")
    return total_files


def main():
    parser = argparse.ArgumentParser(description="Generate THE UNIT daily project alert")
    parser.add_argument(
        "--directory",
        default=UNIT_DIRECTORY,
        help=f"Unit Assembly folder to scan (default: {UNIT_DIRECTORY})",
    )
    args = parser.parse_args()

    scan_projects(args.directory)


if __name__ == "__main__":
    main()
