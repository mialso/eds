;(function(glob, mName) {

  const app = glob.app
  app.project = new Project()
  // data
  let projectsData = {
    'Mik': ['firstM', 'secondM', 'thirdM'],
    'Jim': ['firstJ', 'secondJ', 'thirdJ'],
    projects: {
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
    },
  }

  // watchers
  app.user.name.watch((userName) => {
    // get projects avaliable for current user
    console.log(`PPPPPPPPPPP: ${userName}`)
    //app.project.data = projectsData[userName]
    app.project.change(projectsData[userName])
    console.log(`PPPPPPPPPPP: ${app.project.data}`)
  })

  const actions = {
    add: [],
    remove: [],
    move: [],
    change: [],
  }

  // model
  function Project () {
    this.data = []  // the main question: to hold array of id's or whole data object
    this.add = (newProject) => {
      console.log(`${mName}: add: ${newProject}`)
      actions.add.forEach(handler => {
        handler(newProject)
      })
    }
    this.remove = (projectId) => {
      console.log(`${mName}: remove: ${projectId}`)
      actions.remove.forEach(handler => {
        handler(projectId)
      })
    }
    this.move = (updatedProjectData) => {
      console.log(`${mName}: update: ${updatedProjectData}`)
      actions.move.forEach(handler => {
        handler(updatedProjectData)
      })
    }
    this.change = (newProjectData) => {
      console.log(`${mName}: new: ${newProjectData}`)
      if (!newProjectData) {
        this.data = []
      } else {
        this.data = newProjectData
      }
      actions.change.forEach(handler => {
        handler(this.data)
      })
    }
    this.watch = (action, watcher) => {
      if (Object.keys(actions).indexOf(action) === -1) {
        throw new Error(`${mName}: watch(): unavailable action: ${action}`)
      }
      actions[action].push(watcher)
    }
    this.component = {
      ProjectListUser: ProjectListUser,
    }
  }

  // view, components
  function ProjectListUser (parent) {
    this.parent = parent
    this.dataIds = []
    this.items = {
      htmlAr: []
    }
    this.noItems = '<div class="projectListUser">project list: no items to display<div>'
    this.ready = new app.Atom('project_projectListUser_ready', 'boolean')
    this.init = function () {
      // this.initChildren()
      this.ready.value = true
      this.parent.addItem({
        id: `projectListUser_${app.user.name}`,
        html: `
          <div class="projectListUser">
            ${this.items.htmlAr.length > 0 ? this.items.htmlAr.join('') : this.noItems}
          </div>`
      })
    }
    parent.ready.watch((parentReady) => {
      if (parentReady) {
        this.init()
      } else {
        this.ready.value = false
      }
    })
    app.project.watch('change', (newData) => {
      this.dataIds = newData
      this.initChildren()
    })
    this.addItem = function (item) {
      const index = this.dataIds.indexOf(item.id.split('_').pop())
      this.items.htmlAr[index] = item.html
      console.log(`${mName}: ProjectListUser: add item: ${item.id} to index: ${index}`)
    }
    this.initChildren = function () {
      // this.dataIds = app.project.data
      if (!(this.dataIds && Array.isArray(this.dataIds))) {
        throw new Error(`${mName}: initChildren(): no dataIds: ${this.dataIds}`)
      }
      this.dataIds.forEach((id) => {
        this.items[id] = new ProjectListReadItem(this, id)
      })
    }
    if (app.project.data.length > 0) {
      this.dataIds = app.project.data
      this.initChildren()
    }
  }
  function ProjectListReadItem (parent, id) {
    parent.ready.watch(parentReady => {
      if (parentReady) {
        parent.addItem({
          id: `projectListReadItem_${id}`,
          html: `
            <div class="projectListReadItem">
              <div>
                ${projectsData.projects[id].name}
              </div>
              <div>
                ${projectsData.projects[id].description}
              </div>
            </div>`
        })
      } else {
        // delete this object?
      }
    })
  }
  function ProjectListEditItem (parent) {
  }

})(window, '<projects>');
