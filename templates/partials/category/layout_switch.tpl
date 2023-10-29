
<div class="btn-group thread-tools bottom-sheet" component="thread/layout">
	<button class="btn-ghost-sm d-flex gap-2 dropdown-toggle" data-bs-toggle="dropdown" type="button">
		<i class="fa fa-fw fa-grip text-primary"></i>
		<span class="visible-md-inline visible-lg-inline fw-semibold">布局切换</span>
		<span component="topic/selected/badge" class="badge rounded-pill bg-secondary"></span>
	</button>
	<ul class="dropdown-menu p-1 text-sm">
		<li class="dropdown-item">开发中...</li>
		<li class="dropdown-divider"></li>
		<li class="dropdown-item"> 
			<i class="fa-solid fa-table-cells"></i> 网格
		</li>

		<li>
			<a component="topic/layout-table_2x2" href="#" class="dropdown-item layout-table_2x2">
				 铺满
			</a>
		</li>
		
		<li class="dropdown-divider"></li>
		<li class="dropdown-item">
			<i class="fa-solid fa-list"> </i> 列表
		</li>
		
		<li>
			<a component="topic/layout-list_1x1" href="#" class="dropdown-item layout-list_1x1 default">
				默认
			</a>
			<a component="topic/layout-list_2x2" href="#" class="dropdown-item layout-list_2x2">
				2 x 2 列表
			</a>
		</li>
	</ul>
</div>