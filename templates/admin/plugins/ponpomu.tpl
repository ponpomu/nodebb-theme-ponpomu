<div class="row">
	 <div class="col-sm-9">
        <ul class="nav nav-tabs mb-3" role="tablist">
            <li role="presentation" class="nav-item"><a class="nav-link active" href="#Theme-settings" aria-controls="Theme-setting" role="tab" data-bs-toggle="tab">Theme settings</a></li>
			 <li role="presentation" class="nav-item"><a class="nav-link" href="#Comic-settings" aria-controls="Comic-setting" role="tab" data-bs-toggle="tab">Comic settings</a></li>
        </ul>
	  </div>
			<form role="form" class="{nbbId}-settings">
				<fieldset>
					<div class="tab-content">
					<div role="tabpanel" class="tab-pane fade show active" id="Theme-settings">
						<div class="row">
							<div class="col-sm-10 col-12">
									<div class="form-check form-switch">
										<input type="checkbox" class="form-check-input" id="enableQuickReply" name="enableQuickReply" />
										<label for="enableQuickReply" class="form-check-label">[[harmony:settings.enableQuickReply]]</label>
									</div>
									<div class="form-check form-switch">
										<input type="checkbox" class="form-check-input" id="centerHeaderElements" name="centerHeaderElements" />
										<label for="centerHeaderElements" class="form-check-label">[[harmony:settings.centerHeaderElements]]</label>
									</div>
									<div class="form-check form-switch">
										<input type="checkbox" class="form-check-input" id="stickyToolbar" name="stickyToolbar" />
										<div for="stickyToolbar" class="form-check-label">
											[[harmony:settings.stickyToolbar]]
											<p class="form-text">
												[[harmony:settings.stickyToolbar.help]]
											</p>
										</div>
									</div>
									<div class="form-check form-switch">
										<input type="checkbox" class="form-check-input" id="autohideBottombar" name="autohideBottombar" />
										<div for="autohideBottombar" class="form-check-label">
											[[harmony:settings.autohideBottombar]]
											<p class="form-text">
												[[harmony:settings.autohideBottombar.help]]
											</p>
										</div>
									</div>
																	
							</div>
						</div>
					</div>
					<div role="tabpanel" class="tab-pane fade" id="Comic-settings">
							<div class="mb-3">
								<label class="form-label" for="comicsWhitelist">漫画板块白名单</label>
								<input placeholder="请在需要爬虫的板块输入对应的Cid" type="text" class="form-control" id="comicsWhitelist" name="comicsWhitelist"/>
							</div>
							<div class="row">	

								<div class="col-sm-6">
									<div class="card">
										<div class="card-header">全局替换(谨点)</div>
										<div class="card-body">
											<button style="width:400px" class="btn btn-primary" id="changeComicContent">替换漫画板块的内容和对漫画页的图片资源进行上传</button>
											<p class="help-block">
												会替换爬虫模块的内容
											</p>
										</div>
									</div>
								</div>
								
								<div class="col-sm-6">
									<div class="card">
										<div class="card-header">中间人api设置</div>
										<div class="card-body">
											<input class="form-control" type="text" name="apiResource" placeholder="eg: https://api.ponpomu.com">
											<p class="help-block px-1">
												资源api地址，用于上传和获取漫画数据
											</p>
										</div>
										<div class="card-header">媒体服务器设置</div>
										<div class="card-body">
											<input class="form-control" type="text" name="mediaResource" placeholder="eg: https://img.ponpomu.com or /assets/uploads/locals">
											<p class="help-block px-1">
												图片资源获取地址
											</p>
										</div>
									</div>
								</div>

								<div class="input-group mb-3 ">
									<input id="fetchTachiComic_input" type="text" class="form-control" placeholder="图廊ID" aria-label="gallery ID" aria-describedby="basic-addon2">
									<div class="input-group-append">
										<button class="btn btn-outline-secondary" type="button" id="fetchTachiComic_button">爬取漫画</button>
									</div>
								</div>
												
							</div>
					</div>
				</fieldset>
			</form>
			
			




</div>

<!-- IMPORT admin/partials/save_button.tpl -->
