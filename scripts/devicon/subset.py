"""Subset the devicon font to the glyphs the site uses.

The full font is ~1.2 MB; the site shows a few dozen icons. Run after adding a skill icon:
    python3 scripts/devicon/subset.py
Reads the full font/CSS from scripts/devicon/, finds every `devicon-*` class used under src/,
and writes public/fonts/devicon/devicon.woff2 + devicon.css with only those glyphs.
"""
import pathlib
import re

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "scripts" / "devicon"
OUT = ROOT / "public" / "fonts" / "devicon"

used = set()
for path in (ROOT / "src").rglob("*"):
    if path.suffix in {".ts", ".html"}:
        used |= set(re.findall(r"devicon-[a-z0-9-]+", path.read_text(encoding="utf-8")))

css = (SRC / "devicon-full.css").read_text(encoding="utf-8").lstrip("\ufeff")
rules = re.findall(r"([^{}]+)\{content:\"(.)\"\}", css)
keep, codepoints = [], set()
for selectors, char in rules:
    names = {m for m in re.findall(r"\.(devicon-[a-z0-9-]+):before", selectors)}
    hit = sorted(names & used)
    if hit:
        keep.append(",".join(f".{n}:before" for n in hit) + "{content:\"\\%x\"}" % ord(char))
        codepoints.add(ord(char))

font = TTFont(SRC / "devicon-full.woff")
options = subset.Options()
options.flavor = "woff2"
options.layout_features = []
sub = subset.Subsetter(options)
sub.populate(unicodes=sorted(codepoints))
sub.subset(font)
OUT.mkdir(parents=True, exist_ok=True)
font.flavor = "woff2"
font.save(OUT / "devicon.woff2")

base = (
    '@font-face{font-family:"devicon";src:url("/fonts/devicon/devicon.woff2") format("woff2");'
    "font-weight:normal;font-style:normal;font-display:swap}"
    '[class^=devicon-],[class*=" devicon-"]{font-family:"devicon" !important;speak:never;'
    "font-style:normal;font-weight:normal;font-variant:normal;text-transform:none;line-height:1;"
    "-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}"
)
(OUT / "devicon.css").write_text(base + "".join(keep) + "\n", encoding="utf-8")
print(f"{len(used)} classes used, {len(codepoints)} glyphs kept")
