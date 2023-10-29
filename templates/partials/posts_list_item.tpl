<hr />
<div class="card p-2" style="
        display: flex;
        flex-direction: row;
        justify-content: flex-start;">
    {{{ if ./topic.thumb.url}}}
    <a href="{config.relative_path}/post/{./pid}">
        <img class="comic-bookmark img-fluid lazyload" data-srcset="{./topic.thumb.url}"
            src="/assets/uploads/system/ezgif.com-gif-maker.webp" />
        {{{ end }}}
    </a>
    <li component="post" style="width: 100%;"
        class="posts-list-item  {{{ if ./deleted }}} deleted{{{ else }}}{{{ if ./topic.deleted }}} deleted{{{ end }}}{{{ end }}}{{{ if ./topic.scheduled }}} scheduled{{{ end }}} mx-3"
        data-pid="{./pid}" data-uid="{./uid}">
        <a class="d-flex gap-1 align-items-center topic-title fw-semibold fs-8 mb-3 text-reset text-break"
            href="{config.relative_path}/post/{./pid}">
            {./topic.title}
        </a>
        <span data-tid="{./topic.tid}" component="topic/tags" class="lh-1 tag-list hidden-xs d-flex flex-wrap gap-1 {{{ if !./topic.tags.length }}}hidden{{{ end }}}">
            {{{ each ./topic.tags }}}
            <a href="{config.relative_path}/tags/{./valueEncoded}"><span class="badge border border-gray-300 fw-normal tag tag-class-{./class}" data-tag="{./value}">{./valueEscaped}</span></a>
            {{{ end }}}
        </span>
        <div class="post-body d-flex flex-column gap-1">
            <div class="d-flex flex-column gap-1 post-info">
                <div class="post-author d-flex align-items-center gap-1">
                    <!-- <a class="lh-1" href="/category/{./topic.cid}"><span class="badge border border-gray-300 text-xs tag">{function.buildCategoryLabel, category, "border"}</span></a> -->
                </div>
                <span class="timeago text-sm text-muted" title="{./timestampISO}"></span>

            </div>
            <div component="post/content" class="content text-sm text-break">
                {./content}
            </div>
        </div>
    </li>
</div>
<style>
    div[component="post/content"] {
        width: 100%;
        height: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        /* width: 100px; */
        display: inline-block;
        color: #ccc;
    }

    div[component="post/content"] p{
        width: 0px;
        
    }

    .comic-bookmark.img-fluid {
        max-height: 143px;
        width: auto;
    }
</style>
