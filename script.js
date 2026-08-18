/* ==========================================================================
   資料：作品清單（目前為預留位置 placeholder，之後可替換為真實圖片）
   要換成真實圖片時，把 art-thumb 的 CSS class 換成
   <img src="你的圖片路徑" alt="作品標題"> 即可，其餘結構不需更動。
   ========================================================================== */
const ARTWORKS = [
  { id:1, medium:"traditional",  mediumLabel:"油畫．畫布", title:"靜物：陶罐與光", year:"2025",
    desc:"以厚塗油彩處理陶罐表面的反光與陰影，練習如何用有限色階畫出溫度感。" },
  { id:2, medium:"traditional",  mediumLabel:"水彩．紙本", title:"午後窗景", year:"2024",
    desc:"濕中濕技法畫出窗簾透光的柔軟邊界，留白處理窗台上的植物剪影。" },
  { id:3, medium:"traditional",  mediumLabel:"炭筆．素描", title:"肖像習作 no.3", year:"2025",
    desc:"連續肖像練習系列的第三張，專注在顴骨與下顎交界處的明暗轉折。" },

  { id:4, medium:"illustration", mediumLabel:"數位插畫", title:"森林裡的守護者", year:"2025",
    desc:"為個人故事企劃繪製的角色設定，探索苔蘚與獸角結合的生物造型。" },
  { id:5, medium:"illustration", mediumLabel:"數位插畫", title:"貓與月亮", year:"2024",
    desc:"扁平色塊搭配粗顆粒紋理，嘗試童書插畫的溫暖敘事感。" },
  { id:6, medium:"illustration", mediumLabel:"角色設計", title:"角色設計：旅人", year:"2025",
    desc:"三視圖角色設定，服裝細節對應角色背景故事中的遷徙路線。" },

  { id:7, medium:"digital",      mediumLabel:"數位繪圖", title:"城市的記憶碎片", year:"2026",
    desc:"以幾何切割手法重組城市天際線，象徵記憶被時間打散又重組的樣子。" },
  { id:8, medium:"digital",      mediumLabel:"概念設計", title:"共生 01", year:"2025",
    desc:"生物與機械結構共生的概念設計，探討自然與科技的邊界。" },
  { id:9, medium:"digital",      mediumLabel:"數位繪圖", title:"介面之下", year:"2026",
    desc:"以網格與掃描線意象表現「介面之下」的資料流動感。" },

  { id:10, medium:"abstract",    mediumLabel:"壓克力．畫布", title:"破碎的呼吸", year:"2024",
    desc:"用大面積刮刀處理與細筆勾線的對比，記錄一段焦慮情緒的視覺化過程。" },
  { id:11, medium:"abstract",    mediumLabel:"混合媒材", title:"重量與留白", year:"2025",
    desc:"實驗紙張拼貼與墨色渲染，思考畫面中「留白」也是一種重量。" },
  { id:12, medium:"abstract",    mediumLabel:"壓克力．畫布", title:"殘響", year:"2026",
    desc:"以重複的筆觸節奏模擬聲音殘響消散的過程，色彩由濃轉淡。" },
];

const MEDIUM_ACCENT = {
  traditional:  "var(--c-traditional)",
  illustration: "var(--c-illustration)",
  digital:      "var(--c-digital)",
  abstract:     "var(--c-abstract)",
};
const MEDIUM_ACCENT_RAW = {
  all: "#B2673E",
  traditional:  "#B2673E",
  illustration: "#C4437B",
  digital:      "#4C7CBA",
  abstract:     "#8CA83E",
};

/* ==========================================================================
   渲染作品牆
   ========================================================================== */
const galleryGrid = document.getElementById("galleryGrid");

function renderGallery(){
  galleryGrid.innerHTML = ARTWORKS.map((art, i) => {
    const rot = (i % 2 === 0 ? -1 : 1) * (2 + (i % 3));
    return `
    <article class="art-card" data-medium="${art.medium}" data-id="${art.id}"
      style="--rot:${rot}deg; --card-accent:${MEDIUM_ACCENT[art.medium]}; animation-delay:${(i % 6) * 0.06}s">
      <span class="pin"></span>
      <div class="art-thumb ph-visual ph-${art.medium}"></div>
      <div class="art-meta">
        <p class="art-medium">${art.mediumLabel} ／ ${art.year}</p>
        <h3 class="art-title">${art.title}</h3>
      </div>
    </article>`;
  }).join("");

  document.querySelectorAll(".art-card").forEach(card=>{
    card.addEventListener("click", () => openLightbox(Number(card.dataset.id)));
  });
}
renderGallery();

/* ==========================================================================
   媒材篩選器
   ========================================================================== */
const tabs = document.querySelectorAll(".medium-tab");
const root = document.documentElement;

tabs.forEach(tab=>{
  tab.addEventListener("click", () => {
    tabs.forEach(t => { t.classList.remove("is-active"); t.setAttribute("aria-selected","false"); });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected","true");

    const medium = tab.dataset.medium;
    root.style.setProperty("--accent", MEDIUM_ACCENT_RAW[medium]);
    root.style.setProperty("--accent-soft", hexToRgba(MEDIUM_ACCENT_RAW[medium], .22));

    document.querySelectorAll(".art-card").forEach(card=>{
      const show = medium === "all" || card.dataset.medium === medium;
      card.classList.toggle("is-hidden", !show);
    });
  });
});

function hexToRgba(hex, alpha){
  const h = hex.replace("#","");
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ==========================================================================
   燈箱 Lightbox
   ========================================================================== */
const lightbox = document.getElementById("lightbox");
const lbVisual = document.getElementById("lightboxVisual");
const lbTag = document.getElementById("lightboxTag");
const lbTitle = document.getElementById("lightboxTitle");
const lbDesc = document.getElementById("lightboxDesc");
const lbMedium = document.getElementById("lightboxMedium");
const lbYear = document.getElementById("lightboxYear");

let lastFocused = null;

function openLightbox(id){
  const art = ARTWORKS.find(a => a.id === id);
  if(!art) return;
  lastFocused = document.activeElement;

  lbVisual.innerHTML = `<div class="ph-visual ph-${art.medium}"></div>`;
  lbTag.textContent = art.mediumLabel;
  lbTitle.textContent = art.title;
  lbDesc.textContent = art.desc;
  lbMedium.textContent = art.mediumLabel;
  lbYear.textContent = art.year;

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox-close").focus();
}

function closeLightbox(){
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  if(lastFocused) lastFocused.focus();
}

lightbox.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeLightbox));
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
});

/* ==========================================================================
   行動裝置導覽選單
   ========================================================================== */
const navToggle = document.getElementById("navToggle");
const mainNav = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(a=>{
  a.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded","false");
  });
});

/* ==========================================================================
   聯絡表單（前端示意：無後端串接時，改以 mailto 開啟郵件軟體）
   ========================================================================== */
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value.trim();

  if(!name || !email || !message){
    formNote.textContent = "請完整填寫姓名、Email 與訊息內容。";
    return;
  }

  const subjectMap = { commission:"委託創作", exhibition:"展覽／合作邀約", other:"其他洽詢" };
  const mailto = `mailto:you@example.com?subject=${encodeURIComponent("[作品集聯絡] " + subjectMap[subject])}&body=${encodeURIComponent(`姓名：${name}\nEmail：${email}\n\n${message}`)}`;

  window.location.href = mailto;
  formNote.textContent = "已為你開啟郵件軟體，確認後送出即可。";
});

/* ==========================================================================
   捲動進場動畫（尊重使用者的減少動態偏好設定）
   ========================================================================== */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(!prefersReducedMotion && "IntersectionObserver" in window){
  const revealTargets = document.querySelectorAll(".process-step, .about-content, .contact-inner");
  revealTargets.forEach(el => { el.style.opacity = 0; el.style.transform = "translateY(18px)"; el.style.transition = "opacity .6s ease, transform .6s ease"; });

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });

  revealTargets.forEach(el => io.observe(el));
}
