"""Subset the self-hosted webfonts to the characters the site uses (Latin + a few symbols).

Full fonts live in scripts/fonts/src/; run `python3 scripts/fonts/subset.py` after adding text in
a new script (e.g. Georgian) or new symbols, then rebuild. All OpenType features are kept
(tabular numbers, kerning, ligatures), so the type looks identical — only unused glyphs go.
"""
import pathlib

from fontTools import subset

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "scripts" / "fonts" / "src"
UNICODES = (
    "U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+03C4,"
    "U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212,U+2248,U+2713"
)
TARGET = {"Geist": ROOT / "public" / "fonts" / "geist"}

for font in sorted(SRC.glob("*.woff2")):
    out_dir = TARGET.get(font.stem.split("-")[0], ROOT / "public" / "fonts")
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / font.name
    subset.main([
        str(font),
        f"--unicodes={UNICODES}",
        "--layout-features=*",
        "--flavor=woff2",
        f"--output-file={out}",
    ])
    print(f"{font.name}: {font.stat().st_size // 1024} KB -> {out.stat().st_size // 1024} KB")
