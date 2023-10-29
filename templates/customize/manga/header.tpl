<div id="comic-page-header" class="bg-opacity-75" style="transform: translateY(-100%);">
    <div id="comic-page-nav">
        <div class="return-to-comic">
            <a class="btn"><i class="fa fa-xl fa-solid fa-arrow-left rounded-1" data-label="arrow-left (solid)"></i></a>
        </div>
        <div class="comic-info">
            <div class="comic-title">
                {media.comicTitle}
            </div>
            <div class="chaper-title">
                <span>{media.status}</span> {media.chapterTitle}
            </div>
        </div>
    </div>
    <div id="comic-page-tool">
        <div class="chaper-menu">
            <a class="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button"
                aria-controls="offcanvasExample">
                <i class="fa fa-xl fa-solid fa-bars rounded-1" data-label="Bars (solid)"></i>
            </a>
        </div>
    </div>
</div>

<div class="offcanvas offcanvas-end tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel"
  style="padding-top: 60px; z-index: 1501;">
  <div class="offcanvas-header">
    <h3 class="offcanvas-title" id="offcanvasExampleLabel">章节目录</h3>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div class="chapter-list">
      {{{ each ./chapers }}}
      <a type="button" class="btn btn-outline-secondary btn-chapter my-1" data-bs-dismiss="offcanvas" aria-label="Close"
        onclick="location.replace('{./sort}')"
        index-data="{./sort}">{./title}</a>
      {{{ end }}}
    </div>
  </div>
</div>