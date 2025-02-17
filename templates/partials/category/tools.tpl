{{{ if showTopicTools }}}
<div class="btn-group thread-tools bottom-sheet">
	<button class="btn-ghost-sm d-flex gap-2 dropdown-toggle" data-bs-toggle="dropdown" type="button">
		<i class="fa fa-fw fa-gear text-primary"></i>
		<span class="visible-md-inline visible-lg-inline fw-semibold">[[topic:thread-tools.title]]</span>
		<span component="topic/selected/badge" class="badge rounded-pill bg-secondary"></span>
	</button>
	<ul class="dropdown-menu p-1 text-sm">
		<li>
			<a component="topic/mark-unread-for-all" href="#" class="dropdown-item rounded-1 d-flex align-items-center gap-2">
				<i class="fa fa-fw text-muted fa-inbox"></i> [[topic:thread-tools.markAsUnreadForAll]]
			</a>
		</li>
		<li>
			<a component="topic/pin" href="#" class="dropdown-item rounded-1 d-flex align-items-center gap-2">
				<i class="fa fa-fw text-muted fa-thumb-tack"></i> [[topic:thread-tools.pin]]
			</a>
		</li>
		<li>
			<a component="topic/unpin" href="#" class="hidden dropdown-item rounded-1">
				<i class="fa fa-fw text-muted fa-thumb-tack fa-rotate-90"></i> [[topic:thread-tools.unpin]]
			</a>
		</li>

		<li>
			<a component="topic/lock" href="#" class="dropdown-item rounded-1 d-flex align-items-center gap-2">
				<i class="fa fa-fw text-muted fa-lock"></i> [[topic:thread-tools.lock]]
			</a>
		</li>
		<li>
			<a component="topic/unlock" href="#" class="hidden dropdown-item rounded-1 d-flex align-items-center gap-2">
				<i class="fa fa-fw text-muted fa-unlock"></i> [[topic:thread-tools.unlock]]
			</a>
		</li>

		<li class="dropdown-divider"></li>

		<li>
			<a component="topic/move" href="#" class="dropdown-item rounded-1 d-flex align-items-center gap-2">
				<i class="fa fa-fw text-muted fa-arrows"></i> [[topic:thread-tools.move]]
			</a>
		</li>
		{{{if template.category}}}
		<li>
			<a component="topic/move-all" href="#" class="dropdown-item rounded-1 d-flex align-items-center gap-2">
				<i class="fa fa-fw text-muted fa-arrows"></i> [[topic:thread-tools.move-all]]
			</a>
		</li>
		{{{end}}}
		<li>
			<a component="topic/merge" href="#" class="dropdown-item rounded-1 d-flex align-items-center gap-2">
				<i class="fa fa-fw text-muted fa-code-fork"></i> [[topic:thread-tools.merge]]
			</a>
		</li>

		<li>
			<a component="topic/tag" href="#" class="dropdown-item rounded-1 d-flex align-items-center gap-2">
				<i class="fa fa-fw text-muted fa-tag"></i> [[topic:thread-tools.tag]]
			</a>
		</li>

		<li class="dropdown-divider"></li>

		<li>
			<a component="topic/delete" href="#" class="dropdown-item rounded-1 d-flex align-items-center gap-2">
				<i class="fa fa-fw text-muted fa-trash-o"></i> [[topic:thread-tools.delete]]
			</a>
		</li>
		<li>
			<a component="topic/restore" href="#" class="hidden dropdown-item rounded-1">
				<i class="fa fa-fw text-muted fa-history"></i> [[topic:thread-tools.restore]]
			</a>
		</li>
		<li>
			<a component="topic/purge" href="#" class="hidden dropdown-item rounded-1">
				<i class="fa fa-fw text-muted fa-eraser"></i> [[topic:thread-tools.purge]]
			</a>
		</li>

		{{{each thread_tools}}}
		<li>
			<a href="#" class="dropdown-item rounded-1 d-flex align-items-center gap-2 {thread_tools.class}">
				<i class="fa fa-fw {thread_tools.icon}"></i>
				{thread_tools.title}</a>
		</li>
		{{{end}}}
	</ul>
</div>
{{{ end }}}