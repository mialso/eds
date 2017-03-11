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
    app.project.data = projectsData[userName]
    console.log(`PPPPPPPPPPP: ${app.project.data}`)
  })

  const actions = {
    add: [],
    remove: [],
    update: [],
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
    this.update = (updatedProjectData) => {
      console.log(`${mName}: update: ${updatedProjectData}`)
      actions.update.forEach(handler => {
        handler(updatedProjectData)
      })
    }
    this.watch = (watcher, action) => {
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
  function ProjectListUser (parent, data) {
    this.dataIds = projectsData[app.user.name] ? projectsData[app.user.name] : []
    this.items = {
      htmlAr: []
    }
    this.noItems = '<div class="projectListUser">project list: no items to display<div>'
    this.ready = new app.Atom('project_projectListUser_ready', 'boolean')
    parent.ready.watch((parentReady) => {
      if (parentReady) {
        this.ready.value = true
        parent.addItem({
          id: `projectListUser_${app.user.name}`,
          html: `
            <div class="projectListUser">
              ${this.items.htmlAr.length > 0 ? this.items.htmlAr.join('') : this.noItems}
            </div>`
        })
      } else {
        this.ready.value = false
      }
    })
    this.addItem = (item) => {
      const index = dataIds.indexOf(item.id.split('_').pop())
      htmlAr[index] = item.html
      console.log(`${mName}: ProjectListUser: add item: ${item.id} to index: ${index}`)
    }
    this.dataIds.forEach((id) => {
      this.items[id] = new ProjectListReadItem(this, id)
    })
  }
  function ProjectListReadItem (parent, id) {
    parent.ready.watch(parentReady => {
      if (parentReady) {
        parent.addItem({
          id: `projectListReadItem_${id}`,
          html: `
            <div class="projectListReadItem">
              <div>
                ${app.projects.data[id].name}
              </div>
              <div>
                ${app.projects.data[id].description}
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
