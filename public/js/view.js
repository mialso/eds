;(function(glob) {
	'use strict'

	if (!glob.app || typeof glob.app !== 'object') {
		throw new Error(`${mName}: global [app] is not defined or wrong type`)
	}
	// check dependencies
	if (!glob.app.Atom || typeof glob.app.Atom !== 'function') {
		throw new Error(`${mName}: <Atom> is not defined or wrong type`)
	}

	function View () {
		'use strict'
		// check to be called with 'new' keyword
		if (!(this instanceof View)) {
			throw new Error(`${mName}: User(): needs to be called with new keyword`)
		}
		Object.defineProperty(this, 'name', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: new glob.app.Atom('viewName', 'string'),
		})
    this.components = {}
	}

	glob.app.view = new View()
	if (!(glob.app.view instanceof View)) {
		throw new Error(`${mName}: unable to initialise view`)
	}

	// subsribe to user changes
	glob.app.user.role.modelWatch((newRole) => {
		switch (newRole) {
			case 'guest':
				glob.app.view.name.value = 'login'; return
			case 'teacher':
			case 'student':
				glob.app.view.name.value = 'main'; return
			default:
				return
		}
	})

})(window, '<view>');
