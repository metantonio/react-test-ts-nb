import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
import re
import os
import argparse

BASE_URL = "https://deepwiki.com/"
DEFAULT_OUT_DIR = "out"


def fetch_from_deepwiki(url, selector):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        return soup.select_one(selector)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")

        return None


def parse_sidebar(sidebar):
    bar_contents = sidebar.find_all("a") if sidebar else []

    page_paths = []
    qk_nav_contents = []

    for bar_item in bar_contents:
        item_name = bar_item["href"]
        page_paths.append(item_name)
        qk_nav_contents.append(item_name.split("/")[-1])

    return page_paths, qk_nav_contents


def format_quick_navigation(qk_nav_contents):
    formatted_qk_nav = "## Quick Navigation\n\n"

    for qk_nav_item in qk_nav_contents:
        qk_nav_item_split = qk_nav_item.split("-", 1)
        indent_count = len(qk_nav_item_split[0].split("."))
        qk_nav_item_formatted = qk_nav_item_split[-1].replace("-", " ").title()
        formatted_qk_nav += f"{'  ' * (indent_count - 1)}- [{qk_nav_item_formatted}]({qk_nav_item}.md)\n"

    return formatted_qk_nav


def format_table_of_contents(markdown_content):
    formatted_toc = "## Table of Contents\n\n"

    headings = re.findall(r"^(#{1,6}) (.+)", markdown_content, re.MULTILINE)

    for hash, heading in headings:
        indent_count = len(hash)
        anchor = re.sub(r"[^\w\- ]", "", heading).strip().lower().replace(" ", "-")
        formatted_toc += f"{'  ' * (indent_count - 1)}- [{heading}](#{anchor})\n"

    return formatted_toc


def write_md(out_dir, page_heading, formatted_qk_nav, formatted_toc, markdown_content):
    page_title = page_heading.split("-", 1)[-1].replace("-", " ")

    with open(rf"{out_dir}/{page_heading}.md", "w") as file:
        file.write(
            f"# {page_title.title()}\n\n{formatted_qk_nav}\n{formatted_toc}\n{markdown_content}"
        )


def write_docs_page(out_dir, formatted_qk_nav):
    with open(rf"{out_dir}/docs.md", "w") as file:
        file.write(f"# Documentation\n\n{formatted_qk_nav}")


def main():
    parser = argparse.ArgumentParser(
        description="Converts the DeepWiki page of a given project to markdown."
    )

    parser.add_argument(
        "project_name",
        help="The DeepWiki project to convert. Provide the project in the format 'owner/repo'. "
        "For example, use 'python/cpython' for the CPython repository on DeepWiki.",
        type=str,
    )

    parser.add_argument(
        "out_dir",
        help="Directory where the markdown files will be saved. The default directory 'out' will be used if nothing else is specified.",
        type=str,
        nargs="?",
        default="out",
    )

    args = parser.parse_args()

    project_url = f"{BASE_URL}{args.project_name}"
    out_dir = args.out_dir

    os.makedirs(out_dir, exist_ok=True)

    sidebar = fetch_from_deepwiki(
        project_url, "ul.flex-1.flex-shrink-0.space-y-1.overflow-y-auto.py-1"
    )

    if sidebar:
        page_paths, qk_nav_contents = parse_sidebar(sidebar)

        formatted_qk_nav = format_quick_navigation(qk_nav_contents)

        write_docs_page(out_dir, formatted_qk_nav)

        for path in page_paths:
            content = fetch_from_deepwiki(
                f"{project_url}/{path}",
                "div.prose-custom.prose-custom-md.prose-custom-gray.text-neutral-300",
            )

            if content:
                markdown_content = md(content.decode_contents(), heading_style="ATX")

                formatted_toc = format_table_of_contents(markdown_content)

                page_heading = path.split("/")[-1]
                write_md(
                    out_dir,
                    page_heading,
                    formatted_qk_nav,
                    formatted_toc,
                    markdown_content,
                )

    else:
        print("Parsing error")


if __name__ == "__main__":
    main()
