;(function(glob, mName) {

  const app = glob.app
  app.project = new Project()
  // data
  let projectsData = {
    'Mik': ['firstM', 'secondM', 'thirdM'],
    'Jim': ['firstJ', 'secondJ', 'thirdJ'],
  }
  // watchers TODO app.user.store.watch({projectIds}, handler)
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
    this.userProjects = []  // the main question: to hold array of id's or whole data object
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
        this.userProjects = []
      } else {
        this.userProjects = newProjectData
      }
      actions.change.forEach(handler => {
        handler(this.userProjects)
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
      watcherAr: [],
      htmlAr: [],
    }
    this.noItems = '<div class="projectListUser">project list: no items to display<div>'
    this.ready = new app.Atom('project_projectListUser_ready', 'boolean')
    this.init = function () {
      this.ready.value = true
      this.parent.addItem({
        id: `projectListUser_${app.user.name}`,
        html: `
          <div class="projectListUser">
            ${this.items.htmlAr.length > 0 ? this.items.htmlAr.join('') : this.noItems}
          </div>`
      })
      this.parent.watchEl('projectListUser', this.receiveMyDomEl.bind(this))
    }
    this.receiveMyDomEl = function (domEl) {
      console.log('projectListUser: my DOM el: %o', domEl)
      this.domEl = domEl
      for (let i = 0; i < domEl.childElementCount; ++i) {
        if (!this.items.watcherAr[i]) {
          throw new Error(`${mName}: projectListUser: no watcher for child ${i}`)
        }
        this.items.watcherAr[i](domEl.children[i])
      }
    }
    this.watchEl = function(childId, handler) {
      if (-1 === this.dataIds.indexOf(childId.split('_').pop())) return
      const index = this.dataIds.indexOf(childId.split('_').pop())
      this.items.watcherAr[index] = handler
    },
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
      if (-1 === this.dataIds.indexOf(item.id.split('_').pop())) return
      const index = this.dataIds.indexOf(item.id.split('_').pop())
      this.items.htmlAr[index] = item.html
      console.log(`${mName}: ProjectListUser: add item: ${item.id} to index: ${index}`)
    }
    this.initChildren = function () {
      if (!(this.dataIds && Array.isArray(this.dataIds))) {
        throw new Error(`${mName}: initChildren(): no dataIds: ${this.dataIds}`)
      }
      this.dataIds.forEach((id) => {
        if (this.items[id]) return
        this.items[id] = new ProjectListReadItem(this, id)
      })
    }
    if (app.project.userProjects.length > 0) {
      this.dataIds = app.project.userProjects
      this.initChildren()
    }
  }
  function ProjectListReadItem (parent, id) {
    const item = {
      name: app.project.store.get(id).name || '',
      description: app.project.store.get(id).description || '',
    }
    this.actions = {
      edit: () => {
        console.log('projectListReadItem edit')
      },
      view: () => {
        console.log('projectListReadItem view')
      },
    }
    this.id = `projectListReadItem_${id}`
    this.state = {
      actions: {
        edit: `app.action("${this.id}_edit")`,
        view: `app.action("${this.id}_edit")`,
      },
      view: {
        html: `
            <div class="projectListReadItem">
              <div>
                ${item.name}
              </div>
              <div>
                ${item.description}
              </div>
              <button onclick='${this.state.actions.edit}'>Edit</button>
            </div>`,
      },
      edit: {
        html: `
            <div class="projectListReadItem">
              <div>
                ${item.name}
              </div>
              <div>
                ${item.description}
              </div>
              <button onclick='${this.state.actions.edit}'>Edit</button>
            </div>`,
      },
    }
    this.parent = parent
    this.domEl = null
    this.updateData = function (project) {
      console.log(`${mName}: ProjectListReadItem ${id}: updateData(): ${JSON.stringify(project)}`)
      item.name = project.name
      item.description = project.description
    }
    this.receiveMyDomEl = function (domEl) {
      console.log('projectListReadItem: my DOM el: %o', domEl)
      this.domEl = domEl
    }
    app.project.store.watch(Object.assign({id:id}, item), this.updateData)
    parent.ready.watch(parentReady => {
      if (parentReady) {
        parent.addItem({
          id: this.id,
          html: this.state.view.html
        })
        this.parent.watchEl(`projectListReadItem_${id}`, this.receiveMyDomEl.bind(this))
        app.registerAction(`${this.id}_edit`, this.actions.edit)
        app.registerAction(`${this.id}_view`, this.actions.view)
      } else {
        // delete this object?
      }
    })
  }
  function ProjectListEditItem (parent) {
  }

})(window, '<projects>');
