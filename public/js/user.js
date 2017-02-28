;(function(glob, mName) {
	'use strict'

	// check if global app is ready to use
	if (!glob.app || typeof glob.app !== 'object') {
		throw new Error(`${mName}: global [app] is not defined or wrong type`)
	}
	// check dependencies
	if (!glob.app.Atom || typeof glob.app.Atom !== 'function') {
		throw new Error(`${mName}: <Atom> is not defined or wrong type`)
	}

	function User () {
		'use strict'
		// check to be called with 'new' keyword
		if (!(this instanceof User)) {
			throw new Error(`${mName}: User(): needs to be called with new keyword`)
		}

		Object.defineProperty(this, 'name', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: new glob.app.Atom('userName', 'string'),
		})

		Object.defineProperty(this, 'role', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: new glob.app.Atom('userRole', 'string'),
		})
		Object.defineProperty(this, 'loginToken', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: new glob.app.Atom('userLoginToken', 'string')
		})
	}

	User.prototype.login = function() {
		glob.app.storage.setItem('user', this.userLoginToken.value)
		this.updateUser()
	}
	User.prototype.logout = function() {
		console.log('logout')
		glob.app.storage.removeItem('user')
		this.name.value = null
		this.role.value = 'guest'
	}
	User.prototype.updateUser = function () {
		// TODO watcher double initialization
		if (this.name.value === null) {
			glob.app.watchData('userToken', validateToken)
			// glob.app.registerAction('userLoginTokenValid')
		}

		const localUser = glob.app.storage.getItem('user')
		if (localUser === null) {
			this.name.value = 'guest'; this.role.value = 'guest'; return
		}
		const newUser = serverLogin(localUser)
		if (newUser === null) {
			this.name.value = 'guest'; this.role.value = 'guest'; return
		}
		this.name.value = newUser.name
		this.role.value = newUser.role
		glob.app.storage.setItem('user', newUser.token)
	}

	glob.app.user = new User()
	if (!(glob.app.user instanceof User)) {
		throw new Error(`${mName}: unable to initialise user`)
	}

	function validateToken (userToken) {
		if (typeof userToken === 'string' && userToken.length > 2) {
			glob.app.action(null, 'userLoginTokenValid')
			return
		}
	}
	// stub for server request
	function serverLogin (userToken) {
		switch (userToken) {
			case 'some': return { name: 'Mik', role: 'teacher', token: 'some' }
			case 'awesome': return { name: 'Jim', role: 'student', token: 'awesome' }
			default: return null
		}
	}
	
})(window, '<user>');
