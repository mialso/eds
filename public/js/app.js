;(function(glob) {
	'use strict'
	if (glob.app) throw new Error('<app>: global [app] is already defined')
	Object.defineProperty(glob, 'app', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: {},
	})
})(window);
