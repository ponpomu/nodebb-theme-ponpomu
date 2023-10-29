
<!-- IMPORT customize/manga/header.tpl -->

<div class="loading-box">
	<span class="loader"></span>
	<div class="load-info">
		<p class="fw-bold">当前: {media.chapterTitle}</p>
		<p class="fw-bold">总页数: <span>{media.pages.length}</span></p>
	</div>
	<div class="alert alert-dark" role="alert">
		po-po~pom!^^
	</div>
</div>

<style>
	#comic-page-header{
		transform: translateY(0%) !important;
	}

	.loading-box{
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.load-info{
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	
	.load-info p{
		margin: 0;
		padding: 0;
	}
</style>