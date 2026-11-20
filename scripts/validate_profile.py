#!/usr/bin/env python3
"""Validate the generated GitHub profile README and every embedded local image."""
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README.md"
DATA = ROOT / "assets" / "solar-data.json"


class ReadmeParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.images: list[dict[str, str]] = []
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        if tag.lower() == "img":
            self.images.append(values)
        elif tag.lower() == "a" and values.get("href"):
            self.links.append(values["href"])


def fail(message: str) -> None:
    print(f"PROFILE VALIDATION FAILED: {message}", file=sys.stderr)
    raise SystemExit(1)


if not README.is_file():
    fail("README.md is missing.")
if not DATA.is_file():
    fail("assets/solar-data.json is missing.")

readme = README.read_text(encoding="utf-8")
parser = ReadmeParser()
parser.feed(readme)
parser.close()

if not parser.images:
    fail("No images were found in README.md.")

if "A Little About Me" not in readme or "Venkata Nagarjuna Babu Chitturi" not in readme:
    fail("The personal introduction section is missing or incomplete.")
for anchor in ("about", "snapshot", "toolkit", "selected-work"):
    if f'id="{anchor}"' not in readme or f'href="#{anchor}"' not in readme:
        fail(f"Profile navigation is missing the {anchor} section anchor.")

checked: list[Path] = []
for index, image in enumerate(parser.images, start=1):
    src = image.get("src", "").strip()
    alt = image.get("alt", "").strip()

    if not src:
        fail(f"Image #{index} has no src attribute.")
    if not alt:
        fail(f"Image #{index} has no alt text.")
    if not src.startswith("./assets/"):
        fail(f"Image #{index} is not stored locally: {src}")

    target = (ROOT / src[2:]).resolve()
    if ROOT.resolve() not in target.parents:
        fail(f"Image path escapes the repository: {src}")
    if not target.is_file():
        fail(f"Referenced image does not exist: {src}")

    suffix = target.suffix.lower()
    if suffix == ".svg":
        try:
            tree = ET.parse(target)
        except ET.ParseError as exc:
            fail(f"Invalid SVG/XML in {src}: {exc}")
        if not tree.getroot().tag.endswith("svg"):
            fail(f"Referenced SVG has the wrong root element: {src}")
    elif suffix == ".gif":
        with target.open("rb") as stream:
            signature = stream.read(6)
        if signature not in (b"GIF87a", b"GIF89a"):
            fail(f"Invalid GIF signature: {src}")
    elif suffix not in (".png", ".jpg", ".jpeg", ".webp"):
        fail(f"Unsupported image format in README: {src}")

    checked.append(target)

try:
    data = json.loads(DATA.read_text(encoding="utf-8"))
except (json.JSONDecodeError, UnicodeDecodeError) as exc:
    fail(f"assets/solar-data.json is invalid: {exc}")

repositories = data.get("publicRepositories")
if not isinstance(repositories, list):
    fail("solar-data.json has no publicRepositories array.")

project_images = [
    image["src"] for image in parser.images
    if image.get("src", "").startswith("./assets/projects/")
]
if len(project_images) != len(repositories):
    fail(
        f"README shows {len(project_images)} project images, "
        f"but solar-data.json contains {len(repositories)} public projects."
    )

hrefs = set(parser.links)
missing_links = [
    item.get("url", "")
    for item in repositories
    if item.get("url") and item["url"] not in hrefs
]
if missing_links:
    fail("A public project is missing its repository link: " + ", ".join(missing_links))

count_match = re.search(r"(\d+)\s+public projects", readme, re.IGNORECASE)
if not count_match or int(count_match.group(1)) != len(repositories):
    fail("The README public-project count does not match solar-data.json.")

required_assets = {
    "./assets/profile-universe.svg",
    "./assets/profile-metrics.svg",
    "./assets/tech-stack-v2.svg",
    "./assets/about-header.svg",
    "./assets/about-divider.svg",
    "./assets/about-signoff.svg",
    "./assets/work-header.svg",
}
actual_sources = {image.get("src", "") for image in parser.images}
missing_required = sorted(required_assets - actual_sources)
if missing_required:
    fail("Required profile artwork is not embedded: " + ", ".join(missing_required))

if re.search(r"koi|github-readme-stats|github-readme-activity-graph", readme, re.IGNORECASE):
    fail("A removed koi or external analytics reference remains in the README.")

print(
    "PROFILE VALIDATION PASSED: "
    f"{len(parser.images)} images checked, "
    f"{len(checked)} local assets found, "
    f"{len(repositories)} project links verified."
)
