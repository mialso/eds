;(function(glob, mName) {

  const app = glob.app
  if (!(app && app.project)) throw new Error(`${mName}: unable to run: no project global defined: ${app} && ${app.project}`)

  // data
  let projectsData = {
    'firstM': {
      name: 'name one M',
      description: 'desc one M',
    },
    'secondM': {
      name: 'name two M',
      description: 'desc two M',
    },
    'thirdM': {
      name: 'name three M',
      description: 'desc three M',
    },
    'firstJ': {
      name: 'name one J',
      description: 'desc one J',
    },
    'secondJ': {
      name: 'name two J',
      description: 'desc two J',
    },
    'thirdJ': {
      name: 'name three J',
      description: 'desc three J',
    },
  }

  function ProjectStore () {
    const watchers = {}
    const actionWatchers = {
      add: [],
      remove: [],
      change: [],
    }
    const data = {}
    Object.defineProperty(this, 'dataIds', {
      enumerable: false,
      configurable: false,
      get: function () {
        return Object.keys(data)
      },
      set: function() {
        throw new Error(`${mName}: unable to set dataIds`)
      }
    })
    this.getData = function () {
      return data
    }
    this.get = function (projectId) {
      // TODO this not immutable
      return data[projectId] || {}
    },
    this.add = function (project) {
      if (!project.id) {
        throw new Error(`${mName}: .add(): project should contain id string: ${project.id}`)
      }
      data[project.id] = {}
      Object.keys(project).forEach(key => {
        if ('id' === key) return
        switch (typeof project[key]) {
          case 'string':
          case 'number':
          case 'boolean':
            data[project.id][key] = project[key]
            console.log(`key = ${key}, data = ${project[key]}`)
            return
          case 'null':
            data[project.id][key] = null
            return
          default:
            throw new Error(`${mName}: add(): unable to add project with key: ${typeof project[key]}`)
        }
      })
      watchers[project.id] = {}
      actionWatchers.add.forEach(handler => {
        handler(project.id)
      })
    }
    this.update = function (project) {
      // TODO check for keys to be copyable, check for id to be present
      if (!data[project.id]) {
        throw new Error(`${mName}: update(): no such project in store: ${data[project.id]}`)
      }
      const projectDiff = {}
      const handlersDo = []
      Object.keys(project).forEach(projectKey => {
        if (projectKey === 'id') return
        if (project[projectKey] === data[project.id][projectKey]) return
        projectDiff[projectKey] = project[projectKey]
        data[project.id][projectKey] = project[projectKey]
        watchers[project.id][projectKey].forEach(handler => {
          if (handlersDo.indexOf(handler) !== -1) return
          handlersDo.push(handler)
        })
      })
      handlersDo.forEach(handler => {
        handler(projectDiff)
      })
    }
    this.remove = function (projectId) {
      delete data[projectId]
      delete watchers[projectId]
      actionWatchers.remove.forEach(handler => {
        handler(projectId)
      })
    }
    this.watch = function (project, handler) {
      if (!watchers[project.id]) {
        throw new Error(`${mName}: watch(): the watcher for ${project.id} is ${watchers[project.id]}`)
      }
      Object.keys(project).forEach(projectKey => {
        if ('id' === projectKey) return
          if (!watchers[project.id][projectKey]) {
            watchers[project.id][projectKey] = []
          }
          // TODO ? silent return???
          if (watchers[project.id][projectKey].indexOf(handler) !== -1) return
          watchers[project.id][projectKey].push(handler)
      })
    }
    this.watchAction = function (action, handler) {
      if (!actionWatchers[action]) {
        throw new Error(`${mName}: watchAction(): unable to watch ${action}`)
      }
      if (actionWatchers[action].indexOf(handler) !== -1) {
        throw new Error(`${mName}: watchAction(): handler exists`)
      }
      actionWatchers[action].push(handler)
    }
  }

  app.project.store = new ProjectStore()
  app.project.ProjectStore = ProjectStore
  Object.keys(projectsData).forEach(projectId => {
    const newProject = {id: projectId}
    Object.assign(newProject, projectsData[projectId])
    console.log(`add to store: ${JSON.stringify(newProject)}`)
    app.project.store.add(newProject)
  })
  
})(window, '<projectStore>');
