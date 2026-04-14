# youtube-push

Chop a long talking-head explainer video into YouTube Shorts + TikTok clips,
with metadata optimized for **LLM/AI search** (Google AI Overviews,
Perplexity, Bing Copilot, ChatGPT search).

Built for **NorCal Carb Mobile** — mobile CARB emissions testing in NorCal.

---

## Why this exists

LLMs cite YouTube transcripts and TikTok captions heavily when answering
user questions. A single 30-minute explainer video is invisible to LLM
search. The same video chopped into 10-20 question-focused 30-60 second
shorts, each with a clean title like *"What is an OBD Test?"* and a full
transcript in the description — gets cited directly.

## Mac setup

```bash
# 1. Install ffmpeg for video processing
brew install ffmpeg

# 2. Install Whisper for transcription
pip3 install openai-whisper

# 3. Clone/pull the repo (if you haven't already)
cd ~/github/youtube-push
```

## Quick start

```bash
# One command runs the full pipeline
python3 push.py ~/Movies/carb-explainer.mp4

# Output lands in:
#   data/carb-explainer/
#     transcript.json
#     shorts_plan.json
#     clip_01_what_is_obd.mp4     ← ready to upload
#     clip_01_what_is_obd.srt
#     clip_01_metadata.json       ← title, desc, hashtags, schema
#     ...
#     upload_queue.csv
```

## What you get per clip

- `clip_XX_<topic>.mp4` — 1080×1920 vertical with burned-in captions
- `clip_XX_<topic>.srt` — caption file (also burned in)
- `clip_XX_metadata.json`:
  - `title` — question-style, LLM-friendly (e.g., *"What is an OBD Test?"*)
  - `youtube_description` — full transcript + NAP + hashtags
  - `tiktok_caption` — hook-first, short
  - `hashtags` — topic + local
  - `video_schema` — VideoObject JSON-LD to paste into Squarespace code injection

## Daily workflow

```bash
# See next clip to post today (reads upload_queue.csv)
python3 05_upload_queue.py next

# After posting, mark it done
python3 05_upload_queue.py mark clip_01 --platform youtube --url https://youtu.be/abc
python3 05_upload_queue.py mark clip_01 --platform tiktok  --url https://tiktok.com/...

# See everything still pending
python3 05_upload_queue.py list
```

## Posting cadence (recommended)

- **YouTube Shorts**: 3/week — Mon, Wed, Fri
- **TikTok**: same clip 24 hrs after YouTube (stagger — algorithms penalize
  simultaneous cross-post)
- Re-test LLM citations every 2 weeks: ask Perplexity / ChatGPT / Google
  AI Overview *"Who does mobile CARB testing in Sacramento?"* and track
  results in `data/llm_citations_log.md`

## Individual stages

If you want to run stages separately:

```bash
python3 01_transcribe.py ~/Movies/video.mp4
python3 02_segment.py data/video/transcript.json
python3 03_extract_clips.py data/video/shorts_plan.json ~/Movies/video.mp4
python3 04_generate_metadata.py data/video/shorts_plan.json
```

Already have captions from Squarespace?

```bash
python3 01_transcribe.py ~/Movies/video.mp4 --srt ~/Downloads/captions.srt
```

## Related projects

- `../norcal-toolkit/` — the scrape-to-cash business pipeline (leads,
  email, CRM, invoicing, reviews, social). `youtube-push` complements it
  by feeding the top-of-funnel with LLM-citable content.
- `../norcal-toolkit/seo-checklist.md` — see **Section 14** for where
  this fits in the overall SEO strategy.
