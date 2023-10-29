<div class="comic-page-container comic-readFuc-scroll" style="gap: 0rem !important; ">
    {{{ each ./media.pages }}}
      <div class="ratio-container" id="page-{increment(@index, " 1")}" style="">
        <img alt="{pages.name}" data-sizes="auto"
          data-srcset="{themeSettings.mediaResource}/images/{media.path}/{pages.name}" style="width: 100%; height: 100%;"
          src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="lazyload" />
      </div>
      {{{ end }}}
  </div>
 
<style>
@media screen and (min-width: 1024px) and (orientation: landscape){
  .page-topic-comic.template-topic_manhua .px-md-4 {
     width: 50%;
  }
}
</style>