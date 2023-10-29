<!-- IMPORT customize/manga/header.tpl -->

<!-- IMPORT customize/manga/status.tpl -->
<div class="comic-bottom comic-page-count">加载中...</div>
{{{ if (config.theme.readFuc=="scroll") }}}
  <!-- IMPORT customize/manga/scroll_Page.tpl -->
  <!-- IMPORT customize/manga/foot.tpl -->
{{{ else }}}
  <!-- IMPORT customize/manga/turn_Page.tpl -->
{{{ end }}}