;(function(glob, mName) {

  const app = glob.app

  // TODO rename to app.store.project
  const store = app.store.project
  app.view.components.ProjectListUser = ProjectListUser

  // view, components
  function ProjectListUser (parent) {
    this.dataIds = []
    this.parent = parent
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
        //console.log('XXXXXX: %o', domEl.children[i])
        this.items.watcherAr[i](domEl.children[i].children[0])
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
    this.add = function (newDataIds) {
      newDataIds.forEach((id) => {
        this.dataIds.push(id)
        this.items[id] = new ProjectItem(this, id)
      })
    }
    this.remove = function (dataIds) {
      dataIds.forEach((id) => {
        const index = this.dataIds.indexOf(id)
        if (-1 === index) return
        this.dataIds.splice(index, 1) 
        // TODO remove component
      })
    }
    this.addItem = function (item) {
      const projectId = item.id.split('_').pop()
      const index = this.dataIds.indexOf(projectId)
      if (-1 === index) return
      this.items.htmlAr[index] = 
        `<div class="ProjectListItem">
          ${item.html}
          <div class="ProjectListItemMenu">
            <button>Remove ${projectId}</button>
          </div>
        </div>`
      console.log(`${mName}: ProjectListUser: add item: ${item.id} to index: ${index}`)
    }
    store.select('currentUserIds', this.add.bind(this), this.remove.bind(this))
  }

  function ProjectItem (parent, id) {
    const item = {
      id: id,
      name: app.store.project.get(id).name || '',
      description: app.store.project.get(id).description || '',
    }
    this.id = `projectItem_${item.id}`
    const actions = {
      changeNameHTML: `app.action(event, "projectName${item.id}_change")`,
      saveHTML: `app.action(event, "projectStore${item.id}_save")`,
      editHTML: `app.action(event, "${this.id}_view")`,
      edit: () => {
        console.log('projectItem edit')
        this.changeState('view')
      },
      viewHTML: `app.action(event, "${this.id}_edit")`,
      view: () => {
        console.log('projectItem view')
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
          return `${item.description}`
          /*
          return `
            <input type="text" value="${item.description}" />`
            */
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
      this.domEl.innerHTML = this.getInnerHTML(name)
      this.state.current = name
    }
    this.getHTML= function (stateName) {
      return `
        <div class="projectItem">
          ${this.getInnerHTML(stateName)}
        </div>`
    }
    this.getInnerHTML = function (stateName) {
      return `
        <div>
          ${this.state[stateName].name}
        </div>
        <div>
          ${this.state[stateName].description}
        </div>
        <div>
          ${this.state[stateName].buttons}
        </div>`
    }
    this.parent = parent
    this.domEl = null
    this.updateData = function (project) {
      console.log(`${mName}: ProjectItem ${item.id}: updateData(): ${JSON.stringify(project)}`)
      if (project.name) item.name = project.name
      if (project.description) item.description = project.description
      this.changeState('view')
    }
    this.receiveMyDomEl = function (domEl) {
      console.log('%s: my DOM el: %o', this.id, domEl)
      this.domEl = domEl
      this.state.current = 'view'
    }
    app.store.project.watch(Object.assign({id:item.id}, item), this.updateData.bind(this))
    this.parent.ready.watch(parentReady => {
      if (parentReady) {
        this.parent.addItem({
          id: this.id,
          html: this.getHTML('view'),
        })
        this.parent.watchEl(`projectItem_${id}`, this.receiveMyDomEl.bind(this))
        app.registerAction(`${this.id}_edit`, actions.edit)
        app.registerAction(`${this.id}_view`, actions.view)
        app.registerAction(`projectStore${item.id}_save`, null, false)
        app.registerAction(`projectName${item.id}_change`, null, true)
      } else {
        // delete this object?
      }
    })
  }

})(window, '<projects>');
