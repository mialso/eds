import test from 'ava'
import fs from 'fs'
import path from 'path'
import sinon from 'sinon'

global.window = { app: {} }
const atom = require('../public/js/atom.js')
let atomCode

test.before(t => {
	atomCode = fs.readFileSync(path.resolve('public/js/atom.js')).toString()
})

test('Atom load: window.app object: app.Atom',
	t => {
		const window = { app: {} }
		eval(atomCode)
		t.is(typeof window.app.Atom, 'function')
	}
)
test('Atom load: no window: throw error',
	t => {
		let error = null
		const window = undefined
		try {
			eval(atomCode)
		} catch (err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom load: no window.app: throw error',
	t => {
		let error = null
		const window = {}
		try {
			eval(atomCode)
		} catch (err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom load: window.app is not object: throw error',
	t => {
		let error = null
		const window = { app: 'string'}
		try {
			eval(atomCode)
		} catch (err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom load: window.app.Atom is not configurable: throw error',
	t => {
		let error = null
		const window = {app: {}}
		Object.defineProperty(window.app, 'Atom', {
			configurable: false,
		})
		try {
			eval(atomCode)
		} catch (err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom constructor: key and type: new object',
	t => {
		const atom = new window.app.Atom('testName', 'string')
		t.is(atom instanceof window.app.Atom, true)
		const valueDescriptor = Object.getOwnPropertyDescriptor(atom, 'value')
		t.is(typeof valueDescriptor.get, 'function')
		t.is(typeof valueDescriptor.set, 'function')
		t.is(valueDescriptor.configurable, false)
		t.is(valueDescriptor.enumerable, false)
		const watchDescriptor = Object.getOwnPropertyDescriptor(atom, 'watch')
		t.is(typeof atom.watch, 'function')
		t.is(watchDescriptor.configurable, false)
		t.is(valueDescriptor.enumerable, false)
	}
)
test('Atom constructor: no new keyword: throw error',
	t => {
		let error = null
		try {
			const atom = window.app.Atom('testName', 'string')
		} catch(err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom constructor: invalid key: throw error',
	t => {
		let error = null
		try {
			const atom = new window.app.Atom(8, 'string')
		} catch(err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom constructor: invalid type: throw error',
	t => {
		let error = null
		try {
			const atom = new window.app.Atom('test_key', {data: 'string'})
		} catch(err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom: new value: call watcher',
	t => {
		const atom = new window.app.Atom('test_key', 'string')
		const spy = sinon.spy()
		atom.watch(spy)
		atom.value = 'new_value'
		t.is(spy.called, true)
		t.is(spy.callCount, 1)
		t.is(spy.calledWithExactly('new_value'), true)
		t.is(atom.value, 'new_value')
	}
)
test('Atom: watcher is not a function: throw error',
	t => {
		const atom = new window.app.Atom('test_key', 'boolean')
		let error = null
		try {
			atom.watch('some_string')
		} catch(err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom: the same value: no watcher call',
	t => {
		const atom = new window.app.Atom('test_key2', 'number')
		const spy = sinon.spy()
		atom.value = 11
		atom.watch(spy)
		atom.value = 11
		t.is(spy.called, false)
	}
)
test('Atom: the null value: null value',
	t => {
		const atom = new window.app.Atom('test_key', 'string')
		const spy = sinon.spy()
		atom.watch(spy)
		atom.value = 'test_string'
		t.is(atom.value, 'test_string')
		atom.value = null
		t.is(atom.value, null)
		t.is(spy.called, true)
		t.is(spy.callCount, 2)
		t.is(spy.calledWithExactly(null), true)
	}
)
test('Atom: other type value: throw error',
	t => {
		const atom = new window.app.Atom('test_key', 'string')
		let error = null
		try {
			atom.value = 8
		} catch(err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('atoms helper: : keys',
	t => {
		const window = { app: {}}
		eval(atomCode)
		const atom = new window.app.Atom('x', 'string')
		atom.value = 'test_string'
		const atom2 = new window.app.Atom('xx', 'boolean')
		atom2.value = true
		t.is(window.app.atoms, JSON.stringify({x: 'test_string', xx: true}))
	}
)
test.todo('unique keys')
