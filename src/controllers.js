'use strict';

const Controllers = module.exports;

const path = require('path');
const _ = require('lodash');
const fetch = require('node-fetch');

const accountHelpers = require.main.require('./src/controllers/accounts/helpers');
const helpers = require.main.require('./src/controllers/helpers');
const db = require.main.require('./src/database');
const meta = require.main.require('./src/meta');
const user = require.main.require('./src/user');
const analytics = require.main.require('./src/analytics');
const privileges = require.main.require('./src/privileges');
const Posts = require.main.require('./src/posts');
const Topics = require.main.require('./src/topics');
const Categories = require.main.require('./src/categories');

const utils = require('./utils');

// 漫画页获取漫画数据
Controllers.renderTopicomic = async (req, res, next) => {
	try {
		const { tid, index } = req.params;
		// const { readFuc } = req.query

		const themeConfigs = await meta.settings.get('ponpomu');
		const { apiResource, mediaResource } = themeConfigs
		const themeSettings = { apiResource, mediaResource };
		const [
			userPrivileges,
			// userSettings,
			topicData
		] = await Promise.all([
			privileges.topics.get(tid, req.uid),
			// user.getSettings(req.uid),
			Topics.getTopicData(tid)
		]);
		// 根据板块权限来限用户是否可以访问漫画页面
		if (!userPrivileges['topics:read'] || (
			!topicData?.scheduled &&
			topicData.deleted &&
			!userPrivileges.view_deleted)
		) {
			return helpers.notAllowed(req, res);
		}

		const comic = await Topics.getTopicField(tid, 'comic');
		const _key = comic._key.split(':')[1];

		const comicData = await fetch(`${apiResource}/comic/gallery/${_key}`).then(res => res.json());
		const chapters = comicData.chapters.sort((a, b) => a.sort - b.sort);

		const chapter_index = Number(index || '1') - 1;
		if (chapter_index && chapter_index > chapters.length - 1) { throw new Error('章节不存在') }
		const { media_id, title: chapterTitle } = chapters[chapter_index];

		let media = await fetch(`${apiResource}/comic/gallery/media/${media_id}`).then(res => res.json());
		media = {
			...media,
			chapterTitle,
			tid,
			status: comicData.status === 1 ? '连载: ' : '完结: ',
			path: path.join(comicData.source, comicData.id, media_id.split('_')[1]),
			comicTitle: comicData.title?.public,
			readFuc: '',
			index: chapter_index + 1,
			chapterNum: chapters.length,
			isPrev: Boolean(chapters[chapter_index - 1]),
			isNext: Boolean(chapters[chapter_index + 1]),
		}
		const { incrementViewCount, markAsRead } = utils;

		// 统计记录
		await Promise.all([
			incrementViewCount(tid),
			markAsRead(tid, req.uid),
			analytics.increment([`pageviews:byCid:${topicData.cid}`]),
		]);

		// filters过滤出章节标题
		const chapersFilter = chapters.map(({ title, media_id, sort }) => ({ title, media_id, sort }))

		res.render('topic_manhua', { media, chapers: chapersFilter, themeSettings });
	} catch (error) {
		res.json(error)
		console.log(error)
	}
};

// 将主题中的漫画内容替换为新的漫画内容
Controllers.changeComicContent = async (req, res, next) => {
	const themeConfig = await meta.settings.get('ponpomu')
	const {
		apiResource
	} = themeConfig
	const comicsWhitelist = themeConfig.comicsWhitelist.split(',').map(Number);
	const allCidTopics = []
	for await (const item of comicsWhitelist) {
		const topicsList = await Categories.getAllTopicIds(item, 0, -1)
		allCidTopics.push(...topicsList)
	}
	allCidTopics.forEach(async tid => {
		try {
			const topicData = await db.getObject(`topic:${tid}`)
			const { mainPid } = topicData
			const mainPidData = await db.getObject(`post:${mainPid}`);
			const bookData = mainPidData.content.replace(new RegExp(/\[\^\&\^\]/), "").replace(new RegExp(/\[\/\^\&\^\]/), "");
			let { _key } = await Topics.getTopicField(tid, 'comic');
			let new_key = _key.split(':')[1];
			const bookJson = await fetch(`${apiResource}/comic/gallery/${new_key}`).then(res => res.json());
			let { brief, author, title, id, chapters, tags, source } = bookJson;
			let postConent = `${!author ? '' : `作者:${author}\n`}${!brief ? '' : `简介:${brief}\n`}`
			await Posts.setPostField(mainPid, 'content', postConent);
			tags.forEach(tag => {
				console.log("🚀 ~ file: controllers.js:126 ~ Controllers.changeComicContent= ~ tag:", tag)
				if ((tag === "doujins" || tag === "non-h") && source === "4678440076103929247") {
					const replaceReq = {}
					replaceReq.body = { content: brief }
					replaceReq.params = { tid }
					replaceReq.query = { sourceId: source, type: tag }
					Controllers.applyComicTemplate(replaceReq)
				}
			})
			// await db.setObject(`post:${mainPid}`, `[^&^]${JSON.stringify(newMainPost)}[^&^]`);
			// await db.setObject(`cid:${cid}:tids`, data);
			// await topics.setTopicField(tid, 'lastposttime', Date.now());
			// }
		} catch (error) {
			console.error(error);
		}
	})


	return res.json(200);
};

//修改漫画的最新时间
Controllers.changeComicLastTime = async (req, res, next) => {
	try {
		const { tid, uploadTime } = req.query
		const topicData = await db.getObject(`topic:${tid}`)
		const { cid, mainPid } = topicData
		if (uploadTime && Number(uploadTime)) {
			await Posts.setPostFields(mainPid, {
				timestamp: Number(uploadTime),
			});
			await Topics.setTopicFields(tid, {
				lastposttime: Number(uploadTime),
				timestamp: Number(uploadTime)
			});
			await db.sortedSetAdd(`cid:${cid}:tids`, Number(uploadTime), topicData.tid);
		}
		res.status(200).json(200)
	} catch (error) {
		console.error(error);
		res.status(404);
	}
}

//更新漫画数据
Controllers.updateComicData = async (req, res, next) => {
	try {
		const raw = req.body;
		const { tid } = req.params
		let { _key, brief, author, title, id, chapters } = raw
		chapters = chapters.map(item => {
			return {
				media_id: item.media_id,
				sort: item.sort,
				title: item.title
			}
		})
		const comicData = {
			_key, brief, author, title, id, chapters
		}
		await Topics.setTopicField(tid, 'comic', comicData);
		res.json(200);
	} catch (error) {
		console.error(error);
		res.json(404);
	}
}

Controllers.applyComicTemplate = async (req, res, next) => {
	// 源ID对应
	const sourceLibrary = {
		"e-hentai": "4678440076103929247",
		"nHentai.com": "8504927104562262528",
		"wnacg": "6551136894818591762",
		"picacomic": "5768337869316468367"
	}
	try {
		const { eHentai } = utils
		const { tid } = req.params
		const { sourceId, type } = req.query
		const comicData = req.body;
		if (sourceLibrary['e-hentai'] === sourceId) {
			const { content } = comicData
			const bookJson = eHentai.getAllData(content)
			const title = bookJson.title.jp
			const tagsChinese = bookJson.tags.translation

			const tagsFilte = []
			for (const tag in tagsChinese) {
				if (Object.hasOwnProperty.call(tagsChinese, tag)) {
					const element = tagsChinese[tag];
					if (!element || typeof element !== 'object' || element.length === 0) continue;
					element.forEach(item => {
						if (tag === 'group' || tag === 'artist') {
							tagsFilte.unshift(`@${item}`)
						} else if (tag !== 'language') {
							tagsFilte.push(item)
						}
					})
				}
			}
			tagsFilte.unshift(`${type}`)
			await Topics.updateTopicTags(tid, tagsFilte);
			await Topics.setTopicField(tid, 'title', title);
			await Topics.setTopicField(tid, 'slug', tid + "/slug");
		}
	} catch (error) {
		console.error(error);
	}
}



// 主题默认控制件
Controllers.renderAdminPage = async (req, res) => {
	res.render(`admin/plugins/ponpomu`, {
		nbbId: "ponpomu"
	});
}
Controllers.renderThemeSettings = async (req, res, next) => {
	const userData = await accountHelpers.getUserDataByUserSlug(req.params.userslug, req.uid, req.query);
	if (!userData) {
		return next();
	}
	const lib = require('./theme');
	userData.theme = await lib.loadThemeConfig(userData.uid);
	userData.title = '[[themes/harmony:settings.title]]';
	userData.breadcrumbs = helpers.buildBreadcrumbs([{
		text: userData.username,
		url: `/user/${userData.userslug}`
	},
	{
		text: '[[themes/harmony:settings.title]]'
	},
	]);

	res.render('account/theme', userData);
};