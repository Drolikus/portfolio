#!/usr/bin/env python3
"""Assemble index.html from a template and section partials.

The site is static (GitHub Pages), so the build runs at author time and the
generated index.html is committed and served as-is — no client-side includes,
no SEO/FOUC cost.

Source of truth:
    src/index.template.html   shell with `<!--#include name -->` markers
    src/partials/<name>.html   one section per file

Usage:
    python3 tools/build_html.py          # write index.html
    python3 tools/build_html.py --check  # verify index.html is up to date (CI)
"""

import os
import re
import sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
TEMPLATE = os.path.join(ROOT, "src", "index.template.html")
PARTIALS = os.path.join(ROOT, "src", "partials")
OUTPUT = os.path.join(ROOT, "index.html")

INCLUDE = re.compile(r"^<!--#include (\S+) -->$")


def render():
    out = []
    with open(TEMPLATE, encoding="utf-8") as f:
        for line in f:
            match = INCLUDE.match(line.rstrip("\n"))
            if match:
                name = match.group(1)
                partial = os.path.join(PARTIALS, f"{name}.html")
                with open(partial, encoding="utf-8") as p:
                    out.append(p.read())
            else:
                out.append(line)
    return "".join(out)


def main():
    rendered = render()
    check = "--check" in sys.argv[1:]
    if check:
        with open(OUTPUT, encoding="utf-8") as f:
            current = f.read()
        if current != rendered:
            print("index.html is out of date — run: python3 tools/build_html.py")
            sys.exit(1)
        print("index.html is up to date.")
        return
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(rendered)
    print(f"Wrote {OUTPUT} ({rendered.count(chr(10)) + 1} lines)")


if __name__ == "__main__":
    main()
