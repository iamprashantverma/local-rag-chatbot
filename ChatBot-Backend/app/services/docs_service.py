from pathlib import Path
from app.rag.index import build_index

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
DOCS_FILE = DATA_DIR / "docs.txt"


def ensure_docs_file():
    DATA_DIR.mkdir(exist_ok=True)
    if not DOCS_FILE.exists():
        DOCS_FILE.write_text("", encoding="utf-8")


def update_docs(content: str, mode: str):
    ensure_docs_file()

    if mode == "replace":
        DOCS_FILE.write_text(content, encoding="utf-8")
    else:
        with open(DOCS_FILE, "a", encoding="utf-8") as f:
            f.write("\n" + content)

    build_index()