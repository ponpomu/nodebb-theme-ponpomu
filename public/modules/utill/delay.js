
// 防抖
export function debounce(func, delay) {
	let timerId;

	return function (...args) {
		const context = this;

		clearTimeout(timerId);

		timerId = setTimeout(function () {
			func.apply(context, args);
		}, delay);
	};
}


// 节流
export function throttle(func, delay) {
	let timerId;
	let lastExecTime = 0;

	return function (...args) {
		const context = this;
		const currentTime = Date.now();

		if (currentTime - lastExecTime < delay) {
			clearTimeout(timerId);
			timerId = setTimeout(function () {
				lastExecTime = currentTime;
				func.apply(context, args);
			}, delay);
		} else {
			lastExecTime = currentTime;
			func.apply(context, args);
		}
	};
}

export function delayedPromise(promiseFunction) {
	let promise = null;
	return function () {
		if (!promise) {
			promise = promiseFunction();
		}
		return promise;
	};
}



