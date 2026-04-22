# Hallowed Ground — Google Sheets Data Entry

## Setup

1. Create a new Google Sheet
2. Row 1 must be the exact header row below (copy-paste)
3. Share → Anyone with the link → Viewer
4. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/**SHEET_ID**/edit`

## Header Row (copy this exactly into row 1)

```
last_name	first_name	rank	branch	status	era	date_of_casualty	date_of_birth	age_at_casualty	battle_location	battle_lat	battle_lng	unit	service_number	source_url	source_label	notes
```

## Column Reference

| Column | Required | Format | Valid Values |
|--------|----------|--------|--------------|
| last_name | ✓ | Text | |
| first_name | ✓ | Text | |
| rank | | Text | CPL, SGT, PFC, LT, CPT, etc. |
| branch | ✓ | Text | army, navy, marines, air_force, coast_guard, special_forces |
| status | ✓ | Text | kia, mia, wia, pow |
| era | ✓ | Text | wwi, wwii, korea, vietnam, gulf, iraq, afghanistan |
| date_of_casualty | ✓ | YYYY-MM-DD | e.g. 1968-04-14 |
| date_of_birth | | YYYY-MM-DD | Used for duplicate detection |
| age_at_casualty | | Number | e.g. 21 |
| battle_location | ✓ | Text | Province, Country |
| battle_lat | ✓ | Decimal | e.g. 16.7500 |
| battle_lng | ✓ | Decimal | e.g. 107.1850 |
| unit | | Text | e.g. 1st Cavalry Division |
| service_number | | Text | e.g. RA-19-348-261 |
| source_url | | URL | Link to NARA or VVMF record |
| source_label | | Text | e.g. VVMF Wall of Faces |
| notes | | Text | Free text |

## Import Commands

```bash
# Dry run first — see what would be imported
node scripts/import-soldiers.mjs --sheet=YOUR_SHEET_ID --dry-run

# Live import
node scripts/import-soldiers.mjs --sheet=YOUR_SHEET_ID

# Specific tab (get gid= from the sheet URL)
node scripts/import-soldiers.mjs --sheet=YOUR_SHEET_ID --tab=1234567890

# Paste the full URL instead of just the ID — both work
node scripts/import-soldiers.mjs --sheet=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
```

## Multiple Sheets / Eras

Use separate tabs per conflict era. Each tab gets its own gid.
Import them one at a time:

```bash
node scripts/import-soldiers.mjs --sheet=SHEET_ID --tab=0        # Vietnam
node scripts/import-soldiers.mjs --sheet=SHEET_ID --tab=111111   # Korea
node scripts/import-soldiers.mjs --sheet=SHEET_ID --tab=222222   # WWII
```

The duplicate detection runs across all imports so nothing gets entered twice.

## Geocoding lat/lng

If you have location names but no coordinates, use one of these:
- https://www.latlong.net — manual lookup
- https://geocode.maps.co — free API (1,000 req/day)
- Use province/region centroids for battle zones (Vietnam especially)

Vietnam province centroids reference: https://github.com/datasets/geo-boundaries-world-110m
