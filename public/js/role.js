;(function(glob) {
	'use strict'

	// check if global app is ready to use
	if (!glob.app || typeof glob.app !== 'object') {
		throw new Error(`${mName}: global [app] is not defined or wrong type`)
	}
	// check dependencies
	if (!glob.app.Atom || typeof glob.app.Atom !== 'function') {
		throw new Error(`${mName}: <Atom> is not defined or wrong type`)
	}

	function Role () {
		'use strict'
		// check to be called with 'new' keyword
		if (!(this instanceof User)) {
			throw new Error(`${mName}: User(): needs to be called with new keyword`)
		}
		Object.defineProperty(this, 'name', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: new glob.app.Atom('name', 'string'),
		})
	}

})(window, '<role>');
