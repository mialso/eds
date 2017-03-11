;(function(glob, mName) {
	'use strict'

	// check if global app is ready to use
	if (!glob || !glob.app || typeof glob.app !== 'object') {
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
			throw new Error(`${mName}: Atom(): key argument should be a string: ${typeof key}`)
		}
		// check key uniqueness
		if (Object.keys(keys).indexOf(key) !== -1) {
			throw new Error(`${mName}: Atom(): key argument should be unique: ${key}`)
		}

		Object.defineProperty(this, 'key', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: key,
		})

		let data = null 
    const subscribers = []
		const viewSubscribers = []
		const modelSubscribers = []
		const actionSubscribers = []

		Object.defineProperty(this, 'value', {
			get: function() { return data },
			set: function(newData) { 
				if (typeof newData !== this.type && newData !== null) {
					throw new Error(`${mName}: value of type ${typeof newData} is not supported by this atom`)
				}
				if (newData === data) return
				data = newData
				console.log(`atomValueSetter: ${this.key}|${newData}`)
				keys[this.key] = newData
        subscribers.forEach(handler => {
          handler(data)
        })
				modelSubscribers.forEach(handler => {
					// setTimeout(() => handler(data), 1000)
					handler(data)
				})
				viewSubscribers.forEach(handler => {
					// setTimeout(() => handler(data), 2000)
					handler(data)
				})
				actionSubscribers.forEach(handler => {
					// setTimeout(() => handler(data), 3000)
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
				subscribers.push(watcher)
				console.log(`watcherAdd: ${this.key}|${subscribers.length}`)
			}
		})

		Object.defineProperty(this, 'viewWatch', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: watcher => {
				if (typeof watcher !== 'function') {
					throw new Error(`${mName}: viewWatch(): argument is not a 'function'`)
				}
				viewSubscribers.push(watcher)
				console.log(`view watcherAdd: ${this.key}|${viewSubscribers.length}`)
			}
		})

		Object.defineProperty(this, 'modelWatch', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: watcher => {
				if (typeof watcher !== 'function') {
					throw new Error(`${mName}: modelWatch(): argument is not a 'function'`)
				}
				modelSubscribers.push(watcher)
				console.log(`model watcherAdd: ${this.key}|${modelSubscribers.length}`)
			}
		})

		Object.defineProperty(this, 'actionWatch', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: watcher => {
				if (typeof watcher !== 'function') {
					throw new Error(`${mName}: actionWatch(): argument is not a 'function'`)
				}
				actionSubscribers.push(watcher)
				console.log(`action watcherAdd: ${this.key}|${actionSubscribers.length}`)
			}
		})
		keys[this.key] = data
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
