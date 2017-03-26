;(function(glob, mName) {

  const app = glob.app

  const store = app.store.project
  app.view.components.ProjectListUser = ProjectListUser
  const ProjectItem = app.view.components.ProjectItem

  function ProjectListUser (parent) {
    this.dataIds = []
    this.parent = parent
    this.items = {
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
        const id = domEl.children[i].dataset.projectid
        if (!this.items[id]) {
          throw new Error(`${mName}: projectListUser: no item for child ${id}`)
        }
        //console.log('XXXXXX: %o', domEl.children[i])
        this.items[id].domEl = domEl.children[i].children[0]
      }
    }
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
        `<div class="ProjectListItem" data-projectid="${projectId}">
          ${item.html}
          <div class="ProjectListItemMenu">
            <button>Remove ${projectId}</button>
          </div>
        </div>`
      console.log(`${mName}: ProjectListUser: add item: ${item.id} to index: ${index}`)
    }
    store.select('currentUserIds', this.add.bind(this), this.remove.bind(this))
  }

})(window, '<projectList>');
