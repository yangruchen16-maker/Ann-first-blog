/* ========================================================================== 
   全站藝術裝飾覆寫
   ========================================================================== */
const artOverrideStylesheet = document.createElement("link");
artOverrideStylesheet.rel = "stylesheet";
artOverrideStylesheet.href = "art-overrides.css";
document.head.appendChild(artOverrideStylesheet);

/* ========================================================================== 
   每次開啟網站，隨機切換圓點配色
   ========================================================================== */
(() => {
  const DOT_PALETTES = [
    { main: "#E97832", light: "#FFF9F3" },
    { main: "#F2C14E", light: "#FFF8E7" },
    { main: "#D95D39", light: "#FCE9DF" },
    { main: "#91B493", light: "#F4F7EE" },
    { main: "#7FA7C9", light: "#EEF5FA" },
    { main: "#C889B8", light: "#FFF0FA" },
    { main: "#B59A68", light: "#FFF8ED" },
    { main: "#8D83C7", light: "#F4F0FF" }
  ];

  const palette = DOT_PALETTES[Math.floor(Math.random() * DOT_PALETTES.length)];

  const toRgba = (hex, alpha) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const rootStyle = document.documentElement.style;
  rootStyle.setProperty("--dot-main-strong", toRgba(palette.main, .95));
  rootStyle.setProperty("--dot-main", toRgba(palette.main, .78));
  rootStyle.setProperty("--dot-main-soft", toRgba(palette.main, .58));
  rootStyle.setProperty("--dot-light-strong", toRgba(palette.light, .70));
  rootStyle.setProperty("--dot-light", toRgba(palette.light, .48));
  rootStyle.setProperty("--dot-light-soft", toRgba(palette.light, .34));
})();

/* ========================================================================== 
   作品資料
   ========================================================================== */
const ARTWORKS = [
  { id:1, medium:"traditional", mediumLabel:"油畫．畫布", title:"靜物：陶罐與光", year:"2025", desc:"以厚塗油彩處理陶罐表面的反光與陰影，練習如何用有限色階畫出溫度感。" },
  { id:2, medium:"traditional", mediumLabel:"水彩．紙本", title:"午後窗景", year:"2024", desc:"濕中濕技法畫出窗簾透光的柔軟邊界，留白處理窗台上的植物剪影。" },
  { id:3, medium:"traditional", mediumLabel:"炭筆．素描", title:"肖像習作 no.3", year:"2025", desc:"連續肖像練習系列的第三張，專注在顴骨與下顎交界處的明暗轉折。" },
  { id:4, medium:"illustration", mediumLabel:"數位插畫", title:"森林裡的守護者", year:"2025", desc:"為個人故事企劃繪製的角色設定，探索苔蘚與獸角結合的生物造型。" },
  { id:5, medium:"illustration", mediumLabel:"數位插畫", title:"貓與月亮", year:"2024", desc:"扁平色塊搭配粗顆粒紋理，嘗試童書插畫的溫暖敘事感。" },
  { id:6, medium:"illustration", mediumLabel:"角色設計", title:"角色設計：旅人", year:"2025", desc:"三視圖角色設定，服裝細節對應角色背景故事中的遷徙路線。" },
  { id:7, medium:"digital", mediumLabel:"數位繪圖", title:"城市的記憶碎片", year:"2026", desc:"以幾何切割手法重組城市天際線，象徵記憶被時間打散又重組的樣子。" },
  { id:8, medium:"digital", mediumLabel:"概念設計", title:"共生 01", year:"2025", desc:"生物與機械結構共生的概念設計，探討自然與科技的邊界。" },
  { id:9, medium:"digital", mediumLabel:"數位繪圖", title:"介面之下", year:"2026", desc:"以網格與掃描線意象表現「介面之下」的資料流動感。" },
  { id:10, medium:"abstract", mediumLabel:"壓克力．畫布", title:"破碎的呼吸", year:"2024", desc:"用大面積刮刀處理與細筆勾線的對比，記錄一段焦慮情緒的視覺化過程。" },
  { id:11, medium:"abstract", mediumLabel:"混合媒材", title:"重量與留白", year:"2025", desc:"實驗紙張拼貼與墨色渲染，思考畫面中「留白」也是一種重量。" },
  { id:12, medium:"abstract", mediumLabel:"壓克力．畫布", title:"殘響", year:"2026", desc:"以重複的筆觸節奏模擬聲音殘響消散的過程，色彩由濃轉淡。" },
];

const MEDIUM_ACCENT = {
  traditional: "var(--c-traditional)",
  illustration: "var(--c-illustration)",
  digital: "var(--c-digital)",
  abstract: "var(--c-abstract)",
};

const MEDIUM_ACCENT_RAW = {
  all: "#E97832",
  traditional: "#E97832",
  illustration: "#E97832",
  digital: "#E97832",
  abstract: "#E97832",
};

function hexToRgba(hex, alpha){
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ========================================================================== 
   作品集頁
   ========================================================================== */
const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
let lastFocused = null;

function openLightbox(id){
  if(!lightbox) return;
  const art = ARTWORKS.find(item => item.id === id);
  if(!art) return;

  lastFocused = document.activeElement;
  const visual = document.getElementById("lightboxVisual");
  const tag = document.getElementById("lightboxTag");
  const title = document.getElementById("lightboxTitle");
  const desc = document.getElementById("lightboxDesc");
  const medium = document.getElementById("lightboxMedium");
  const year = document.getElementById("lightboxYear");

  if(visual) visual.innerHTML = `<div class="ph-visual ph-${art.medium}"></div>`;
  if(tag) tag.textContent = art.mediumLabel;
  if(title) title.textContent = art.title;
  if(desc) desc.textContent = art.desc;
  if(medium) medium.textContent = art.mediumLabel;
  if(year) year.textContent = art.year;

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox-close")?.focus();
}

function closeLightbox(){
  if(!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocused?.focus();
}

if(galleryGrid){
  galleryGrid.innerHTML = ARTWORKS.map((art, i) => {
    return `
      <article class="art-card" data-medium="${art.medium}" data-id="${art.id}"
        style="--rot:0deg;--card-accent:${MEDIUM_ACCENT[art.medium]};animation-delay:${(i % 6) * 0.06}s"
        tabindex="0" role="button" aria-label="查看作品：${art.title}">
        <span class="pin"></span>
        <div class="art-thumb ph-visual ph-${art.medium}"></div>
        <div class="art-meta">
          <p class="art-medium">${art.mediumLabel} ／ ${art.year}</p>
          <h3 class="art-title">${art.title}</h3>
        </div>
      </article>`;
  }).join("");

  document.querySelectorAll(".art-card").forEach(card => {
    const open = () => openLightbox(Number(card.dataset.id));
    card.addEventListener("click", open);
    card.addEventListener("keydown", e => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        open();
      }
    });
  });

  const tabs = document.querySelectorAll(".medium-tab");
  const root = document.documentElement;
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(item => {
        item.classList.remove("is-active");
        item.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      const selected = tab.dataset.medium;
      root.style.setProperty("--accent", MEDIUM_ACCENT_RAW[selected]);
      root.style.setProperty("--accent-soft", hexToRgba(MEDIUM_ACCENT_RAW[selected], .22));

      document.querySelectorAll(".art-card").forEach(card => {
        const show = selected === "all" || card.dataset.medium === selected;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });
}

if(lightbox){
  lightbox.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeLightbox));
  document.addEventListener("keydown", e => {
    if(e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
}

/* ========================================================================== 
   行動裝置導覽列
   ========================================================================== */
const navToggle = document.getElementById("navToggle");
const mainNav = document.querySelector(".main-nav");

if(navToggle && mainNav){
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ========================================================================== 
   聯絡頁
   ========================================================================== */
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if(contactForm){
  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const subject = document.getElementById("subject")?.value || "other";
    const message = document.getElementById("message")?.value.trim() || "";

    if(!name || !email || !message){
      if(formNote) formNote.textContent = "請完整填寫姓名、Email 與訊息內容。";
      return;
    }

    const subjectMap = {
      commission: "委託創作",
      exhibition: "展覽／合作邀約",
      other: "其他洽詢"
    };

    const mailto = `mailto:myherbstudio@gmail.com?subject=${encodeURIComponent("[作品集聯絡] " + subjectMap[subject])}&body=${encodeURIComponent(`姓名：${name}\nEmail：${email}\n\n${message}`)}`;
    window.location.href = mailto;
    if(formNote) formNote.textContent = "已為你開啟郵件軟體，確認後送出即可。";
  });
}

/* ========================================================================== 
   捲動進場動畫
   ========================================================================== */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(!prefersReducedMotion && "IntersectionObserver" in window){
  const revealTargets = document.querySelectorAll(".process-step, .about-content, .contact-inner, .section-head");
  revealTargets.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity .6s ease, transform .6s ease";
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });

  revealTargets.forEach(el => observer.observe(el));
}
