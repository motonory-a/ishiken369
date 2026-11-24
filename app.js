(()=>{
"use strict";
const C = window.CHARS || [];
const IMG = window.IMAGES || {};
const BY = new Map(C.map(c=>[c.n,c]));
const LINE_ADD = "https://lin.ee/zapyKLV";
const LINE_ID = "@425vvwoh";
const lineOrder = (stones, who) => `https://line.me/R/oaMessage/${encodeURIComponent(LINE_ID)}/?${encodeURIComponent(`【いしけん！ブレスレットの相談】\n${who? who+"\n":""}使いたい石：${stones.join("・")}\nこの石でブレスレットを作りたいです。`)}`;
const lineHello = () => `https://line.me/R/oaMessage/${encodeURIComponent(LINE_ID)}/?${encodeURIComponent("いしけん")}`;
const SITE = "https://motonory-a.github.io/ishiken369/";
const lineBtns = (stones, who, label="LINEでブレスレットを相談・注文") => `<a class="btn line" href="${lineOrder(stones, who)}" target="_blank" rel="noopener">${label} ›</a>`;
const INSTA = "https://www.instagram.com/ishiken369/";
const app = document.getElementById("app");

/* ---------- 色・言い伝え ---------- */
const COLOR = {"緑":"#79c99a","茶":"#b88a5a","ピンク":"#f4a5c4","赤":"#df5f6c","黒":"#4b4a59","白":"#efeaf6","青":"#4f6fd8","黄":"#f1cf55","透明":"#dcebf7","水色":"#86d0e8","虹":"#c9a7f0","紫":"#a07ae0","橙":"#f2a057","金銀":"#d4bf78"};
const COLOR_ORDER = ["透明","白","ピンク","赤","橙","黄","緑","水色","青","紫","茶","黒","金銀","虹"];
const WISH = {
  "恋愛":   {c:["ピンク","赤"], t:"やさしい気持ちや人とのご縁を育てる石として、昔から大切にされてきたと言われています。"},
  "仕事・勉強":{c:["黄","青","金銀"], t:"集中力や前に進む力を後押しする石として、身につける人が多いと言われています。"},
  "金運":   {c:["黄","金銀","緑"], t:"豊かさや実りを呼ぶ色の石として、お財布のそばに置かれてきたと言われています。"},
  "癒やし": {c:["水色","緑","紫"], t:"心を落ち着かせ、ほっとする時間をくれる石と言われています。"},
  "お守り": {c:["黒","茶","透明","白"], t:"身をまもるお守りの石として、旅や新しい場所へ持っていく人がいると言われています。"},
  "直感":   {c:["紫","青","虹"], t:"ひらめきや自分らしさに気づかせてくれる石と言われています。"},
  "元気":   {c:["赤","橙","黄"], t:"太陽のような明るさで、やる気を引き出してくれる石と言われています。"}
};
const wishesOf = c => Object.keys(WISH).filter(w=>WISH[w].c.includes(c.color));
const isArtificial = c => /人工/.test(c.group||"");
const colorOf = c => COLOR[c.color] || "#c9b2ff";

/* ---------- 保存(推しベスト5) ---------- */
const store = {
  get(){ try{ const v = JSON.parse(localStorage.getItem("ishiken_oshi")||"[]"); return Array.isArray(v)? v.filter(n=>BY.has(n)).slice(0,5):[]; }catch(e){ return mem; } },
  set(v){ mem = v; try{ localStorage.setItem("ishiken_oshi", JSON.stringify(v)); }catch(e){} }
};
let mem = [];
let pickMem = null;
function getPick(v){
  let p = pickMem;
  if(!p){ try{ p = JSON.parse(localStorage.getItem("ishiken_pick")||"null"); }catch(e){} }
  p = Array.isArray(p) ? p.filter(n=>v.includes(n)).slice(0,3) : [];
  if(!p.length) p = v.slice(0,3);
  return p;
}
function setPick(p){ pickMem = p; try{ localStorage.setItem("ishiken_pick", JSON.stringify(p)); }catch(e){} }
function toggleOshi(n){
  const v = store.get(); const i = v.indexOf(n);
  if(i>=0){ v.splice(i,1); store.set(v); toast(`${BY.get(n).name}を推しから外しました`); return false; }
  if(v.length>=5){ toast("推しは5人までです。推しベスト5で入れ替えてください"); return true===false; }
  v.push(n); store.set(v); toast(`${BY.get(n).name}を推し${v.length}位に登録しました`); return true;
}

/* ---------- 小物 ---------- */
const clean = s => String(s||"").replace(/【[^】]*】/g,"").trim();
const esc = s => String(s??"").replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const pad3 = n => String(n).padStart(3,"0");
function mainSrc(c){ const v = IMG[c.n]; return v ? (typeof v==="string"? v : v.main) : ""; }
function bustSrc(c){ const v = IMG[c.n]; return (v && v.bust) || mainSrc(c); }
function pic(c, cls="", full=false){
  const src = full ? mainSrc(c) : bustSrc(c);
  const style = `--c1:${colorOf(c)}55;--c2:${colorOf(c)}cc`;
  const ph = `<div class="ph"${src?' hidden':''}><i></i><b>${esc(c.name.slice(0,1))}</b></div>`;
  const im = src ? `<img src="${esc(src)}" alt="${esc(c.name)}（${esc(c.stone)}）" loading="lazy" decoding="async" onerror="this.remove();this.nextElementSibling.hidden=false">` : "";
  return `<div class="pic ${cls}" style="${style}">${im}${ph}</div>`;
}
function heart(c){ const on = store.get().includes(c.n); return `<button class="heart${on?' on':''}" data-oshi="${c.n}" aria-label="${esc(c.name)}を推しに登録" aria-pressed="${on}"><i></i></button>`; }
function gcard(c){
  return `<div class="gcard-wrap" style="position:relative"><a class="gcard" href="#/girl/${c.n}">${pic(c)}<span class="no">No.${pad3(c.n)}</span><div class="meta"><b>${esc(c.name)}</b><span>${esc(c.stone)}</span></div></a>${heart(c)}</div>`;
}
function toast(msg){ const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove("show"),2200); }
function hash(s){ let h=2166136261; for(const ch of s){ h^=ch.codePointAt(0); h=Math.imul(h,16777619); } return h>>>0; }
const todayKey = (d=new Date()) => `${d.getMonth()+1}月${d.getDate()}日`;
function byDate(key){ return C.filter(c=>c.date===key); }
function greeting(c){
  const list = [
    `おはよう！今日は${c.date}、わたしの誕生日だよ。${c.stone}みたいに、きらっといい一日にしようね。`,
    `おはようございます。${c.stone}担当の${c.name}です。今日もいっしょにがんばろうね。`,
    `おはよう！部室で待ってるね。今日のラッキーカラーは${c.color||"きらきら"}かも？`
  ];
  return list[hash(c.name+todayKey())%list.length];
}
function friendsOf(c){
  const same = C.filter(x=>x.n!==c.n && x.group===c.group);
  same.sort((a,b)=>Math.abs(a.n-c.n)-Math.abs(b.n-c.n));
  const f = same.slice(0,4);
  if(f.length<3){ for(const n of [1,2,3,4,5,6]) if(n!==c.n && !f.find(x=>x.n===n) && f.length<4) f.push(BY.get(n)); }
  return f;
}
function bracelet(cols){
  const beads = 14; let html="";
  for(let i=0;i<beads;i++){
    const a = i/beads*Math.PI*2, x = 50+40*Math.cos(a), y = 50+34*Math.sin(a);
    const col = cols[i%cols.length];
    html += `<span style="left:calc(${x}% - 12px);top:calc(${y}% - 12px);background:radial-gradient(circle at 35% 30%,#fff,${col} 55%,${col})"></span>`;
  }
  return `<div class="bracelet" aria-hidden="true">${html}</div>`;
}

/* ---------- 毎朝のおはよう(カレンダー) ---------- */
function ohayoTime(){ try{ return localStorage.getItem("ishiken_ohayo") || "07:30"; }catch(e){ return "07:30"; } }
function makeIcs(hhmm){
  const [h,m] = hhmm.split(":").map(Number);
  const d = new Date(); d.setDate(d.getDate()+1);
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  const hm = `${String(h).padStart(2,"0")}${String(m).padStart(2,"0")}00`;
  const end = new Date(2000,0,1,h,m+5); const he = `${String(end.getHours()).padStart(2,"0")}${String(end.getMinutes()).padStart(2,"0")}00`;
  const url = location.origin + location.pathname + "#/today";
  const stamp = new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//ishiken369//ohayo//JA","CALSCALE:GREGORIAN","BEGIN:VTIMEZONE","TZID:Asia/Tokyo","BEGIN:STANDARD","DTSTART:19700101T000000","TZOFFSETFROM:+0900","TZOFFSETTO:+0900","TZNAME:JST","END:STANDARD","END:VTIMEZONE","BEGIN:VEVENT",
    `UID:ishiken-ohayo-${Date.now()}@motonory-a.github.io`,`DTSTAMP:${stamp}`,
    `DTSTART;TZID=Asia/Tokyo:${ymd}T${hm}`,`DTEND;TZID=Asia/Tokyo:${ymd}T${he}`,"RRULE:FREQ=DAILY",
    "SUMMARY:いしけん！今日の誕生日の子から「おはよう」",
    `DESCRIPTION:今日の誕生日の子に会いに行こう\\n${url}`,`URL:${url}`,
    "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:いしけん！おはよう","TRIGGER:PT0M","END:VALARM",
    "END:VEVENT","END:VCALENDAR"].join("\r\n");
}
function addOhayo(){
  const el = document.getElementById("ohayoTime"); const v = (el && el.value) || "07:30";
  try{ localStorage.setItem("ishiken_ohayo", v); }catch(e){}
  const blob = new Blob([makeIcs(v)], {type:"text/calendar;charset=utf-8"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ishiken-ohayo.ics";
  document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  toast(`毎朝${v}の予定を作りました。カレンダーに追加してください`);
}

function lineCard(){
  return `<section class="card line-card"><span class="line-ic">LINE</span><div><b>運営・アッキーの公式LINE</b><br><span class="muted">押すとLINEが開きます。送信ボタンを押すだけで、いしけん！の案内が届きます。</span>
    <div class="row-btns" style="margin-top:8px"><a class="btn line" href="${lineHello()}" target="_blank" rel="noopener">LINEで案内を受け取る ›</a><a class="btn sm" href="${LINE_ADD}" target="_blank" rel="noopener">友だち追加だけする</a></div></div></section>`;
}
function shareCard(){
  return `<section class="card pad share-card"><b>このサイトを友だちに紹介する</b><p class="muted" style="margin:2px 0 8px">推しがかぶるか、くらべてみよう。</p>
    <div class="row-btns"><a class="btn line" href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(SITE)}" target="_blank" rel="noopener">LINEで送る</a><a class="btn sm" href="https://x.com/intent/post?text=${encodeURIComponent("天然石が女の子になった369人の部員から推しを探せる「いしけん！」")}&url=${encodeURIComponent(SITE)}" target="_blank" rel="noopener">Xで紹介</a><button class="btn sm" data-sharesite="1">ほかの方法・リンクをコピー</button></div></section>`;
}

/* ---------- 画面 ---------- */
function vHome(){
  const t = byDate(todayKey());
  const c = t[0] || BY.get(1);
  const best = store.get();
  let row = "";
  for(let i=0;i<5;i++){
    const b = best[i] && BY.get(best[i]);
    row += b ? `<a href="#/girl/${b.n}"><span class="rank">${i+1}位</span>${pic(b)}${esc(b.name)}</a>`
             : `<a class="empty" href="#/girls"><span class="rank">${i+1}位</span><div class="pic"><div class="ph"><b>＋</b></div></div>さがす</a>`;
  }
  return `
  <section class="hero369" aria-label="369人の部員">
    <div class="sparkles" aria-hidden="true">${"<i></i>".repeat(14)}</div>
    <div class="mosaic"><img src="img/mosaic.webp" alt="いしけん！の部員369人" width="1400" height="1400"><div class="hits" style="--d:${(window.MOSAIC||{}).d||4.5}%">${((window.MOSAIC||{}).p||[]).map(([n,x,y])=>`<button class="hit" data-face="${n}" style="left:${x}%;top:${y}%" aria-label="${esc((BY.get(n)||{}).name||"")}"></button>`).join("")}</div></div>
    <div class="h-center${IMG.group?" has-group":""}">
      ${IMG.group? `<a href="${IMG.group}" data-groupzoom="1"><img class="group" src="${IMG.group}" alt="いしけん！主要メンバーの集合絵"></a>`:`<div class="h-copy"><span class="h-count" data-count="369">0</span><span class="h-unit">人の部員が</span><span class="h-line">あなたの推しを<br>待っています</span></div>`}
    </div>
  </section>
  <p class="h-hint">✦ 小さな顔をタップすると、その子に会えます ✦</p>
  ${IMG.group? `<p class="h-sub"><b data-count="369">369</b>人の部員が、あなたの推しを待っています</p>`:""}
  <div class="h-cta"><a class="btn pri" href="#/quiz">3分で推し診断 ›</a><a class="btn" href="#/girls">369人を見る</a></div>
  <section class="card today" aria-label="今日の誕生日の子">
    <div class="today-in">
      <a href="#/girl/${c.n}">${pic(c)}</a>
      <div class="today-tx">
        <span class="today-tag">${t.length? "今日の誕生日の子":"今日の部員"}</span>
        <h2>${esc(c.name)}</h2>
        <div class="stone">${esc(c.stone)}</div>
        <div class="bubble">${esc(greeting(c))}</div>
        ${t.length>1? `<p class="muted">今日はほかに ${t.slice(1).map(x=>`<a href="#/girl/${x.n}">${esc(x.name)}</a>`).join("・")} も誕生日</p>`:""}
      </div>
    </div>
  </section>
  <div class="entries">
    <a class="entry e-girls" href="#/girls"><span class="eic"><i class="ic ic-girls"></i></span><span>女の子から探す<small>369人の中からビビッとくる子を</small></span></a>
    <a class="entry e-stones" href="#/stones"><span class="eic"><i class="ic ic-gem"></i></span><span>石から探す<small>好きな色・願い事から</small></span></a>
    <a class="entry e-quiz" href="#/quiz"><span class="eic"><i class="ic ic-q"></i></span><span>質問から探す<small>8つの質問で相性のいい子を</small></span></a>
  </div>
  <h2 class="sec-t">あなたの推しベスト5</h2>
  <div class="card best-row">${row}</div>
  <section class="card pad ohayo">
    <h2 class="sec-t" style="margin-top:0">好きな時間に「おはよう」を受け取る</h2>
    <p class="muted" style="margin:0 0 8px">スマホのカレンダーに毎朝の予定を入れます。時間になると通知が出て、押すとその日の誕生日の子に会えます。</p>
    <div class="ohayo-row"><label>毎朝 <input type="time" id="ohayoTime" value="${esc(ohayoTime())}" step="300"></label><button class="btn pri" id="ohayoAdd">カレンダーに入れる</button></div>
  </section>
  ${lineCard()}
  ${shareCard()}
  <a class="card insta" href="${INSTA}" target="_blank" rel="noopener"><span class="ig"></span><span><b>毎朝7:30に「おはよう」が届く</b><br><span class="muted">Instagram @ishiken369 で部員たちの日常を配信中</span></span></a>`;
}

const LS = {q:"", grade:"", color:"", group:"", sort:"no", shown:40};
function vGirls(){
  const groups = [...new Set(C.map(c=>c.group))];
  const grades = ["1年","2年","3年"];
  const chip = (k,v,label=v) => `<button class="chip${LS[k]===v?' on':''}" data-f="${k}" data-v="${esc(v)}">${esc(label)}</button>`;
  return `
  <h1 class="ribbon">女の子から探す</h1>
  <label class="search"><span aria-hidden="true">🔍</span><input id="q" type="search" placeholder="名前・石の名前で検索（例：スイ、ラピスラズリ）" value="${esc(LS.q)}"></label>
  <div class="card filters">
    <div class="lbl">学年</div><div class="chips">${chip("grade","","すべて")}${grades.map(g=>chip("grade",g)).join("")}</div>
    <div class="lbl">石の色</div><div class="chips">${chip("color","","すべて")}${COLOR_ORDER.map(g=>chip("color",g)).join("")}</div>
    <div class="lbl">石の仲間</div><div class="chips">${chip("group","","すべて")}${groups.map(g=>chip("group",g)).join("")}</div>
  </div>
  <div id="list"></div>`;
}
function renderList(){
  const q = LS.q.trim();
  let r = C.filter(c => (!q || c.name.includes(q) || c.stone.includes(q)) && (!LS.grade || c.grade===LS.grade) && (!LS.color || c.color===LS.color) && (!LS.group || c.group===LS.group));
  if(LS.sort==="kana") r = [...r].sort((a,b)=>a.name.localeCompare(b.name,"ja"));
  if(LS.sort==="date") r = [...r].sort((a,b)=>dateNum(a)-dateNum(b));
  const el = document.getElementById("list"); if(!el) return;
  el.innerHTML = `
    <div class="count-row"><span>全 <b>${r.length}</b> 人</span>
      <select id="sort" aria-label="並べ替え"><option value="no"${LS.sort==="no"?" selected":""}>番号順</option><option value="kana"${LS.sort==="kana"?" selected":""}>あいうえお順</option><option value="date"${LS.sort==="date"?" selected":""}>誕生日順</option></select></div>
    ${r.length? `<div class="grid2">${r.slice(0,LS.shown).map(gcard).join("")}</div>`:`<p class="center muted">見つかりませんでした。条件を変えてみてね。</p>`}
    ${r.length>LS.shown? `<div class="center"><button class="btn more" id="more">もっと見る（あと${r.length-LS.shown}人）</button></div>`:""}`;
}
function dateNum(c){ const m=(c.date||"").match(/(\d+)月(\d+)日/); return m? +m[1]*100+ +m[2] : 9999; }

function vGirl(n){
  const c = BY.get(n); if(!c) return vNotFound();
  const v = IMG[c.n]; const sheets = (v && typeof v==="object" && v.sheets) || [];
  const fr = friendsOf(c);
  const on = store.get().includes(c.n);
  const prof = [["学年",c.grade],["身長",c.height],["誕生日",c.date],["部活の役割",c.role],["見た目",c.look],["小物",c.acc]].filter(x=>x[1]);
  const w = wishesOf(c);
  return `
  <a class="back" href="#/girls">‹ 一覧へ</a>
  <section class="card hero2">
    <div class="hero2-pics">
      <div class="hp-bust">${pic(c)}</div>
      ${IMG[c.n]&&IMG[c.n].bust? `<a class="hp-full" href="${esc(mainSrc(c))}" target="_blank" rel="noopener" aria-label="${esc(c.name)}の全身を大きく見る">${pic(c,"",true)}</a>`:""}
    </div>
    <div class="hero-tx">
      <span class="kana">No.${pad3(c.n)}</span>
      <h1>${esc(c.name)}</h1>
      <div class="stone">${esc(c.stone)}</div>
      <button class="btn pink" data-oshi-big="${c.n}" aria-pressed="${on}">${on? "♥ 推し登録ずみ":"♡ 推しに登録"}</button>
    </div>
  </section>
  ${sheets.length? `<h2 class="sec-t">表情集・ポーズ集</h2><div class="gallery">${sheets.map(s=>`<a class="pic" href="${esc(s)}" target="_blank" rel="noopener"><img src="${esc(s)}" alt="${esc(c.name)}の設定画" loading="lazy"></a>`).join("")}</div>`:""}
  <h2 class="sec-t">プロフィール</h2>
  <div class="card pad"><dl class="prof">${prof.map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}
    ${c.pers? `<dt>性格</dt><dd>${esc(c.pers)}</dd>`:""}${c.trig? `<dt>成長のきっかけ</dt><dd>${esc(c.trig)}</dd>`:""}</dl></div>
  ${c.hook && c.n>200? `<h2 class="sec-t">好きになるきっかけ</h2><div class="card pad">${esc(clean(c.hook))}</div>`:""}
  <h2 class="sec-t">担当の石</h2>
  <div class="card pad"><div class="stone-box">
    <a class="stone-img" href="#/stone/${encodeURIComponent(c.stone)}" style="--sc:${colorOf(c)};background:linear-gradient(160deg,#fff,${colorOf(c)}44)" aria-label="${esc(c.stone)}のページへ"></a>
    <div><h3>${esc(c.stone)}</h3>
      <p class="muted">色：${esc(c.color||"—")}　仲間：${esc(c.group)}</p>
      ${w.length? `<p><b>言い伝え</b>　${esc(WISH[w[0]].t)}</p>`:""}
    </div></div>
    ${isArtificial(c)? `<div class="note-art">この子の担当は、人の手でつくられた素材です（天然石ではありません）。</div>`:""}
  </div>
  <h2 class="sec-t">仲のいい子</h2>
  <div class="friends">${fr.map(f=>`<a href="#/girl/${f.n}">${pic(f)}${esc(f.name)}</a>`).join("")}</div>
  <section class="card shop" style="margin-top:16px">
    ${bracelet([colorOf(c),"#ffffff",colorOf(c),"#f3ece0"])}
    <div class="shop-tx"><h3>${esc(c.name)}の石でつくる<br>ブレスレット</h3><p class="muted" style="margin:0 0 8px">${esc(c.stone)}を使ったオーダーメイド。LINEで気軽に相談できます。</p>${lineBtns([c.stone], `推し：${c.name}（No.${pad3(c.n)}）`, "LINEで相談する")}</div>
  </section>
  <p class="center"><button class="btn sm" data-share="${c.n}">この子をシェア</button></p>`;
}

/* 石から探す */
function stones(){
  const m = new Map();
  for(const c of C){ if(!m.has(c.stone)) m.set(c.stone, []); m.get(c.stone).push(c); }
  return [...m.entries()].map(([name,list])=>({name, list, color:list[0].color, rep:list[0]}));
}
const SS = {q:"", color:"", wish:"", month:""};
function vStones(){
  return `
  <h1 class="ribbon">石から探す</h1>
  <label class="search"><span aria-hidden="true">🔍</span><input id="sq" type="search" placeholder="石の名前で検索（例：水晶、アメジスト）" value="${esc(SS.q)}"></label>
  <div class="card filters">
    <div class="lbl">色で探す</div>
    <div class="colors">${COLOR_ORDER.map(k=>`<button class="cdot${SS.color===k?' on':''}" data-sc="${k}" title="${k}" aria-label="${k}" style="background:${k==="虹"?"conic-gradient(#f4a5c4,#f1cf55,#79c99a,#86d0e8,#a07ae0,#f4a5c4)":COLOR[k]}"></button>`).join("")}</div>
    <div class="lbl">願い事で探す（言い伝え）</div>
    <div class="chips">${Object.keys(WISH).map(w=>`<button class="chip${SS.wish===w?' on':''}" data-sw="${w}">${w}</button>`).join("")}</div>
    <div class="lbl">誕生日の月で探す</div>
    <div class="chips">${Array.from({length:12},(_,i)=>`<button class="chip${SS.month==i+1?' on':''}" data-sm="${i+1}">${i+1}月</button>`).join("")}</div>
  </div>
  <div id="slist"></div>`;
}
function renderStones(){
  const q = SS.q.trim();
  let r = stones().filter(s => (!q || s.name.includes(q)) && (!SS.color || s.color===SS.color) && (!SS.wish || WISH[SS.wish].c.includes(s.color)) && (!SS.month || s.list.some(c=>dateNum(c)>=SS.month*100 && dateNum(c)<SS.month*100+100)));
  const el = document.getElementById("slist"); if(!el) return;
  el.innerHTML = `<div class="count-row"><span>全 <b>${r.length}</b> 種類の石</span>${(SS.color||SS.wish||SS.month)?`<button class="chip" id="sclear">条件をクリア</button>`:""}</div>
  ${r.length? `<div class="grid3">${r.map(s=>`<a class="scard" href="#/stone/${encodeURIComponent(s.name)}"><div class="stone-img" style="--sc:${colorOf(s.rep)};background:linear-gradient(160deg,#fff,${colorOf(s.rep)}55)"></div>${pic(s.rep,"face")}<b>${esc(s.name)}</b></a>`).join("")}</div>`:`<p class="center muted">見つかりませんでした。</p>`}`;
}
function vStone(name){
  const s = stones().find(x=>x.name===name); if(!s) return vNotFound();
  const c = s.rep; const w = wishesOf(c);
  return `
  <a class="back" href="#/stones">‹ 一覧へ</a>
  <h1 class="ribbon">石の詳細</h1>
  <section class="card pad"><div class="stone-box">
    <div class="stone-img" style="--sc:${colorOf(c)};background:linear-gradient(160deg,#fff,${colorOf(c)}55)"></div>
    <div><h2 style="font-size:24px">${esc(s.name)}</h2><p class="muted">色：${esc(c.color||"—")}<br>仲間：${esc(c.group)}</p></div></div>
    ${(()=>{const h=s.list.find(x=>x.n>200&&x.hook);return h? `<p><b>特徴</b>　${esc(clean(h.hook).split("。")[0])}。</p>`:"";})()}
    ${w.length? `<p><b>言い伝え</b>　${w.map(x=>esc(WISH[x].t)).slice(0,2).join("")}</p><p class="muted">願い事：${w.join("・")}</p>`:""}
    ${isArtificial(c)? `<div class="note-art">人の手でつくられた素材です（天然石ではありません）。</div>`:""}
  </section>
  <h2 class="sec-t">この石の担当の子</h2>
  <div class="grid2">${s.list.map(gcard).join("")}</div>
  <section class="card shop" style="margin-top:16px">${bracelet([colorOf(c),"#ffffff"])}
    <div class="shop-tx"><h3>${esc(s.name)}の<br>ブレスレット</h3>${lineBtns([s.name], "", "LINEで相談する")}</div></section>`;
}

/* 質問から探す */
const QUIZ = [
  {q:"休みの日はどう過ごしたい？", a:[["🏠","のんびりおうちで過ごしたい",["白","水色","ピンク"]],["🏙️","気になる街へおでかけしたい",["黄","橙","虹"]],["👭","友だちとにぎやかに遊びたい",["赤","橙","ピンク"]],["📖","好きなことをじっくり楽しみたい",["紫","青","茶"]]]},
  {q:"部室で好きな場所は？", a:[["🪟","光が入る窓ぎわ",["透明","白","水色"]],["🛠️","作業台の前",["茶","黒","金銀"]],["☕","みんなが集まる給湯スペース",["ピンク","橙","黄"]],["💎","ショーウインドーの前",["虹","紫","青"]]]},
  {q:"好きな季節は？", a:[["🌸","春",["ピンク","緑","白"]],["🌻","夏",["水色","黄","青"]],["🍁","秋",["茶","橙","赤"]],["❄️","冬",["白","透明","紫"]]]},
  {q:"友だちからよく言われるのは？", a:[["😊","いつも明るいね",["黄","橙","赤"]],["🌙","落ち着いてるね",["青","紫","黒"]],["🫶","やさしいね",["ピンク","緑","水色"]],["✨","不思議な雰囲気だね",["虹","紫","透明"]]]},
  {q:"もらってうれしいプレゼントは？", a:[["💐","花束",["ピンク","赤","白"]],["📚","本や文房具",["青","茶","緑"]],["🧁","甘いおやつ",["橙","黄","ピンク"]],["🔮","きらきらした小物",["透明","金銀","虹"]]]},
  {q:"今いちばん大切にしたいことは？", a:[["💗","人とのご縁",["ピンク","赤"]],["📈","目標に向かう力",["黄","金銀","青"]],["🌿","心のやすらぎ",["緑","水色","紫"]],["🛡️","自分らしさを守ること",["黒","茶","透明"]]]},
  {q:"放課後の寄り道先は？", a:[["🌊","海辺や川べり",["水色","青","白"]],["🌳","公園や森",["緑","茶"]],["🏮","商店街の夜市",["赤","橙","金銀"]],["🌌","星が見える丘",["紫","黒","虹"]]]},
  {q:"ブレスレットを作るなら？", a:[["🤍","透明感のあるシンプル系",["透明","白"]],["🌈","いろんな色のカラフル系",["虹","黄","ピンク"]],["🖤","シックで大人っぽい系",["黒","茶","金銀"]],["💜","深い色のミステリアス系",["紫","青","緑"]]]}
];
let QS = {i:0, ans:[]};
function vQuiz(){
  if(QS.i>=QUIZ.length) return vQuizResult();
  const it = QUIZ[QS.i];
  return `
  <h1 class="ribbon">質問から探す</h1>
  <section class="card qwrap">
    <div class="progress">質問 ${QS.i+1}/${QUIZ.length}</div>
    <div class="bar"><i style="width:${(QS.i)/QUIZ.length*100}%"></i></div>
    <div class="card qbox">${esc(it.q)}</div>
    <div class="opts">${it.a.map((o,k)=>`<button class="opt" data-ans="${k}"><span class="oe" aria-hidden="true">${o[0]}</span>${esc(o[1])}</button>`).join("")}</div>
    ${QS.i>0? `<p class="center"><button class="btn sm" id="qback">‹ 戻る</button></p>`:""}
  </section>`;
}
function quizRank(){
  const score = {};
  QS.ans.forEach((k,i)=>QUIZ[i].a[k][2].forEach((col,j)=>score[col]=(score[col]||0)+(3-j)));
  const seed = QS.ans.join("");
  return [...C].sort((a,b)=>((score[b.color]||0)-(score[a.color]||0)) || (hash(seed+a.n)%1000)-(hash(seed+b.n)%1000)).slice(0,3);
}
function vQuizResult(){
  const r = quizRank();
  const reason = c => {
    const w = wishesOf(c)[0];
    return w? `「${w}」の言い伝えがある${c.stone}の子。今のあなたにぴったりかも。` : `${c.stone}担当。あなたの毎日にそっと寄り添ってくれそう。`;
  };
  return `
  <h1 class="ribbon">診断結果</h1>
  <h2 class="center" style="font-size:17px;margin-bottom:10px">✦ あなたに合う子 ✦</h2>
  ${r.map((c,i)=>`<section class="card res${i===0?" first":""}">
    <a href="#/girl/${c.n}">${pic(c)}</a>
    <div class="res-tx"><span class="rk">${i+1}位</span><br><b>${esc(c.name)}</b> <span class="muted">${esc(c.stone)}</span>
      <p>${esc(reason(c))}</p>
      <div class="row-btns"><button class="btn pink sm" data-oshi-big="${c.n}">♡ 推しに登録</button><a class="btn sm" href="#/girl/${c.n}">ページを見る ›</a></div></div>
  </section>`).join("")}
  <div class="row-btns" style="justify-content:center;margin-top:6px">
    <button class="btn" id="qretry">↻ もう一度診断する</button>
    <a class="btn pri" href="${INSTA}" target="_blank" rel="noopener">Instagramでこの子に会う ›</a>
  </div>
  <section class="card shop" style="margin-top:14px">${bracelet(r.map(colorOf))}
    <div class="shop-tx"><h3>この3人の石で<br>ブレスレットを作る</h3><p class="muted" style="margin:0 0 8px">${r.map(c=>esc(c.stone)).join("・")}</p>${lineBtns(r.map(c=>c.stone), "診断で合った子："+r.map(c=>c.name).join("・"), "LINEで相談する")}</div></section>
  ${lineCard()}
  <p class="center"><button class="btn sm" id="qshare">結果をシェア</button></p>
  ${shareCard()}`;
}

/* 推しベスト5 */
function vOshi(){
  const v = store.get();
  const pick = getPick(v);
  const items = v.map((n,i)=>{ const c = BY.get(n); return `
    <section class="card oshi-item${i===0?" first":""}">
      <span class="crown r${i+1}">${i+1}</span>
      <a href="#/girl/${c.n}">${pic(c)}</a>
      <div><b>${esc(c.name)}</b><span class="muted">${esc(c.stone)}</span>
        <div class="oshi-ctrl"><button data-up="${i}" ${i===0?"disabled":""} aria-label="順位を上げる">▲</button><button data-down="${i}" ${i===v.length-1?"disabled":""} aria-label="順位を下げる">▼</button><button data-del="${n}">× 外す</button></div></div>
    </section>`; }).join("");
  const cols = v.map(n=>colorOf(BY.get(n)));
  return `
  <h1 class="ribbon">推しベスト5</h1>
  <p class="center muted">📱 会員登録なしで、このスマホに保存されます</p>
  ${items}
  ${v.length<5? `<a class="add-slot" href="#/girls">＋ 推しを追加（あと${5-v.length}人）</a>`:""}
  ${v.length? `<section class="card pad pick3">
    <h2 class="sec-t" style="margin-top:0">ブレスレットにする3人を選ぶ</h2>
    <p class="muted" style="margin:0 0 8px">ベスト5の中から、石を使いたい子を3人まで選んでね（はじめは1〜3位）。</p>
    <div class="pick-row">${v.map((n,i)=>{const c=BY.get(n);const on=pick.includes(n);return `<button class="pick${on?" on":""}" data-pick="${n}" aria-pressed="${on}">${pic(c)}<span>${i+1}位 ${esc(c.name)}</span><small>${esc(c.stone)}</small></button>`;}).join("")}</div>
  </section>
  <section class="card shop">${bracelet(pick.length?pick.map(n=>colorOf(BY.get(n))):["#c9b2ff"])}
    <div class="shop-tx"><h3>選んだ${pick.length}人の石でつくる<br>ブレスレット案</h3><p class="muted" style="margin:0 0 8px">${pick.map(n=>esc(BY.get(n).stone)).join("・")||"3人まで選んでね"}</p>${pick.length? lineBtns(pick.map(n=>BY.get(n).stone), "選んだ推し："+pick.map(n=>BY.get(n).name).join("・"), "このブレスレットをLINEで注文"):""}</div></section>
  ${lineCard()}
  <p class="center"><button class="btn" id="oshare">ベスト5をシェア</button></p>
  ${shareCard()}`
  : `<p class="center">まだ推しがいません。<br>3つの入口から見つけてみよう！</p><div class="row-btns" style="justify-content:center"><a class="btn" href="#/girls">女の子から</a><a class="btn" href="#/stones">石から</a><a class="btn" href="#/quiz">質問から</a></div>`}`;
}

/* 誕生日カレンダー */
let CAL = {m:new Date().getMonth()+1, d:new Date().getDate()};
function vCalendar(){
  const days = new Date(2024, CAL.m, 0).getDate(); // うるう年で2/29まで
  const t = new Date(); const pick = byDate(`${CAL.m}月${CAL.d}日`);
  return `
  <h1 class="ribbon">誕生日カレンダー</h1>
  <div class="months">${Array.from({length:12},(_,i)=>`<button class="chip${CAL.m===i+1?" on":""}" data-cm="${i+1}">${i+1}月</button>`).join("")}</div>
  <div class="card pad"><div class="days">${Array.from({length:days},(_,i)=>{const d=i+1;const isT=t.getMonth()+1===CAL.m&&t.getDate()===d;return `<button class="day${isT?" today":""}${CAL.d===d?" on":""}" data-cd="${d}">${d}</button>`;}).join("")}</div></div>
  <h2 class="sec-t">${CAL.m}月${CAL.d}日 生まれ</h2>
  ${pick.length? `<div class="grid2">${pick.map(gcard).join("")}</div>`:`<p class="muted center">この日の子はまだいません。</p>`}`;
}

function vAbout(){
  return `<h1 class="ribbon">いしけん！について</h1>
  <section class="card pad">
  <p>舞台は<b>私立結晶ヶ丘学園</b>（けっしょうがおかがくえん）。旧校舎の元・宝飾工房を部室にした「天然石研究部」には、天然石・鉱物・宝石を担当する369人の部員がいます。みんな学園寮「あかり寮」で暮らしています。</p>
  <p>部員は放課後、天然石ブレスレットを作って、校内の販売会や学園祭、商店街の夜市に出展しています。</p>
  <p>気になる子が見つかったら「推し」に登録して、あなただけのベスト5を作ってみてください。</p>
  <p class="muted">石の言い伝えは昔から伝わるお話です。効果を約束するものではありません。人の手でつくられた素材を担当する子には、そのことを書いています。</p>
  </section>`;
}
function vNotFound(){ return `<p class="center" style="margin-top:40px">ページが見つかりませんでした。</p><p class="center"><a class="btn" href="#/">ホームへ</a></p>`; }

/* ---------- ルーター ---------- */
function route(){
  const h = decodeURIComponent(location.hash.replace(/^#/,"")) || "/";
  const [, p, a] = h.split("/");
  let html, tab = p||"home";
  switch(p||""){
    case "": html = vHome(); tab="home"; break;
    case "girls": html = vGirls(); break;
    case "girl": html = vGirl(+a); tab="girls"; break;
    case "stones": html = vStones(); break;
    case "stone": html = vStone(a); tab="stones"; break;
    case "quiz": html = vQuiz(); break;
    case "oshi": html = vOshi(); break;
    case "calendar": html = vCalendar(); break;
    case "about": html = vAbout(); tab=""; break;
    case "today": { const t = byDate(todayKey())[0] || BY.get(1); location.replace(`#/girl/${t.n}`); return; }
    default: html = vNotFound();
  }
  app.innerHTML = html;
  if(!p){ const el=document.querySelector('[data-count]'); if(el){ const to=+el.dataset.count, t0=performance.now(); const step=t=>{ const k=Math.min(1,(t-t0)/1400); el.textContent=Math.round(to*(1-Math.pow(1-k,3))); if(k<1) requestAnimationFrame(step); }; requestAnimationFrame(step); } }
  if(p==="girls") renderList();
  if(p==="stones") renderStones();
  document.querySelectorAll(".tabs a").forEach(x=>x.classList.toggle("on", x.dataset.tab===tab));
  const c = p==="girl" && BY.get(+a);
  document.title = c ? `${c.name}（${c.stone}）｜いしけん！〜天然石研究部〜` : "いしけん！〜天然石研究部〜｜369人の中から推しの石を見つけよう";
  closeMenu();
  if(!route.keep) window.scrollTo(0,0);
  route.keep = false;
}
function rerender(){ const y = scrollY; route.keep = true; route(); scrollTo(0,y); }

/* ---------- 顔のアップ(ライトボックス) ---------- */
let LB = null;
function faceSrc(n){ const v = IMG[n]||{}; return v.bust || v.main || ""; }
function lbHtml(n){
  const c = BY.get(n); const src = faceSrc(n);
  return `<div class="lb-pic">${src?`<img src="${src}" alt="${esc(c.name)}">`:`<div class="ph"><b>${esc(c.name[0])}</b></div>`}</div>
    <div class="lb-tx"><span class="lb-no">No.${n}</span><h3>${esc(c.name)}</h3><p class="lb-st"><span class="dot" style="background:${colorOf(c)}"></span>${esc(c.stone)}　${esc(c.date||"")}生まれ</p>
    <a class="btn pri" href="#/girl/${n}">この子のページへ ›</a></div>`;
}
function openFace(n, fromEl){
  closeFace(true);
  const box = document.createElement("div");
  box.className = "lb"; box.setAttribute("role","dialog"); box.setAttribute("aria-modal","true");
  box.innerHTML = `<div class="lb-bg"></div><div class="lb-card"><button class="lb-x" aria-label="閉じる">×</button><div class="lb-body">${lbHtml(n)}</div>
    <button class="lb-nav lb-prev" aria-label="前の子">‹</button><button class="lb-nav lb-next" aria-label="次の子">›</button><p class="lb-swipe">左右にスワイプで次の子へ</p></div>`;
  document.body.appendChild(box); document.body.classList.add("lb-open");
  LB = {n, box};
  const pic = box.querySelector(".lb-pic");
  if(fromEl && pic.animate){
    const a = fromEl.getBoundingClientRect(), b = pic.getBoundingClientRect();
    const sx = a.width/b.width, dx = a.left + a.width/2 - (b.left + b.width/2), dy = a.top + a.height/2 - (b.top + b.height/2);
    pic.animate([{transform:`translate(${dx}px,${dy}px) scale(${sx})`, borderRadius:"50%"},{transform:"none", borderRadius:"28px"}],{duration:520, easing:"cubic-bezier(.2,.9,.25,1.15)"});
    box.querySelector(".lb-tx").animate([{opacity:0, transform:"translateY(14px)"},{opacity:1, transform:"none"}],{duration:420, delay:220, fill:"backwards", easing:"ease-out"});
  }
  box.querySelector(".lb-bg").animate?.([{opacity:0},{opacity:1}],{duration:300});
  box.querySelector(".lb-x").focus({preventScroll:true});
  let x0 = null;
  const card = box.querySelector(".lb-card");
  card.addEventListener("pointerdown", e=>{ x0 = e.clientX; });
  card.addEventListener("pointerup", e=>{ if(x0===null) return; const dx = e.clientX - x0; x0 = null; if(Math.abs(dx) > 50) stepFace(dx < 0 ? 1 : -1); });
}
function stepFace(k){
  if(!LB) return;
  const n = ((LB.n - 1 + k + 369) % 369) + 1;
  LB.n = n;
  const body = LB.box.querySelector(".lb-body");
  body.innerHTML = lbHtml(n);
  body.animate?.([{opacity:0, transform:`translateX(${k*40}px)`},{opacity:1, transform:"none"}],{duration:300, easing:"ease-out"});
}
function closeFace(now){
  if(!LB) return;
  const box = LB.box; LB = null; document.body.classList.remove("lb-open");
  if(now || !box.animate){ box.remove(); return; }
  box.animate([{opacity:1},{opacity:0}],{duration:200}).onfinish = ()=>box.remove();
}
document.addEventListener("click", e=>{
  const h = e.target.closest(".hit"); if(h){ e.preventDefault(); openFace(+h.dataset.face, h); return; }
  const g = e.target.closest("[data-groupzoom]"); if(g){ e.preventDefault(); openGroup(g); return; }
  if(!LB) return;
  if(e.target.closest(".lb-x") || e.target.classList.contains("lb-bg")){ closeFace(); return; }
  if(e.target.closest(".lb-prev")){ stepFace(-1); return; }
  if(e.target.closest(".lb-next")){ stepFace(1); return; }
  if(e.target.closest(".lb a")) closeFace(true);
}, true);
function openGroup(el){
  closeFace(true);
  const box = document.createElement("div"); box.className = "lb lb-group";
  box.innerHTML = `<div class="lb-bg"></div><div class="lb-card"><button class="lb-x" aria-label="閉じる">×</button><div class="lb-pic"><img src="${IMG.group}" alt="いしけん！主要メンバーの集合絵"></div></div>`;
  document.body.appendChild(box); document.body.classList.add("lb-open"); LB = {n:0, box};
  const pic = box.querySelector(".lb-pic");
  if(pic.animate){ const a = el.getBoundingClientRect(), b = pic.getBoundingClientRect();
    pic.animate([{transform:`translate(${a.left+a.width/2-(b.left+b.width/2)}px,${a.top+a.height/2-(b.top+b.height/2)}px) scale(${a.width/b.width})`, borderRadius:"50%"},{transform:"none", borderRadius:"24px"}],{duration:520, easing:"cubic-bezier(.2,.9,.25,1.1)"}); }
}
document.addEventListener("keydown", e=>{ if(!LB) return; if(e.key==="Escape") closeFace(); if(e.key==="ArrowRight") stepFace(1); if(e.key==="ArrowLeft") stepFace(-1); });
window.addEventListener("hashchange", ()=>closeFace(true));

/* ---------- 操作 ---------- */
async function share(text){
  const url = location.href;
  try{ if(navigator.share){ await navigator.share({title:"いしけん！〜天然石研究部〜", text, url}); return; } }catch(e){ return; }
  try{ await navigator.clipboard.writeText(`${text}\n${url}`); toast("リンクをコピーしました"); }catch(e){ toast(url); }
}
document.addEventListener("click", e=>{
  const t = e.target.closest("button"); if(!t) return;
  const d = t.dataset;
  if(d.oshi){ e.preventDefault(); const on = toggleOshi(+d.oshi); t.classList.toggle("on", store.get().includes(+d.oshi)); t.setAttribute("aria-pressed", String(store.get().includes(+d.oshi))); return; }
  if(d.oshiBig){ toggleOshi(+d.oshiBig); rerender(); return; }
  if(d.f!==undefined){ LS[d.f] = d.v; LS.shown = 40; rerender(); return; }
  if(t.id==="more"){ LS.shown += 40; renderList(); return; }
  if(d.sc){ SS.color = SS.color===d.sc? "": d.sc; rerender(); return; }
  if(d.sw){ SS.wish = SS.wish===d.sw? "": d.sw; rerender(); return; }
  if(d.sm){ SS.month = SS.month==d.sm? "": +d.sm; rerender(); return; }
  if(t.id==="sclear"){ SS.color=SS.wish=SS.month=""; rerender(); return; }
  if(d.ans!==undefined){ QS.ans[QS.i] = +d.ans; QS.i++; route(); return; }
  if(t.id==="qback"){ QS.i = Math.max(0,QS.i-1); route(); return; }
  if(t.id==="qretry"){ QS = {i:0, ans:[]}; route(); return; }
  if(t.id==="qshare"){ const r = quizRank(); share(`わたしに合ういしけん部員は ${r.map(c=>`${c.name}（${c.stone}）`).join("・")} でした！`); return; }
  if(d.up!==undefined || d.down!==undefined){ const v = store.get(); const i = +(d.up ?? d.down); const j = d.up!==undefined? i-1 : i+1; [v[i],v[j]]=[v[j],v[i]]; store.set(v); rerender(); return; }
  if(d.del){ toggleOshi(+d.del); rerender(); return; }
  if(d.pick){ const n = +d.pick; const p = getPick(store.get()); const i = p.indexOf(n); if(i>=0) p.splice(i,1); else { if(p.length>=3){ toast("選べるのは3人までです。外したい子を先に押してね"); return; } p.push(n); } setPick(p); rerender(); return; }
  if(d.sharesite){ (async()=>{ const text="天然石が女の子になった369人の部員から推しを探せる「いしけん！」"; try{ if(navigator.share){ await navigator.share({title:"いしけん！〜天然石研究部〜", text, url:SITE}); return; } }catch(e){ return; } try{ await navigator.clipboard.writeText(text+"\n"+SITE); toast("リンクをコピーしました"); }catch(e){ toast(SITE); } })(); return; }
  if(t.id==="ohayoAdd"){ addOhayo(); return; }
  if(t.id==="oshare"){ const v = store.get(); share(`わたしのいしけん推しベスト5：${v.map((n,i)=>`${i+1}位 ${BY.get(n).name}`).join("／")}`); return; }
  if(d.share){ const c = BY.get(+d.share); share(`いしけん！の${c.name}（${c.stone}）`); return; }
  if(d.cm){ CAL.m = +d.cm; CAL.d = Math.min(CAL.d, new Date(2024,CAL.m,0).getDate()); rerender(); return; }
  if(d.cd){ CAL.d = +d.cd; rerender(); return; }
  if(d.full){ const c = BY.get(+d.full); const box = t.parentElement; const isFull = box.classList.toggle("is-full"); box.querySelector(".pic").outerHTML = pic(c, "", isFull); t.textContent = isFull? "顔を見る" : "全身を見る"; return; }
});
document.addEventListener("input", e=>{
  if(e.target.id==="q"){ LS.q = e.target.value; LS.shown = 40; renderList(); }
  if(e.target.id==="sq"){ SS.q = e.target.value; renderStones(); }
});
document.addEventListener("change", e=>{ if(e.target.id==="sort"){ LS.sort = e.target.value; renderList(); } });
const menuBtn = document.getElementById("menuBtn"), drawer = document.getElementById("drawer");
function closeMenu(){ drawer.hidden = true; menuBtn.setAttribute("aria-expanded","false"); }
menuBtn.addEventListener("click", ()=>{ drawer.hidden = !drawer.hidden; menuBtn.setAttribute("aria-expanded", String(!drawer.hidden)); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeMenu(); });
window.addEventListener("hashchange", route);
route();
})();
