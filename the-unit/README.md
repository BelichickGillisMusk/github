# THE UNIT — Daily Project Alert

Personal productivity scanner that walks your local `The_Unit_Assembly/`
directory and lists every `.py` / `.txt` file in each "Hub" subfolder that is
still pending review and finalization.

## Layout

```
the-unit/
├── unit_alert.py            # The scanner script
└── The_Unit_Assembly/       # Master folder; one subfolder per Hub
    ├── Hub_Lead_Generation/
    ├── Hub_CRM_Automation/
    └── Hub_Content_Engine/
```

Drop pasted AI-generated code into the appropriate Hub as `.py` or `.txt`
files. Anything sitting in a Hub is treated as "waiting to be finished".

## Usage

```bash
# From repo root
python3 the-unit/unit_alert.py

# Or point at a Unit Assembly folder living elsewhere
python3 the-unit/unit_alert.py --dir /path/to/The_Unit_Assembly
```

The script prints a daily-dated banner, lists pending files per Hub, and ends
with a total count plus a one-action nudge ("pick ONE file today").

## Tip

Add it to your morning routine alongside `norcal-toolkit/daily_workflow.py` so
both pipelines (sales follow-ups and code finalization) get a daily ping.
