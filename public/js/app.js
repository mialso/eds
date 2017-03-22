;(function(glob, mName) {
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

	// app user event creator
	const actions = {
	}
  const actionWait = {
  }
	const data = {
	}
  const dataWait = {
  }
	const app = glob.app
	app.action = function (event, actionName) {
		console.log(`app action: ${actionName}`)
		actions[actionName].value = Date.now()
		const model = actionName.split('_')[0]
		if (data[model] !== undefined && event.target.value !== undefined) {
			data[model].value = event.target.value
		}
	}
	app.registerAction = function (name, action, payload) {
		console.log(`register action: ${name}`)
		if (actions[name] !== undefined) {
			throw new Error(`${mName}: registerAction(): invalid action '${name}': name allready taken`)
		}
		if (payload) {
			const atomName = name.split('_')[0]
			data[atomName] = new app.Atom(atomName, 'string')
      // get before registered watchers if action registered after watcher
      if (dataWait[atomName] && dataWait[atomName].length > 0) {
        dataWait[atomName].forEach((watcher) => {
          data[atomName].watch(watcher)
        })
        delete dataWait[atomName]
      }
		}
		actions[name] = new app.Atom(name, 'number')
		if (action) actions[name].actionWatch(action)
    if (actionWait[name] && actionWait[name].length > 0) {
      actionWait[name].forEach((watcher) => {
        actions[name].actionWatch(watcher)
      })
      delete actionWait[name]
    }
	}
	app.watchData = function (name, watcher) {
    // if action was not registered yet, wait for it
		if (data[name] === undefined) {
      if (dataWait[name] === undefined || !Array.isArray(dataWait[name])) {
        dataWait[name] = []
      }
      dataWait[name].push(watcher)
      return
			//throw new Error(`${mName}: watchData(): invalid name '${name}': no such data`)
		}
		data[name].watch(watcher)
	}
	app.watchAction = function (name, watcher) {
		if (actions[name] === undefined) {
      if (actionWait[name] === undefined || !Array.isArray(actionWait[name])) {
        actionWait[name] = []
      }
      actionWait[name].push(watcher)
      return
			//throw new Error(`${mName}: watchAction(): invalid name '${name}': no such action`)
		}
		actions[name].actionWatch(watcher)
	}
	app.actions = function() {
		console.log(Object.keys(actions))
	}
	glob.addEventListener('load', () => {
		glob.app.user.updateUser()
	})
  glob.addEventListener('DOMContentLoaded', function(e) {
    console.log('DOMContentLoaded')
  })
})(window, '<app>');
