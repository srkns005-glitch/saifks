#!/usr/bin/env python3
"""Build a checked, static Arabic translation of the Hero Center source data."""
import concurrent.futures
import json
import pathlib
import re
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
def embedded(name, pattern):
    match = re.search(pattern, HTML, re.S)
    if not match:
        raise RuntimeError(f"Missing {name} in index.html")
    return json.loads(match.group(1))

heroes = embedded("heroes", r"const heroes=(\[.*?\]);")
overviews = embedded("Arabic overviews", r"const AR_HERO_OVERVIEWS=(\{.*?\});")
tips = embedded("Arabic tips", r"const AR_SAIF_TIPS=(\{.*?\});")
assert len(heroes) == len(overviews) == len(tips) == 34
unique = sorted({line for hero in heroes for section in ("conquest", "expedition", "gear") for line in hero[section]})
numbers = re.compile(r"\d[\d,.]*%?")
def translate(text):
    if not text.strip():
        return text
    query = urllib.parse.urlencode({"client": "gtx", "sl": "en", "tl": "ar", "dt": "t", "q": text})
    request = urllib.request.Request("https://translate.googleapis.com/translate_a/single?" + query,
                                     headers={"User-Agent": "Mozilla/5.0"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=15) as response:
                data = json.load(response)
            result = "".join(part[0] or "" for part in data[0]).strip()
            if not result or numbers.findall(text) != numbers.findall(result):
                raise ValueError("Missing text or altered numbers")
            return result
        except Exception:
            if attempt == 4:
                raise RuntimeError(f"Could not safely translate: {text[:90]}")
            time.sleep(1.5 * (attempt + 1))

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    translated = list(pool.map(translate, unique))
lookup = dict(zip(unique, translated))
result = {
    hero["id"]: {
        "overview": [overviews[hero["id"]]],
        "saifTip": [tips[hero["id"]]],
        **{section: [lookup[line] for line in hero[section]]
           for section in ("conquest", "expedition", "gear")}
    }
    for hero in heroes
}
for hero in heroes:
    entry = result[hero["id"]]
    for section in ("conquest", "expedition", "gear"):
        assert len(entry[section]) == len(hero[section])
        for original, translated_line in zip(hero[section], entry[section]):
            assert numbers.findall(original) == numbers.findall(translated_line)
output = ROOT / "translations" / "ar.json"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Translated {len(heroes)} heroes, {len(unique)} distinct skill lines to {output}")
