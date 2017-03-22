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
      id: id,
      name: app.project.store.get(id).name || '',
      description: app.project.store.get(id).description || '',
    }
    this.id = `projectListReadItem_${id}`
    const actions = {
      changeNameHTML: `app.action(event, "projectName${item.id}_change")`,
      saveHTML: `app.action(event, "projectStore${item.id}_save")`,
      editHTML: `app.action(event, "${this.id}_view")`,
      edit: () => {
        console.log('projectListReadItem edit')
        this.changeState('view')
      },
      viewHTML: `app.action(event, "${this.id}_edit")`,
      view: () => {
        console.log('projectListReadItem view')
        this.changeState('edit')
      },
    }
    this.state = {
      current: '',
      view: {
        get name() {
          return `${item.name}`
        },
        get description() {
          return `${item.description}`
        },
        get buttons() {
          return `
              <button onclick='${actions.editHTML}'>Edit</button>`
        }
      },
      edit: {
        get name() {
          return `
            <input type="text" value="${item.name}" onchange='${actions.changeNameHTML}'/>`
        },
        get description() {
          return `
            <input type="text" value="${item.description}" />`
        },
        get buttons() {
          return `
            <button type="button" onclick='${actions.viewHTML}'>Cancel</button>
            <button type="button" onclick='${actions.saveHTML}'>Save</button>`
        }
      },
    }
    this.changeState = function (name) {
      console.log('change state %s: %o', name, this.domEl)
      this.domEl.innerHTML = this.getHTML(name)
      this.state.current = name
    }
    this.getHTML= function (stateName) {
      return `
        <div class="projectListReadItem">
          <div>
            ${this.state[stateName].name}
          </div>
          <div>
            ${this.state[stateName].description}
          </div>
          <div>
            ${this.state[stateName].buttons}
          </div>
        </div>`
    }
    this.parent = parent
    this.domEl = null
    this.updateData = function (project) {
      console.log(`${mName}: ProjectListReadItem ${id}: updateData(): ${JSON.stringify(project)}`)
      if (project.name) item.name = project.name
      if (project.description) item.description = project.description
      this.changeState('view')
    }
    this.receiveMyDomEl = function (domEl) {
      console.log('projectListReadItem: my DOM el: %o', domEl)
      this.domEl = domEl
      this.state.current = 'view'
    }
    app.project.store.watch(Object.assign({id:id}, item), this.updateData.bind(this))
    parent.ready.watch(parentReady => {
      if (parentReady) {
        parent.addItem({
          id: this.id,
          html: this.getHTML('view'),
        })
        this.parent.watchEl(`projectListReadItem_${id}`, this.receiveMyDomEl.bind(this))
        app.registerAction(`${this.id}_edit`, actions.edit)
        app.registerAction(`${this.id}_view`, actions.view)
        app.registerAction(`projectStore${item.id}_save`, null, false)
        app.registerAction(`projectName${item.id}_change`, null, true)
      } else {
        // delete this object?
      }
    })
  }
  function ProjectListEditItem (parent) {
  }

})(window, '<projects>');
