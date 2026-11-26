# トップの「369人の顔の輪」を作る。img/mosaic.webp と、タップ用の位置 data/mosaic.js を書き出す
# 2026-11-26 版:六角形のびっしり並びをやめ、真ん中の集合絵を囲む同心円(曼荼羅のような輪)に整列させる
import json, math, os
from PIL import Image, ImageDraw

S = 1400                     # 画像の一辺
R_IN, R_OUT = 0.318, 0.497   # 真ん中の集合絵の外側〜外周(一辺=1)。外周は画像の内側に収める
N = 369
GAP = 1.05                   # 円どうしの間隔(直径の何倍の間隔で並べるか)

def rings(d):
    out = []
    r = R_IN + d * 0.58
    while r + d * 0.5 <= R_OUT:
        out.append((r, int(2 * math.pi * r / (d * GAP))))
        r += d * 0.98
    return out

lo, hi = 0.015, 0.08
for _ in range(50):
    mid = (lo + hi) / 2
    if sum(c for _, c in rings(mid)) >= N: lo = mid
    else: hi = mid
d = lo
rs = rings(d)
# 合計がちょうど369人になるよう、外側の輪から人数を減らす(輪の中は等間隔のまま)
extra = sum(c for _, c in rs) - N
rs = [list(x) for x in rs]
k = len(rs) - 1
while extra > 0:
    rs[k][1] -= 1; extra -= 1; k = k - 1 if k > 0 else len(rs) - 1
cs = []
for j, (r, c) in enumerate(rs):
    off = (math.pi / c) if j % 2 else 0      # 輪ごとに半コマずらして、きれいな模様にする
    for i in range(c):
        a = -math.pi / 2 + off + 2 * math.pi * i / c
        cs.append((r * math.cos(a), r * math.sin(a), r))

js = open("data/images.js").read()
IM = json.loads(js[js.index("=") + 1:].rstrip(";\n"))
SC = 2                                        # 2倍で描いて縮める(輪郭をなめらかに)
canvas = Image.new("RGBA", (S * SC, S * SC), (0, 0, 0, 0))
dr = ImageDraw.Draw(canvas)
# 輪と輪のあいだに、細い金の線(案内の円)
for j in range(len(rs) + 1):
    if j == 0: rr = R_IN + d * 0.08
    elif j == len(rs): rr = rs[-1][0] + d * 0.6
    else: rr = (rs[j - 1][0] + rs[j][0]) / 2
    R = rr * S * SC; c0 = S * SC / 2
    dr.ellipse((c0 - R, c0 - R, c0 + R, c0 + R), outline=(226, 194, 126, 150 if j in (0, len(rs)) else 70), width=SC * (2 if j in (0, len(rs)) else 1))
px = int(d * S * SC * 0.94)
mask = Image.new("L", (px, px), 0)
ImageDraw.Draw(mask).ellipse((0, 0, px - 1, px - 1), fill=255)
bw = max(3, int(px * 0.05))
pos = []
for k, (x, y, r) in enumerate(cs):
    n = k + 1
    v = IM.get(str(n), {})
    src = v.get("bust") or v.get("main")
    cx, cy = (0.5 + x) * S * SC, (0.5 + y) * S * SC
    if src and os.path.exists(src):
        im = Image.open(src).convert("RGB")
        w, h = im.size
        side = min(w, h)
        im = im.crop(((w - side) // 2, 0, (w - side) // 2 + side, side)).resize((px, px), Image.LANCZOS)
        o = px + bw * 2
        rim = Image.new("RGBA", (o, o), (0, 0, 0, 0))
        rd = ImageDraw.Draw(rim)
        rd.ellipse((0, 0, o - 1, o - 1), fill=(255, 255, 255, 255))
        rd.ellipse((1, 1, o - 2, o - 2), outline=(232, 205, 150, 255), width=max(2, bw // 3))
        canvas.alpha_composite(rim, (int(cx - o / 2), int(cy - o / 2)))
        canvas.paste(im, (int(cx - px / 2), int(cy - px / 2)), mask)
    pos.append([n, round((0.5 + x) * 100, 2), round((0.5 + y) * 100, 2)])
canvas = canvas.resize((S, S), Image.LANCZOS)
canvas.save("img/mosaic.webp", "WEBP", quality=82, method=6)
open("data/mosaic.js", "w").write("window.MOSAIC={d:%.3f,p:%s};" % (d * 100, json.dumps(pos, separators=(",", ":"))))
print("円の直径", round(d * 100, 2), "% / 輪", [c for _, c in rs], len(pos), "人")
