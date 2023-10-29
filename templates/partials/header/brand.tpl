{{{ if (brand:logo || config.showSiteTitle)}}}
<div class="container px-md-4 brand-container">
	<div class="col-12 d-flex border-bottom pb-1 {{{ if config.theme.centerHeaderElements }}}justify-content-center{{{ end }}}">
		<div component="brand/wrapper" class="d-flex align-items-center gap-1 p-2 rounded-1 align-content-stretch ">
			{{{ if brand:logo }}}
			<a component="brand/anchor" href="{{{ if brand:logo:url }}}{brand:logo:url}{{{ else }}}{relative_path}/{{{ end }}}">
				<img component="brand/logo" alt="{brand:logo:alt}" class="{brand:logo:display}" src="{brand:logo}?{config.cache-buster}" />
			</a>
			{{{ end }}}

			{{{ if config.showSiteTitle }}}
			<a component="siteTitle" class="text-truncate align-self-stretch align-items-center d-flex" href="{{{ if title:url }}}{title:url}{{{ else }}}{relative_path}/{{{ end }}}">
				<h1 class="fs-6 fw-bold text-body mb-0"><span class="split-title">Ponpomu</span><span class="split">Yuri</span></h1>
			</a>
			{{{ end }}}
		</div>
		{{{ if widgets.brand-header.length }}}
		<div data-widget-area="brand-header" class="flex-fill gap-3 p-2 align-self-center">
			{{{each widgets.brand-header}}}
			{{./html}}
			{{{end}}}
		</div>
		{{{ end }}}
	</div>
</div>
{{{ end }}}

<style>
span.split {
    color: #FF550C;
    font-weight: 600;
    position: relative;
    text-transform: uppercase;
    -webkit-text-fill-color: transparent;
    background-image: linear-gradient(270deg, #e5342a, #fb8b23);
    -webkit-background-clip: text;
    background-clip: text;
}
span.split {
    color: #FF550C;
    font-weight: 600;
    position: relative;
}
</style>
