"""
debrief_mailer.py
-----------------
Pulls the top 3 most-viewed pages from your site via Google Analytics 4,
renders them into the Debrief email template, and creates a scheduled
broadcast in Kit (ConvertKit) for the upcoming Monday at 6:00 AM.

Requirements:
    pip install google-analytics-data requests python-dateutil beautifulsoup4

Configuration (set as environment variables or edit CONFIG below):
    KIT_API_KEY          — Kit API v4 key (Settings > Developer > API Keys)
    GA4_PROPERTY_ID      — GA4 Property ID (e.g. "123456789")
    GA4_CREDENTIALS_JSON — Path to Google service account JSON keyfile
    SITE_URL             — Your site's base URL (e.g. "https://example.com")
    SITE_DOMAIN          — Display domain (e.g. "example.com")
    SEND_HOUR_UTC        — Hour to send, in UTC (default: 6 for 6 AM UTC)
    TEMPLATE_PATH        — Path to debrief_template.html (default: same dir)

    Optional:
    URL_EXCLUDE_PATTERNS — Comma-separated path patterns to exclude
                           (e.g. "/tag/,/author/,/page/")
"""

import os
import re
import json
import requests
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ── Configuration ─────────────────────────────────────────────────────────────

CONFIG = {
    "kit_api_key":           os.environ.get("KIT_API_KEY", ""),
    "ga4_property_id":       os.environ.get("GA4_PROPERTY_ID", ""),
    "ga4_credentials_json":  os.environ.get("GA4_CREDENTIALS_JSON", "ga4_credentials.json"),
    "site_url":              os.environ.get("SITE_URL", "https://example.com"),
    "site_domain":           os.environ.get("SITE_DOMAIN", "example.com"),
    "send_hour_utc":         int(os.environ.get("SEND_HOUR_UTC", "6")),
    "template_path":         os.environ.get("TEMPLATE_PATH", str(Path(__file__).parent / "debrief_template.html")),
    "url_exclude_patterns":  os.environ.get("URL_EXCLUDE_PATTERNS", "/tag/,/author/,/page/,/category/").split(","),
}

KIT_BASE = "https://api.kit.com/v4"


# ── GA4: Top 3 pages ──────────────────────────────────────────────────────────

def get_top_pages(property_id: str, credentials_path: str, exclude: list[str], limit: int = 10) -> list[dict]:
    """
    Queries GA4 for the top pages by screenPageViews in the past 7 days.
    Returns a list of dicts: [{"path": "/some-post/", "views": 1234}, ...]
    """
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange, Dimension, Metric, RunReportRequest,
    )
    from google.oauth2 import service_account

    creds = service_account.Credentials.from_service_account_file(
        credentials_path,
        scopes=["https://www.googleapis.com/auth/analytics.readonly"],
    )
    client = BetaAnalyticsDataClient(credentials=creds)

    today = datetime.now(timezone.utc).date()
    seven_days_ago = today - timedelta(days=7)

    request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[Dimension(name="pagePath")],
        metrics=[Metric(name="screenPageViews")],
        date_ranges=[DateRange(
            start_date=seven_days_ago.isoformat(),
            end_date=today.isoformat(),
        )],
        limit=limit,
        order_bys=[{"metric": {"metric_name": "screenPageViews"}, "desc": True}],
    )

    response = client.run_report(request)

    pages = []
    for row in response.rows:
        path = row.dimension_values[0].value
        views = int(row.metric_values[0].value)
        # Skip paths matching any exclusion pattern
        if any(pattern.strip() in path for pattern in exclude if pattern.strip()):
            continue
        # Skip the homepage
        if path in ("/", ""):
            continue
        pages.append({"path": path, "views": views})

    return pages[:3]


# ── Fetch page metadata (title + excerpt) ─────────────────────────────────────

def fetch_page_meta(url: str) -> dict:
    """
    Fetches a page and extracts <title> and <meta name="description"> or
    the first meaningful <p> as a fallback excerpt.
    Returns {"title": "...", "excerpt": "..."}
    """
    try:
        from bs4 import BeautifulSoup
        resp = requests.get(url, timeout=10, headers={"User-Agent": "Debrief-Mailer/1.0"})
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # Title
        og_title = soup.find("meta", property="og:title")
        title = (og_title["content"] if og_title else None) or (soup.title.string if soup.title else url)
        title = title.strip()

        # Excerpt — OG description first, then meta description, then first <p>
        og_desc = soup.find("meta", property="og:description")
        meta_desc = soup.find("meta", {"name": "description"})
        if og_desc and og_desc.get("content"):
            excerpt = og_desc["content"].strip()
        elif meta_desc and meta_desc.get("content"):
            excerpt = meta_desc["content"].strip()
        else:
            paragraphs = soup.find_all("p")
            excerpt = ""
            for p in paragraphs:
                text = p.get_text(strip=True)
                if len(text) > 60:
                    excerpt = text[:200].rstrip() + "…"
                    break

        return {"title": title, "excerpt": excerpt}

    except Exception as e:
        print(f"  Warning: could not fetch metadata for {url}: {e}")
        return {"title": url, "excerpt": ""}


# ── Render the email template ─────────────────────────────────────────────────

def render_template(template_path: str, stories: list[dict], issue_date: str, site_url: str, site_domain: str) -> str:
    """
    Substitutes {{PLACEHOLDERS}} in the HTML template with real story data.
    stories: list of 3 dicts with keys: title, excerpt, url
    """
    template = Path(template_path).read_text(encoding="utf-8")

    preheader = " · ".join(s["title"][:40] for s in stories)

    replacements = {
        "{{ISSUE_DATE}}":        issue_date,
        "{{PREHEADER_TEXT}}":    preheader,
        "{{SITE_URL}}":          site_url,
        "{{SITE_DOMAIN}}":       site_domain,
    }

    for i, story in enumerate(stories, start=1):
        n = str(i)
        replacements[f"{{{{STORY_{n}_TITLE}}}}"]   = story["title"]
        replacements[f"{{{{STORY_{n}_EXCERPT}}}}"]  = story["excerpt"]
        replacements[f"{{{{STORY_{n}_URL}}}}"]      = story["url"]

    for placeholder, value in replacements.items():
        template = template.replace(placeholder, value)

    return template


# ── Kit API: create scheduled broadcast ───────────────────────────────────────

def next_monday_at(hour_utc: int) -> str:
    """
    Returns an ISO 8601 string for the upcoming Monday at `hour_utc` UTC.
    If today is Monday and it's before the send hour, uses today.
    """
    now = datetime.now(timezone.utc)
    days_until_monday = (7 - now.weekday()) % 7  # weekday: Mon=0, Sun=6
    if days_until_monday == 0 and now.hour >= hour_utc:
        days_until_monday = 7  # already past this Monday's send time, use next week
    send_dt = datetime(
        now.year, now.month, now.day,
        hour_utc, 0, 0, tzinfo=timezone.utc
    ) + timedelta(days=days_until_monday)
    return send_dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def create_kit_broadcast(api_key: str, subject: str, html_body: str, send_at: str) -> dict:
    """
    Creates a draft broadcast in Kit and schedules it.
    Kit API v4 docs: https://developers.kit.com/api-reference/overview
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type":  "application/json",
        "Accept":        "application/json",
    }

    # Step 1: Create broadcast as draft
    payload = {
        "subject":    subject,
        "content":    html_body,
        "send_at":    send_at,          # ISO 8601 UTC — Kit will schedule it
        "public":     False,            # don't publish to web
        "email_layout_template": None,  # use Kit's plain layout (we supply full HTML)
    }

    resp = requests.post(
        f"{KIT_BASE}/broadcasts",
        headers=headers,
        json=payload,
        timeout=30,
    )

    if not resp.ok:
        raise RuntimeError(
            f"Kit API error {resp.status_code}: {resp.text}"
        )

    data = resp.json()
    broadcast_id = data.get("broadcast", {}).get("id") or data.get("id")

    print(f"  Broadcast created: id={broadcast_id}, scheduled={send_at}")
    return data


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    cfg = CONFIG

    # Validate required config
    missing = [k for k in ("kit_api_key", "ga4_property_id") if not cfg[k]]
    if missing:
        raise SystemExit(
            f"Missing required config: {', '.join(missing)}\n"
            "Set them as environment variables (see top of this file)."
        )

    print("── Debrief Mailer ──────────────────────────────")

    # 1. Get top 3 pages from GA4
    print(f"\n[1/4] Fetching top pages from GA4 property {cfg['ga4_property_id']}...")
    pages = get_top_pages(
        property_id=cfg["ga4_property_id"],
        credentials_path=cfg["ga4_credentials_json"],
        exclude=cfg["url_exclude_patterns"],
    )
    if not pages:
        raise SystemExit("No qualifying pages returned from GA4. Check your property ID and exclusion patterns.")
    print(f"      Got {len(pages)} pages.")
    for p in pages:
        print(f"      {p['views']:,} views — {p['path']}")

    # 2. Fetch metadata for each page
    print("\n[2/4] Fetching page titles and excerpts...")
    stories = []
    for page in pages:
        url = cfg["site_url"].rstrip("/") + page["path"]
        print(f"      Fetching {url}")
        meta = fetch_page_meta(url)
        stories.append({
            "title":   meta["title"],
            "excerpt": meta["excerpt"],
            "url":     url,
            "views":   page["views"],
        })
        print(f"      → {meta['title'][:60]}")

    # 3. Render email
    print("\n[3/4] Rendering email template...")
    issue_date = datetime.now(timezone.utc).strftime("%B %-d, %Y").upper()
    html_body = render_template(
        template_path=cfg["template_path"],
        stories=stories,
        issue_date=issue_date,
        site_url=cfg["site_url"],
        site_domain=cfg["site_domain"],
    )
    print(f"      Template rendered ({len(html_body):,} chars).")

    # 4. Schedule broadcast in Kit
    send_at = next_monday_at(cfg["send_hour_utc"])
    subject = f"Debrief — {datetime.now(timezone.utc).strftime('%B %-d')}"
    print(f"\n[4/4] Creating Kit broadcast...")
    print(f"      Subject : {subject}")
    print(f"      Send at : {send_at} UTC")

    result = create_kit_broadcast(
        api_key=cfg["kit_api_key"],
        subject=subject,
        html_body=html_body,
        send_at=send_at,
    )

    print("\n✓ Done. Broadcast scheduled in Kit.")
    return result


if __name__ == "__main__":
    main()
