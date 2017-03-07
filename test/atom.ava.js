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
		const atom = new window.app.Atom('testConstructor', 'string')
		t.is(atom instanceof window.app.Atom, true)
		const valueDescriptor = Object.getOwnPropertyDescriptor(atom, 'value')
		t.is(typeof valueDescriptor.get, 'function')
		t.is(typeof valueDescriptor.set, 'function')
		t.is(valueDescriptor.configurable, false)
		t.is(valueDescriptor.enumerable, false)
		const modelWatchDescriptor = Object.getOwnPropertyDescriptor(atom, 'modelWatch')
		t.is(typeof atom.modelWatch, 'function')
		t.is(modelWatchDescriptor.configurable, false)
		t.is(valueDescriptor.enumerable, false)
	}
)
test('Atom constructor: no new keyword: throw error',
	t => {
		let error = null
		try {
			const atom = window.app.Atom('testNoNew', 'string')
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
			const atom = new window.app.Atom('testInvalidType', {data: 'string'})
		} catch(err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom: new value: call modelWatcher',
	t => {
		const atom = new window.app.Atom('testCallWatcher', 'string')
		const spy = sinon.spy()
		atom.modelWatch(spy)
		atom.value = 'new_value'
		t.is(spy.called, true)
		t.is(spy.callCount, 1)
		t.is(spy.calledWithExactly('new_value'), true)
		t.is(atom.value, 'new_value')
	}
)
test('Atom: modelWatcher is not a function: throw error',
	t => {
		const atom = new window.app.Atom('testWrongWatcher', 'boolean')
		let error = null
		try {
			atom.modelWatch('some_string')
		} catch(err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom: the same value: no modelWatcher call',
	t => {
		const atom = new window.app.Atom('testNoValueChange', 'number')
		const spy = sinon.spy()
		atom.value = 11
		atom.modelWatch(spy)
		atom.value = 11
		t.is(spy.called, false)
	}
)
test('Atom: the null value: null value',
	t => {
		const atom = new window.app.Atom('testNullValue', 'string')
		const spy = sinon.spy()
		atom.modelWatch(spy)
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
		const atom = new window.app.Atom('testOtherValueType', 'string')
		let error = null
		try {
			atom.value = 8
		} catch(err) {
			error = err
		}
		t.is(error instanceof Error, true)
	}
)
test('Atom: two simialar keys: throw error',
	t => {
		const atom1 = new window.app.Atom('testSimilarKeys', 'string')
		let error = null
		try {
			const atom2 = new window.app.Atom('testSimilarKeys', 'number')
		} catch(err) {
			error = err
		}
		t.truthy(error instanceof Error, 'should throw Error in case similar key added')
	}
)
test('atoms helper: : keys',
	t => {
		const atom = new window.app.Atom('helper1', 'string')
		atom.value = 'test_string'
		const atom2 = new window.app.Atom('helper2', 'boolean')
		atom2.value = true
		t.is(typeof window.app.atoms, 'string')
	}
)
