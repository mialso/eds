;(function(glob) {
	'use strict'
	if (glob.app) throw new Error('<app>: global [app] is already defined')
	Object.defineProperty(glob, 'app', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: {},
	})
	// encapsulate storage TODO refactor to module
	Object.defineProperty(glob.app, 'storage', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: glob.localStorage,
	})
	glob.addEventListener('load', () => {
		glob.app.user.login()
	})
})(window);
