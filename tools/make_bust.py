"""メイン絵から顔のまわり(バストアップ)を切り出す。アニメ顔の検出器で顔を探し、見つからなければ上の中央を使う。"""
import os, glob, json, urllib.request
import cv2
from PIL import Image
XML = "tools/lbpcascade_animeface.xml"
if not os.path.exists(XML):
    urllib.request.urlretrieve("https://raw.githubusercontent.com/nagadomi/lbpcascade_animeface/master/lbpcascade_animeface.xml", XML)
cas = cv2.CascadeClassifier(XML)
os.makedirs("img/bust", exist_ok=True)
found = 0; miss = []
SKIP = {"268", "281", "352", "70"}  # うまく切り出せない絵は全身絵をそのまま使う
for p in sorted(glob.glob("img/main/*.webp")):
    n = os.path.basename(p).split(".")[0]
    out = f"img/bust/{n}.webp"
    if n in SKIP:
        if os.path.exists(out): os.remove(out)
        continue
    src_m = os.path.getmtime(p)
    if os.path.exists(out) and os.path.getmtime(out) >= src_m: continue
    im = Image.open(p).convert("RGB"); W, H = im.size
    g = cv2.cvtColor(cv2.imread(p) if cv2.imread(p) is not None else cv2.cvtColor(__import__("numpy").array(im), cv2.COLOR_RGB2BGR), cv2.COLOR_BGR2GRAY)
    g = cv2.equalizeHist(g)
    faces = []
    for nb in (4, 2):
        faces = [f for f in cas.detectMultiScale(g, 1.05, nb, minSize=(W // 18, W // 18)) if f[1] < H * 0.36]
        if len(faces): break
    if len(faces):
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3]); found += 1
        cx, cy = x + w / 2, y + h / 2
        cw = min(W, w * 2.5); ch = cw * 1.2
        left = max(0, min(W - cw, cx - cw / 2)); top = max(0, min(H - ch, cy - h * 1.0))
    else:
        miss.append(n)
        import numpy as np
        a = np.asarray(im).astype(int); r, gg, b = a[..., 0], a[..., 1], a[..., 2]
        # 紺のブレザーらしい色(暗くて青み)の場所から人物の位置を推定
        mask = (b > r + 8) & (b > gg) & (r + gg + b < 260)
        mask[: int(H * 0.08)] = False; mask[int(H * 0.6):] = False
        ys, xs = np.nonzero(mask)
        cw = W * 0.42; ch = cw * 1.2
        if len(xs) > 500:
            cx = float(np.median(xs)); ytop = float(np.percentile(ys, 3))
            left = max(0, min(W - cw, cx - cw / 2)); top = max(0, min(H - ch, ytop - ch * 0.42))
        else:
            left = (W - cw) / 2; top = H * 0.05
    crop = im.crop((int(left), int(top), int(left + cw), int(top + ch)))
    crop = crop.resize((480, int(480 * crop.height / crop.width)), Image.LANCZOS)
    crop.save(out, "WEBP", quality=84, method=6)
print("顔を見つけた", found, "見つからない", miss)
# images.js に bust を足す
js = open("data/images.js").read()
d = json.loads(js[js.index("=") + 1:].rstrip(";\n"))
for k, v in d.items():
    if os.path.exists(f"img/bust/{k}.webp"): v["bust"] = f"img/bust/{k}.webp"
open("data/images.js", "w").write("window.IMAGES=" + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + ";")
