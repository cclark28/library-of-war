#!/usr/bin/env python3
"""Add images to Library of War articles in Sanity."""
import json, subprocess, time, urllib.parse, os

TOKEN = "sk9WlOh6b4SMr2Ak8BW0TgPFDkPchwxqTT21mYtrzUGGCAt5afYqEXU5gaPl8SMwaQV8AdMAHoVBRHzeDULUMff8SNidkfaC8c6VkZpsWqDWBbozISoXuroN96ayPZDx996RN1FhZD62P7UzrihzcGqtqg3UMCLAeJb3KppAueZIRm74xwvA"
BASE = "https://tifzt4zw.api.sanity.io/v2024-01-01"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# Articles that still need images (already have: Somme, Berlin Airlift, Inchon)
ARTS = [
    ("nboQQLUk2FOYJmEHhMO17S", "File:William Martin.jpg",
     "Document photograph of Major William Martin for Operation Mincemeat 1943",
     "Wikimedia Commons, public domain"),
    ("nMSxjXpD1FV0FKp4ZOy06G", "File:Battle of Midway, June 1942 (23876649112).jpg",
     "Battle of Midway aerial view June 1942",
     "US Navy photograph, public domain"),
    ("nboQQLUk2FOYJmEHhMO2QM", "File:USS Hornet (CV-8) launching B-25B Mitchell bomber during the Doolittle Raid on 18 April 1942.jpg",
     "USS Hornet launching B-25B Mitchell during the Doolittle Raid April 18 1942",
     "US Navy photograph, National Archives, public domain"),
    ("nboQQLUk2FOYJmEHhMO45K", "File:Tank supporting 1.5 Marines in the citadel of Hue.jpg",
     "US Marines advance through Hue Citadel during the Tet Offensive 1968",
     "US Marine Corps photograph, public domain"),
    ("5HfN120UQvvCz6r9dtmRv0", "File:Bundesarchiv Bild 183-W0506-316, Russland, Kampf um Stalingrad, Infanterie.jpg",
     "German infantry advance through Stalingrad ruins autumn 1942",
     "Bundesarchiv Bild 183-W0506-316, CC-BY-SA 3.0"),
    ("nMSxjXpD1FV0FKp4ZOy12S", "File:Operation 'market Garden' (the Battle For Arnhem)- 17 - 25 September 1944 EA37782.jpg",
     "British paratroopers during Operation Market Garden Arnhem September 1944",
     "Imperial War Museum, public domain"),
    ("5HfN120UQvvCz6r9dtmSCI", "File:Leonidas at Thermopylae, 1814, by Jacques-Louis David, depicting Sparta's King Leonidas before the Battle of Thermopylae. (11606613584).jpg",
     "Leonidas at Thermopylae by Jacques-Louis David 1814, Louvre Museum",
     "Jacques-Louis David 1814, Louvre Museum, public domain"),
    ("nMSxjXpD1FV0FKp4ZOy1AG", "File:Battleship Bismarck burning and sinking 1941.jpg",
     "German battleship Bismarck burning and sinking May 27 1941",
     "Wikimedia Commons, public domain"),
    ("5HfN120UQvvCz6r9dtmTUG", "File:United States Army M1A1 Abrams tank deployed during Operation Desert Storm.jpg",
     "US Army M1A1 Abrams tank during Operation Desert Storm February 1991",
     "US Army photograph, public domain"),
]


def wm_url(fname):
    enc = urllib.parse.quote(fname)
    r = subprocess.run(["curl", "-s", "--max-time", "10", "-A", UA,
        f"https://commons.wikimedia.org/w/api.php?action=query&titles={enc}&prop=imageinfo&iiprop=url&format=json"],
        capture_output=True, text=True)
    try:
        d = json.loads(r.stdout)
        for _, pg in d["query"]["pages"].items():
            if "imageinfo" in pg:
                return pg["imageinfo"][0]["url"]
    except Exception as e:
        print(f"    wm_url error: {e}")
    return None


def dl_upload(url):
    tmp = "/tmp/low_final.jpg"
    subprocess.run(["curl", "-s", "-L", "-o", tmp, "--max-time", "30", "-A", UA,
        "-H", "Accept: image/jpeg,image/*,*/*", url], capture_output=True)
    sz = os.path.getsize(tmp) if os.path.exists(tmp) else 0
    if sz < 5000:
        if os.path.exists(tmp): os.unlink(tmp)
        return None
    r = subprocess.run(["curl", "-s", "-X", "POST",
        f"{BASE}/assets/images/production",
        "-H", f"Authorization: Bearer {TOKEN}",
        "-H", "Content-Type: image/jpeg",
        "--data-binary", f"@{tmp}"],
        capture_output=True, text=True)
    if os.path.exists(tmp): os.unlink(tmp)
    try:
        return json.loads(r.stdout).get("document", {}).get("_id") or ""
    except:
        return None


def patch_article(doc_id, asset_id, alt, cap, src_url):
    patch = {"mutations": [{"patch": {"id": doc_id, "set": {
        "mainImage": {
            "_type": "image",
            "asset": {"_type": "reference", "_ref": asset_id},
            "alt": alt,
            "caption": cap,
            "sourceUrl": src_url
        }
    }}}]}
    subprocess.run(["curl", "-s", "-X", "POST",
        f"{BASE}/data/mutate/production",
        "-H", f"Authorization: Bearer {TOKEN}",
        "-H", "Content-Type: application/json",
        "-d", json.dumps(patch)],
        capture_output=True)


print(f"\nAdding images to {len(ARTS)} articles...\n")
success, skip = 0, 0

for doc_id, fname, alt, cap in ARTS:
    print(f"[{doc_id[:15]}] {fname[:50]}")
    url = wm_url(fname)
    if not url:
        print("  no URL found — skipping")
        skip += 1
        continue
    print(f"  url: {url[:65]}")
    asset_id = dl_upload(url)
    if not asset_id:
        print("  upload failed — skipping")
        skip += 1
        continue
    patch_article(doc_id, asset_id, alt, cap, url)
    print(f"  ✓ patched: {asset_id[:22]}")
    success += 1
    time.sleep(1)

print(f"\nDone — {success} images added, {skip} skipped")
