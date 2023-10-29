'use strict';
const fs = require('fs');
const nconf = require('nconf');
const Meta = require.main.require('./src/meta');
const Topics = require.main.require('./src/topics');
const _ = require.main.require('lodash');


const routeHelpers = require.main.require('./src/routes/helpers');
const graceful = require('graceful-fs');
const NodeCache = require('node-cache');
graceful.gracefulify(fs);

const controllers = require('@veronikya/nodebb-theme-ponpomu/src/controllers');
module.exports = require('@veronikya/nodebb-theme-ponpomu/src/theme')

const Plugin = module.exports;

async function pageIsDisplaye(cid) {
	const themeConfig = await Meta.settings.get('ponpomu')
	const comicsWhitelist = themeConfig.comicsWhitelist.split(',').map(Number);
	return comicsWhitelist.includes(cid);
}


Plugin.init = async function (params) {
	const { router, middleware } = params;
	// 确认管理员的中间件
	const adminPrivilege = [middleware.ensureLoggedIn, middleware.admin.checkPrivileges];
	const themePrivilege = [middleware.exposeUid,middleware.ensureLoggedIn,middleware.canViewUsers,middleware.checkAccountPermissions];
	routeHelpers.setupAdminPageRoute(router, `/admin/plugins/ponpomu`, [], controllers.renderAdminPage);
	routeHelpers.setupPageRoute(router, '/user/:userslug/theme', themePrivilege, controllers.renderThemeSettings);
	routeHelpers.setupPageRoute(router, `/topic/:tid/comic/:index?`, [], controllers.renderTopicomic);
	routeHelpers.setupAdminPageRoute(router, `/admin/plugins/ponpomu/changeComicContent`, [], controllers.changeComicContent);

	routeHelpers.setupApiRoute(router, 'put', '/poapi/changeComicLastTime', adminPrivilege, controllers.changeComicLastTime)  // 修改帖子的时间和排序板块里的排序顺序
	routeHelpers.setupApiRoute(router, 'put', '/poapi/:tid/update', adminPrivilege, controllers.updateComicData)			  // 将漫画信息写入到数据库
	routeHelpers.setupApiRoute(router, 'put', '/poapi/:tid/template', adminPrivilege, controllers.applyComicTemplate)		  // 将漫画模板应用到帖子并修改数据库

	if (nconf.get('isPrimary') && process.env.NODE_ENV === 'production') {
		setTimeout(buildSkins, 0);
	}
};

async function buildSkins() {
	try {
		const plugins = require.main.require('./src/plugins');
		await plugins.prepareForBuild(['client side styles']);
		for (const skin of meta.css.supportedSkins) {
			await meta.css.buildBundle(`client-${skin}`, true);
		}
		require.main.require('./src/meta/minifier').killAll();
	} catch (err) {
		console.error(err.stack);
	}
}

Plugin.middlewareFinalRender = async (hookData) => {
	// const { templateData } = hookData;
	// const posts = templateData?.posts
	// for (const post of posts || []) {
	// 	const regex1 = /(\[\^\&amp\;\^\])(\{.*\})(\[\/\^\&amp\;\^\])/gs
	// 	post.content = post.content ? post.content.replace(regex1, '') : post.content;
	// }
	return hookData;
};




const getComicsWhitelist = async (theme) => {
	let { comicsWhitelist } = await Meta.settings.get(theme);
	if (!comicsWhitelist) return [];
	return comicsWhitelist.split(',').map(Number);
};

const setVisibility = (hookData, isVisible) => {
	hookData.category.isVisibleBug = typeof hookData.category.isVisibleBug === 'undefined' ? isVisible : hookData.category.isVisibleBug;
};

Plugin.parseCategoryData = async (hookData = {}) => {
	try {
		const comicsWhitelist = await getComicsWhitelist('ponpomu');
		const cid = hookData.category.cid;
		const isVisible = comicsWhitelist.includes(cid);
		setVisibility(hookData, isVisible);
	} catch (e) {
		console.log("comicsWhitelist没有进行设置", e)
	}
	return hookData;
};

Plugin.topicGetFields = async (hookData = {}) => {
	const { topics } = hookData;
	const comicsWhitelist = await getComicsWhitelist('ponpomu');
	if (!topics || !comicsWhitelist || !topics[0]?.tid) return hookData;
	for await (const topic of topics) {
		let cid = topic?.cid;
		if (!cid && !topic.tid) continue;
		cid = Number(cid);
		const isVisible = comicsWhitelist.includes(cid);
		topic.isComic = isVisible;
		if (isVisible) {
			let thumb = await Topics.thumbs.get(topic.tid);

			topic.thumb = thumb[0];
		}
	};
	return hookData;
};

Plugin.topicCreateHandle = async (hookData) => {
	let { tid } = hookData.topic
	hookData.topic.slug = `${tid}/topic`
	return hookData;
}



Plugin.topicSavedHandle = async (hookData) => {
	return hookData;
}

