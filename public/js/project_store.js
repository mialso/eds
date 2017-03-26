;(function(glob, mName) {

  const app = glob.app
  if (!(app)) throw new Error(`${mName}: unable to run: no app global defined: ${app}`)

  // TODO create global store with common functionality
  app.store = {}
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
  let usersData = {
    'Mik': ['firstM', 'secondM', 'thirdM'],
    'Jim': ['firstJ', 'secondJ', 'thirdJ'],
  }

  function ProjectStore () {
    const watchers = {}
    /*
    const actionWatchers = {
      // TODO add && remove: item does not care about this stuff, only change
      add: [],
      remove: [],
      change: [],
    }
    */
    const data = {}
    const tmpData = {}
    this.getData = function () {
      return data
    }
    this.get = function (projectId) {
      // TODO this is not immutable
      return Object.assign({}, data[projectId] || {})
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
      /*
      actionWatchers.add.forEach(handler => {
        handler(project.id)
      })
      */
    }
    this.tmpChange = function (project) {
      if (!(project && project.id)) {
        throw new Error(`${mName}: tmpChange(): no project or id provided: ${JSON.stringify(project)}`)
      }
      if (!data[project.id]) {
        throw new Error(`${mName}: tmpChange(): no such project in store: ${data[project.id]}`)
      }
      tmpData[project.id] = {}
      Object.keys(project).forEach(key => {
        tmpData[project.id][key] = project[key]
      })
    }
    this.getTmpData = function (projectId) {
      return tmpData[projectId]
    }
    this.update = function (project, fromTmpData) {
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
      /*
      actionWatchers.remove.forEach(handler => {
        handler(projectId)
      })
      */
    }
    this.watch = function (project, handler) {
      if (!watchers[project.id]) {
        throw new Error(`${mName}: watch(): the watcher for ${project.id} is absent: ${watchers[project.id]}`)
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
    /*
    this.watchAction = function (action, handler) {
      if (!actionWatchers[action]) {
        throw new Error(`${mName}: watchAction(): unable to watch ${action}`)
      }
      if (actionWatchers[action].indexOf(handler) !== -1) {
        throw new Error(`${mName}: watchAction(): handler exists`)
      }
      actionWatchers[action].push(handler)
    }
    */
    this.select = function (selectorName, addHandler, removeHandler) {
      addHandler(usersData['Mik'])
    }
  }

  app.store.project = new ProjectStore()
  app.store.ProjectStore = ProjectStore
  Object.keys(projectsData).forEach(projectId => {
    const newProject = {id: projectId}
    Object.assign(newProject, projectsData[projectId])
    console.log(`add to store: ${JSON.stringify(newProject)}`)
    app.store.project.add(newProject)
    app.watchData(`projectName${projectId}`, getChangeProjectName(projectId))
    app.watchAction(`projectStore${projectId}_save`, getSaveProject(projectId))
  })
  function getSaveProject (projectId) {
    return () => {
      console.log(`${mName}: saveProject: ${projectId}`)
      const dataToUpdate = app.store.project.getTmpData(projectId)
      if (!dataToUpdate) {
        throw new Error(`${mName}: saveProject(): no project in tmpData: ${projectId}`)
      }
      app.store.project.update(dataToUpdate)
    }
  }
  function getChangeProjectName (projectId) {
    return (newName) => {
      console.log(`${mName}: changeProjectName: ${projectId}:${newName}`)
      app.store.project.tmpChange({id: projectId, name: newName})
    }
  }
  
})(window, '<projectStore>');
