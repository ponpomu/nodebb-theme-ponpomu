'use strict';

const utils = module.exports;
const topics = require.main.require('./src/topics');
const meta = require.main.require('./src/meta');
utils.incrementViewCount = async (req, tid) => {
    const allow = req.uid > 0 || (meta.config.guestsIncrementTopicViews && req.uid === 0);
    if (allow) {
        req.session.tids_viewed = req.session.tids_viewed || {};
        const now = Date.now();
        const interval = meta.config.incrementTopicViewsInterval * 60000;
        if (!req.session.tids_viewed[tid] || req.session.tids_viewed[tid] < now - interval) {
            await topics.increaseViewCount(tid);
            req.session.tids_viewed[tid] = now;
        }
    }
}

utils.markAsRead = async (req, tid) => {
    if (req.loggedIn) {
        const markedRead = await topics.markAsRead([tid], req.uid);
        const promises = [topics.markTopicNotificationsRead([tid], req.uid)];
        if (markedRead) {
            promises.push(topics.pushUnreadCount(req.uid));
        }
        await Promise.all(promises);
    }
}

utils.isJSON = (str) => {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log('error：' + str + '!!!' + e);
            return false;
        }
    }
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

utils.eHentai = {
    title: (content) => {
        const Title = content.match(/Title: (.*)/)[1];
        const AlternateTitle = content.match(/Alternate Title: (.*)/)[1];
        return { eng: Title, jp: AlternateTitle }
    },
    author: (content) => {
        const Title = utils.eHentai.title(content);
        const eng_author = /(?:^.*?\[(?:.*?\())(.*?(?=\)\]))/g.exec(Title.eng)[1].trim().split(',');
        const jp_author = /(?:^.*?\[(?:.*?\())(.*?(?=\)\]))/g.exec(Title.jp)[1].trim().split(',');
        return { eng: eng_author, jp: jp_author }
    },
    tags: (content) => {
        const Tags = /Tags:\n(.*)/gs.exec(content);
        const tagList = {
            language: /(?:language: )(.*)/g,
            parody: /(?:parody: )(.*)/g,
            character: /(?:character: )(.*)/g,
            group: /(?:group: )(.*)/g,
            artist: /(?:artist: )(.*)/g,
            female: /(?:female: )(.*)/g,
            other: /(?:other: )(.*)/g,
        }
        for (const item in tagList) {
            // 判断是否匹配到标签
            if (!tagList[item].test(Tags)) { delete tagList[item]; continue; };
            tagList[item] = tagList[item].exec(Tags)[1].trim().split('> <')
            tagList[item] = tagList[item].map(item => item.replace(/</g, '').replace(/>/g, ''))
        }
        // 深拷贝对象
        const translation = JSON.parse(JSON.stringify(tagList))
        for (const tag in translation) {
            translation[tag] = translation[tag].map(item => utils.eHentai.tagTranslation(item, tag))
        }
        return { origin: tagList, translation };
    },
    // 翻译ehentai tag
    tagTranslation: (tag, type) => {
        try {
            const EhTagTranslation = require('./EhTagTranslation.json')
            const EhTagTranslationData = EhTagTranslation.data
            const EhTagTranslationDataLength = EhTagTranslationData.length
            for (let i = 0; i < EhTagTranslationDataLength; i++) {
                if (EhTagTranslationData[i].namespace === type) {
                    return EhTagTranslationData[i].data[`${tag}`].name
                }
            }
        }catch(error){
            return tag;
        }
    },
    // 获得全部过滤后的数据返回对象
    getAllData: (content) => {
        const title = utils.eHentai.title(content)
        // const author = utils.eHentai.author(content)
        const tags = utils.eHentai.tags(content)
        return { title, tags }
    }
}
