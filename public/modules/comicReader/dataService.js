class DataService {
	constructor(ajaxify, localStorage) {
		this.ajaxify = ajaxify;
		this.localStorage = localStorage;
		this.data = ajaxify.data;
		this.media = ajaxify.data.media;
	}

	getMediaData = () => {
		return this.ajaxify.data.media;
	}

	getMediaPages = () => {
		const {pages, path} = this.ajaxify.data.media
		const { mediaResource } = this.ajaxify.data.themeSettings
		let newPages = Object.assign({}, pages);
		for(const key in newPages){
			newPages[key].url = `${mediaResource}/images/${path}/${newPages[key].name}`
		}
		return newPages;
	}

	getMaxPageLength = () => {
		return this.ajaxify.data.media.pages.length;
	}

	static currentPageMediakey = (data, pageIndex) => {
		const chaper = data.chapers[pageIndex];
		return {
			_key: `media:${chaper.media_id}`,
			...chaper,
		};
	}

    getComicReadHistory = (relatTid) => {
		return JSON.parse(this.localStorage.getItem(`COMIC:${relatTid}`)) || [];
	}

	setComicReadHistory = (saveData, relatTid) => {
		return this.localStorage.setItem(`COMIC:${relatTid}`, JSON.stringify(saveData));
	}

	checkTpl = (name) => {
		return this.data.template[`${name}`];
	}

	getcurrentUrlParme = (prop, currentURL = window.location.href) => {
		currentURL = new URL(currentURL);
		const params = new URLSearchParams(currentURL.search);
		const paramValue = params.get(`${prop}`);
		return paramValue;
	}

	getcurrentUrlHash = (currentURL = window.location.href) => {
		currentURL = new URL(currentURL);
		const hash = currentURL.hash;
		return hash.replace(/#/,"").replace(/page-/,"") || null;
	}

	checkReadFunc = (tid) => {
		const history = this.getComicReadHistory(tid);
		const currentStatus = this.getcurrentUrlParme('readFuc') || history.readFuc || window.config.theme.readFuc || 'scorll';
		console.log('history.readFuc:', currentStatus);
		return currentStatus;
	}

	getCurrentPageIndex = () => {
		const { tid, index } = this.media
		const history = this.getComicReadHistory(tid);
		const pageHash = this.getcurrentUrlHash();
		const {endReadChapter, readPageIndex} = history
		let currentIndex = index === endReadChapter ? readPageIndex : 1;
		return parseInt(pageHash || currentIndex, 10);
	}
}

module.exports = DataService;
