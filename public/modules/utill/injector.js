
// 在获取方法时候自动绑定当前类的this
function selfish(target) {
	const cache = new WeakMap();
	const handler = {
		get(target, key) {
			const value = Reflect.get(target, key);
			if (typeof value !== 'function') {
				return value;
			}
			if (!cache.has(value)) {
				cache.set(value, value.bind(target));
			}
			return cache.get(value);
		},
	};
	const proxy = new Proxy(target, handler);
	return proxy;
}

export default class Container {
	constructor() {
		this.dependencies = {};
	}

	register(name, dependency) {
		this.dependencies[name] = dependency;
	}

	provide(name, provider) {
		this.dependency[name] = this.dependency[name].bind(provider);
	}

	resolve(dependencies, func) {
		const resolvedDependencies = dependencies.map(dep => this.dependencies[dep]);
		return selfish(func(...resolvedDependencies));
	}

	get(name) {
		return this.dependencies[name];
	}
}

