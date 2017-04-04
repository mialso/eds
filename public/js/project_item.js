;(function(glob, mName) {

  const app = glob.app

  // TODO rename to app.store.project
  const store = app.store.project
  app.view.components.ProjectItem = ProjectItem

  function ProjectItem (parent, id) {
    const item = {
      id: id,
      name: store.get(id).name || '',
      description: store.get(id).description || '',
    }
    this.id = `projectItem_${item.id}`
    const actions = {
      changeNameHTML: `app.action(event, "projectName${item.id}_change")`,
      saveHTML: `app.action(event, "projectStore${item.id}_save")`,
      editHTML: `app.action(event, "${this.id}_view")`,
      edit: () => { this.changeState('view') },
      viewHTML: `app.action(event, "${this.id}_edit")`,
      view: () => { this.changeState('edit') },
    }
    this.state = {
      default: 'view',
      view: {
        get name() { return `${item.name}` },
        get description() { return `${item.description}` },
        get buttons() {
          return `<button onclick='${actions.editHTML}'>Edit</button>`
        }
      },
      edit: {
        get name() {
          return `
            <input type="text" value="${item.name}" onchange='${actions.changeNameHTML}'/>`
        },
        get description() { return `${item.description}` },
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
    }
    this.getInnerHTML = function (stateName) {
      if (!stateName) stateName = this.state.default
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
    Object.defineProperty(this, 'domEl', {
      configurable: false,
      enumerable: false,
      get: function () { return this._domEl || null },
      set: function (newDomEl) {
        console.log('%s: my DOM el: %o', this.id, newDomEl)
        this._domEl = newDomEl
      }
    })
    this.updateData = function (project) {
      console.log(`${mName}: ProjectItem ${item.id}: updateData(): ${JSON.stringify(project)}`)
      if (project.name) item.name = project.name
      if (project.description) item.description = project.description
      this.changeState('view')
    }
    this.parent.ready.watch(parentReady => {
      if (parentReady) {
        this.parent.addItem({
          id: this.id,
          html: `
            <div class="projectItem" data-id="${this.id}">
              ${this.getInnerHTML()}
            </div>`,
        })
        store.watch({id:item.id, name: true, description: true}, this.updateData.bind(this))
        // internal actions
        app.registerAction(`${this.id}_edit`, actions.edit)
        app.registerAction(`${this.id}_view`, actions.view)
        // external actions
        app.registerAction(`projectStore${item.id}_save`, null, false)
        app.registerAction(`projectName${item.id}_change`, null, true)
      } else {
        // TODO: delete && clean up
        app.removeAction(`${this.id}_edit`)
        app.removeAction(`${this.id}_view`)
        app.removeAction(`projectStore${item.id}_save`)
        app.removeAction(`projectName${item.id}_change`)
        delete this._domEl
        store.unWatch(item.id)
        this.parentRemoveItem(this.id)
      }
    })
  }

})(window, '<projectItem>');
