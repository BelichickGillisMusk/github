"""
youtube-push — Shared config.
Pulls business info from ../norcal-toolkit/config.py so there's one source
of truth for phone, website, BAR license, etc.
"""
import os
import sys

# Import norcal-toolkit config
_TOOLKIT_DIR = os.path.join(os.path.dirname(__file__), "..", "norcal-toolkit")
sys.path.insert(0, os.path.abspath(_TOOLKIT_DIR))

try:
    from config import (
        BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_EMAIL,
        BUSINESS_WEBSITE, BAR_LICENSE, OWNER_NAME,
        SERVICE_AREAS,
    )
except ImportError:
    # Fallback defaults if toolkit is not available
    BUSINESS_NAME = os.getenv("NORCAL_BUSINESS_NAME", "NorCal Carb Mobile")
    BUSINESS_PHONE = os.getenv("NORCAL_PHONE", "(916) 555-0199")
    BUSINESS_EMAIL = os.getenv("NORCAL_EMAIL", "bryan@norcalcarbmobile.com")
    BUSINESS_WEBSITE = os.getenv("NORCAL_WEBSITE", "https://norcalcarbmobile.com")
    BAR_LICENSE = os.getenv("NORCAL_BAR_LICENSE", "BAR-XXXXXX")
    OWNER_NAME = os.getenv("NORCAL_OWNER", "Bryan")
    SERVICE_AREAS = {}

# ─── CARB-specific identifiers ────────────────────────────────────
CARB_TESTER_ID = os.getenv("CARB_TESTER_ID", "IF530523")

# ─── Data paths ───────────────────────────────────────────────────
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

# ─── Short-form video defaults ────────────────────────────────────
SHORT_MIN_SECONDS = 30
SHORT_TARGET_SECONDS = 45
SHORT_MAX_SECONDS = 90

# Output dimensions (YouTube Shorts + TikTok native)
OUTPUT_WIDTH = 1080
OUTPUT_HEIGHT = 1920

# ─── Topic keywords for segmentation ──────────────────────────────
# Each key is a topic; values are keyword patterns that trigger a match
# in the transcript. Used by 02_segment.py to find LLM-friendly clips.
TOPIC_KEYWORDS = {
    "obd_test": [
        "obd", "on-board diagnostics", "on board diagnostics",
        "diagnostic trouble code", "dtc", "readiness monitor",
    ],
    "ovi_test": [
        "ovi", "opacity", "visual inspection", "snap idle",
        "sae j1667", "smoke test",
    ],
    "ovi_vs_obd": [
        "difference between", "ovi or obd", "obd or ovi",
        "which test", "what's the difference",
    ],
    "carb_2027": [
        "2027", "quarterly", "four times a year", "4x per year",
        "four tests",
    ],
    "fleet_testing": [
        "fleet", "volume discount", "multiple vehicles", "five or more",
        "mobile testing", "on-site testing", "on site testing",
    ],
    "hd_im": [
        "hd i/m", "hd im", "heavy duty inspection and maintenance",
        "clean truck check",
    ],
    "non_compliance": [
        "dmv hold", "10,000", "ten thousand", "penalty", "fine",
        "fail the test", "what happens if you fail",
    ],
    "who_needs_testing": [
        "14,000 pounds", "14000 pounds", "gvwr", "diesel",
        "out of state", "out-of-state", "exemption", "who needs",
    ],
    "frequency": [
        "how often", "twice a year", "two times a year", "2x per year",
        "every six months",
    ],
    "cost": [
        "how much", "cost", "price", "pricing", "dollar", "$",
        "75", "85", "fee",
    ],
}

# ─── Question-style title patterns (for LLM matching) ─────────────
# Phrases in the transcript that indicate a Q&A moment worth keeping
# even if no topic keyword matches.
QUESTION_PATTERNS = [
    "did you know",
    "what is",
    "what's",
    "how often",
    "how much",
    "why",
    "when does",
    "when do",
    "do you",
    "does your",
    "is it true",
    "what happens if",
    "what should",
    "how do you",
]

# ─── Hashtags by topic ────────────────────────────────────────────
HASHTAGS_CORE = [
    "#CARBCompliance", "#CleanTruckCheck", "#MobileSmogTesting",
    "#Sacramento", "#NorCalTrucking", "#FleetCompliance",
    "#HDIM", "#DieselTrucks",
]

HASHTAGS_BY_TOPIC = {
    "obd_test": ["#OBDTest", "#DieselDiagnostics"],
    "ovi_test": ["#OVITest", "#SmokeOpacity"],
    "ovi_vs_obd": ["#OBDvsOVI", "#FleetTips"],
    "carb_2027": ["#CARB2027", "#QuarterlyTesting"],
    "fleet_testing": ["#FleetTesting", "#MobileFleet"],
    "hd_im": ["#HDIM", "#CleanTruckCheck"],
    "non_compliance": ["#CARBFines", "#FleetCompliance"],
    "who_needs_testing": ["#DieselTruckOwners", "#CARBRules"],
    "frequency": ["#TestingSchedule", "#FleetMaintenance"],
    "cost": ["#FleetBudget", "#TestingCost"],
}
