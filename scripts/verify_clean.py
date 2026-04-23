#!/usr/bin/env python3
"""Verify no duplicate articles remain in Sanity and report image coverage."""
import json, subprocess, collections

TOKEN = "sk9WlOh6b4SMr2Ak8BW0TgPFDkPchwxqTT21mYtrzUGGCAt5afYqEXU5gaPl8SMwaQV8AdMAHoVBRHzeDULUMff8SNidkfaC8c6VkZpsWqDWBbozISoXuroN96ayPZDx996RN1FhZD62P7UzrihzcGqtqg3UMCLAeJb3KppAueZIRm74xwvA"

r = subprocess.run([
    "curl", "-s",
    "https://tifzt4zw.api.sanity.io/v2024-01-01/data/query/production"
    "?query=*%5B_type%3D%3D%22article%22+%26%26+status%3D%3D%22published%22"
    "+%26%26+!(_id+in+path(%22drafts.**%22))%5D%7B_id%2C%22slug%22%3Aslug.current"
    "%2C%22img%22%3Adefined(mainImage.asset._ref)%7D%5B0...300%5D",
    "-H", f"Authorization: Bearer {TOKEN}"
], capture_output=True, text=True)

arts = json.loads(r.stdout).get("result", [])
print(f"Published articles: {len(arts)}")

by_slug = collections.defaultdict(list)
for a in arts:
    by_slug[a.get("slug", "") or a["_id"]].append(a["_id"])

dupes   = {k: v for k, v in by_slug.items() if len(v) > 1}
no_img  = [a for a in arts if not a.get("img")]
with_img = [a for a in arts if a.get("img")]

print(f"Duplicate slugs remaining: {len(dupes)}")
print(f"With image (feature-eligible): {len(with_img)}")
print(f"Without image (archive-only):  {len(no_img)}")

if dupes:
    print("\nSTILL DUPLICATED:")
    for slug, ids in dupes.items():
        print(f"  {slug[:55]} → {ids}")
else:
    print("\n✅ No duplicates in Sanity.")

if no_img:
    print(f"\nArticles without image (never appear in feature blocks):")
    for a in no_img:
        print(f"  {a['_id'][:20]}: {a.get('slug','?')[:50]}")
