.intro-main-image-wrapper,
.hero-board,
.about-frame{
  position: relative;
}

.intro-main-image:hover{
  transform: translateY(-2px);
  transition: transform .25s ease;
}

.report-paragraphs p{
  position: relative;
}

.report-paragraphs p::before{
  content:"";
  position:absolute;
  left:-18px;
  top:.95em;
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  opacity:.7;
}
