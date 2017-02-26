;(function(glob, mName) {
	'use strict'

	// check if global app is ready to use
	if (!glob.app || typeof glob.app !== 'object') {
		throw new Error(`${mName}: global [app] is not defined or wrong type`)
	}

	const keys = {}

	function Atom (key, valueType) {
		'use strict'
		// check to be called with 'new' keyword
		if (!(this instanceof Atom)) {
			throw new Error(`${mName}: Atom(): needs to be called with new keyword`)
		}
		// set type and check if 'valueType' is supported
		switch (valueType) {
			case "number":
			case "boolean":
			case "string":
				Object.defineProperty(this, 'type', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: valueType,
				})
				break;
			default:
				throw new Error(`${mName}: Atom(): type '${valueType}' is not supported`)
		}
		// check 'key' is a string
		if (typeof key !== "string") {
			throw new Error(`${mName}: Atom(): key argument should be a string`)
		}

		Object.defineProperty(this, 'key', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: key,
		})

		let data = null 
		const subscribers = []

		Object.defineProperty(this, 'value', {
			get: function() { return data },
			set: function(newData) { 
				if (typeof newData !== this.type && newData !== null) {
					throw new Error(`${mName}: value of type ${typeof newData} is not supported`)
				}
				if (newData === this.data) return
				data = newData
				console.log(`atomValueSetter: ${this.key}|${newData}`)
				keys[this.key] = newData
				subscribers.forEach(handler => {
					handler(data)
				})
			},
			enumerable: false,
			configurable: false,
		})

		Object.defineProperty(this, 'watch', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: watcher => {
				if (typeof watcher !== 'function') {
					throw new Error(`${mName}: watch(): argument is not a 'function'`)
				}
				console.log(`watcherAdd: ${this.key}|${subscribers.length}`)
				subscribers.push(watcher)
			}
		})
	}

	Object.defineProperty(glob.app, 'Atom', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: Atom,
	})

	if (glob.app.Atom !== Atom) {
		throw new Error(`${mName}: unable to initialize property on global [app] object`)
	}

	Object.defineProperty(glob.app, 'atoms', {
		get() { return JSON.stringify(keys) },
	})

})(window, '<atom>');
