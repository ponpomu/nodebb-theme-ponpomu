<div class="notifications">
	<div class="btn-toolbar justify-content-end" role="toolbar">
		<button class="btn btn-sm btn-light" component="notifications/mark_all">[[notifications:mark_all_read]]</button>
	</div>

	<hr class="text-muted opacity-25"/>

	<div class="d-flex flex-column flex-md-row">
		<div class="flex-0 pe-2 border-end-md text-sm mb-3 flex-basis-md-200">
			<div class="nav sticky-top d-flex flex-row flex-md-column flex-wrap gap-1" style="z-index: 1;">
				{{{ each filters }}}
				{{{ if ./separator }}}
				<hr/>
				{{{ else }}}
				<a class="btn-ghost fw-semibold {{{ if ./selected }}}active{{{ end }}}" href="{config.relative_path}/notifications?filter={./filter}">
					<div class="flex-1">{filters.name}</div>
					<span class="text-xs human-readable-number" title="{./count}">{./count}</span>
				</a>
				{{{ end }}}
				{{{ end }}}
			</div>
		</div>
		<div class="flex-1 ps-md-2 ps-lg-5">
			<ul component="notifications/list" class="notifications-list list-unstyled" data-nextstart="{nextStart}">
				<!-- IMPORT partials/notifications_list.tpl -->
			</ul>
			<!-- IMPORT partials/paginator.tpl -->
		</div>
	</div>
</div>


