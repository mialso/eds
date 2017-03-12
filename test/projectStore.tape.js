const test = require('tape')
const sinon = require('sinon')

global.window = {app: {project: {}}}
const projectStore = require('../public/js/project_store.js')

test('ProjectStore: global window.app.project object: store & ProjectStore constructor',
  t => {
    t.equal(typeof window.app.project.store, 'object',
      'store object should be initialized')
    t.equal(typeof window.app.project.ProjectStore, 'function',
      'store constructor should be inititilized')
    t.end()
  }
)

test('ProjectStore: watch data, update data: handler called',
  t => {
    const testProj = {id: 'firstM', name: '', description: ''}
    const handlerSpy = sinon.spy()
    window.app.project.store.watch(testProj, handlerSpy)
    window.app.project.store.update({id: 'firstM', name: 'updatedName'})

    t.equal(handlerSpy.calledOnce, true,
      'handler should be called once')
    t.deepEqual(handlerSpy.getCall(0).args[0], {name: 'updatedName'},
      'handler should be called with updated data')
    t.end()
  }
)

test('ProjectStore: watch remove action, remove item: handler called',
  t => {
    const handlerSpy = sinon.spy()
    window.app.project.store.watchAction('remove', handlerSpy)
    window.app.project.store.remove('firstM')
    t.equal(handlerSpy.calledOnce, true,
      'handler should be called once')
    t.equal(handlerSpy.getCall(0).args[0], 'firstM',
      'removed item id should be provided to handler')
    t.end()
  }
)

test('ProjectStore: watch add action, add item: handler call',
  t => {
    const store = window.app.project.store
    const newProject = {
      id: 'addTestId',
      name: 'addTestName',
      description: 'addTestDescription',
    }
    const handlerSpy = sinon.spy()
    store.watchAction('add', handlerSpy)
    store.add(newProject) 
    t.equal(handlerSpy.calledOnce, true,
      'handler should be called once')
    t.equal(handlerSpy.getCall(0).args[0], 'addTestId',
      'added item id should be provided to handler')
    t.deepEqual(store.get('addTestId'), { name: newProject.name, description: newProject.description },
      'added item shoould be equal to new project')
    t.end()
  }
)
