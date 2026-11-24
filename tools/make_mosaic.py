# トップの「369人の顔の輪」を作る。img/mosaic.webp と、タップ用の位置 data/mosaic.js を書き出す
import json, math, os
from PIL import Image, ImageDraw

S = 1400                 # 画像の一辺
R_IN, R_OUT = 0.315, 0.565   # 真ん中の集合絵の外側〜外周(一辺=1)
N = 369

def cells(d):
    out = []
    dy = d * math.sqrt(3) / 2
    rows = int(1.3 / dy) + 2
    for j in range(-rows, rows + 1):
        y = j * dy
        off = (d / 2) if j % 2 else 0
        for i in range(-rows, rows + 1):
            x = i * d + off
            r = math.hypot(x, y)
            if R_IN + d * 0.5 <= r <= R_OUT:
                out.append((x, y, r))
    return out

lo, hi = 0.02, 0.08
for _ in range(40):
    mid = (lo + hi) / 2
    if len(cells(mid)) >= N: lo = mid
    else: hi = mid
d = lo
cs = sorted(cells(d), key=lambda c: c[2])[:N]
# 内側から外へ、角度順に並べて番号を振る(同じ輪の中で時計回り)
cs.sort(key=lambda c: (round(c[2] / d), math.atan2(c[1], c[0])))

js = open("data/images.js").read()
IM = json.loads(js[js.index("=") + 1:].rstrip(";\n"))
canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
px = int(d * S * 0.92)
mask = Image.new("L", (px * 4, px * 4), 0)
ImageDraw.Draw(mask).ellipse((0, 0, px * 4 - 1, px * 4 - 1), fill=255)
mask = mask.resize((px, px), Image.LANCZOS)
pos = []
for k, (x, y, r) in enumerate(cs):
    n = k + 1
    v = IM.get(str(n), {})
    src = v.get("bust") or v.get("main")
    cx, cy = (0.5 + x) * S, (0.5 + y) * S
    if src and os.path.exists(src):
        im = Image.open(src).convert("RGB")
        w, h = im.size
        side = min(w, h)
        im = im.crop(((w - side) // 2, 0, (w - side) // 2 + side, side)).resize((px, px), Image.LANCZOS)
        ring = Image.new("RGBA", (px + 6, px + 6), (0, 0, 0, 0))
        ImageDraw.Draw(ring).ellipse((0, 0, px + 5, px + 5), fill=(255, 255, 255, 235))
        canvas.alpha_composite(ring, (int(cx - px / 2 - 3), int(cy - px / 2 - 3)))
        canvas.paste(im, (int(cx - px / 2), int(cy - px / 2)), mask)
    pos.append([n, round((0.5 + x) * 100, 2), round((0.5 + y) * 100, 2)])
canvas.save("img/mosaic.webp", "WEBP", quality=80, method=6)
open("data/mosaic.js", "w").write("window.MOSAIC={d:%.3f,p:%s};" % (d * 100, json.dumps(pos, separators=(",", ":"))))
print("円の直径", round(d * 100, 2), "% / ", len(pos), "人")
