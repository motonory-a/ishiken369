"""公開されたドライブのフォルダから絵を取り出して、サイト用に小さくして保存する。
GitHub Actions の中で動かす(ドライブのフォルダは「リンクを知っている全員」が見られる設定にしておく)。"""
import re, json, os, io, sys, time, html, urllib.request
from PIL import Image

FOLDERS = {"01": "1CrRVjNlhDhyunw0fhIkwbxfrqkQ5Rrq7", "02": "1aib9t0UEj1KjsfD7wr6h2U1KfqDbIq27", "03": "16Jsd8DxAKasdRNx6tmwI1pAiO7pClykW"}
UA = {"User-Agent": "Mozilla/5.0"}

def get(url, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except Exception as e:
            err = e; time.sleep(2 + i * 3)
    raise err

def listing(fid, path=""):
    """embeddedfolderview から (名前, id, フォルダかどうか, 置き場) を集める(サブフォルダもたどる)"""
    try:
        page = get(f"https://drive.google.com/embeddedfolderview?id={fid}").decode("utf-8", "ignore")
    except Exception as e:
        print("見られないフォルダ", path or fid, e); return []
    out = []
    for m in re.finditer(r'<div class="flip-entry" id="entry-([\w-]+)".*?<div class="flip-entry-title">(.*?)</div>', page, re.S):
        eid, name = m.group(1), html.unescape(m.group(2)).strip()
        block = m.group(0)
        if "/folders/" in block or "folder" in block.split("flip-entry-title")[0].lower() and "drive-icon" not in block:
            out += listing(eid, f"{path}/{name}")
        else:
            out.append({"name": name, "id": eid, "path": path})
    return out

def main():
    man = {}
    for key, fid in FOLDERS.items():
        items = listing(fid, key)
        man[key] = items
        print(key, len(items), "件")
    os.makedirs("data", exist_ok=True)
    json.dump(man, open("data/drive_manifest.json", "w"), ensure_ascii=False, indent=0)

    os.makedirs("img/main", exist_ok=True); os.makedirs("img/sheet", exist_ok=True)
    images = {}
    def save(fid, out, width):
        if os.path.exists(out): return True
        try:
            raw = get(f"https://lh3.googleusercontent.com/d/{fid}=w{width}")
            im = Image.open(io.BytesIO(raw)).convert("RGB")
            if im.width > width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
            im.save(out, "WEBP", quality=82, method=6); return True
        except Exception as e:
            print("取り出せない", fid, e); return False
    # メイン絵(01・02): 「001_スイ.png」
    for key in ("01", "02"):
        for it in man.get(key, []):
            m = re.match(r"(\d{3})_", it["name"])
            if m and save(it["id"], f"img/main/{int(m.group(1))}.webp", 640):
                images.setdefault(int(m.group(1)), {})["main"] = f"img/main/{int(m.group(1))}.webp"
    # 設定画(03): 先頭の番号で振り分ける
    for it in man.get("03", []):
        m = re.match(r"(\d{3})", it["name"]) or re.search(r"(?:No\.?|_)(\d{3})", it["name"])
        if not m: continue
        n = int(m.group(1)); safe = re.sub(r"[^\w.-]", "_", it["id"])
        if "場面" in it["name"]:
            # 見せる用の1枚絵(設定画をもとに描き下ろし)
            os.makedirs("img/scene", exist_ok=True)
            out = f"img/scene/{n}_{safe}.webp"
            if save(it["id"], out, 900):
                images.setdefault(n, {})["scene"] = out
            continue
        out = f"img/sheet/{n}_{safe}.webp"
        if save(it["id"], out, 1100):
            images.setdefault(n, {}).setdefault("sheets", []).append(out)
    for n, v in images.items():
        if "sheets" in v: v["sheets"].sort()
    out_images = {str(k): v for k, v in sorted(images.items())}
    # トップ用の集合絵(05_キャラ画像「集合絵_トップ用.png」)。差し替えに備えて毎回取り直す
    # 公開フォルダ01に置いたコピーを名前で探す(いちばん新しいもの=一覧の最後)
    gs = [it for it in man.get("01", []) if it["name"].startswith("集合絵")]
    if gs:
        if os.path.exists("img/group.webp"): os.remove("img/group.webp")
        if save(gs[-1]["id"], "img/group.webp", 1000): out_images["group"] = "img/group.webp"
    js = "window.IMAGES=" + json.dumps(out_images, ensure_ascii=False, separators=(",", ":")) + ";"
    open("data/images.js", "w").write(js)
    print("メイン絵", sum(1 for v in images.values() if "main" in v), "人 / 設定画", sum(len(v.get("sheets", [])) for v in images.values()), "枚")

main()
