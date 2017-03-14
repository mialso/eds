;(function(glob, mName) {
	'use strict'

	if (!glob.app || typeof glob.app !== 'object') {
		throw new Error(`${mName}: global [app] is not defined or wrong type`)
	}

	const app = glob.app

	const viewModel = {
		main: {
			clazz: 'main',
			children: {},
			attrs: {},
			content: '',
		},
		footer: {
		}
	}
  function MainView () {
    this.children = ['', 'projectListUser']
    this.child = {
      projectListUser: {
        html: '',
        domEl: null,
        elWatcher: null,
      },
    }
    this.watchEl = function(childId, handler) {
      this.child[childId].elWatcher = handler
    }
    this.ready = new app.Atom('mainView_ready', 'boolean')
    this.addItem = (child) => {
      this.child[child.id.split('_').shift()].html = child.html
    }
  }
  const mainView = new MainView()
  const projList = new app.project.component.ProjectListUser(mainView)

	app.view.menu.content.viewWatch((newMenuContent) => {
		if (app.user.role.value === 'guest') {
      mainView.ready.value = false
      return
    }
    mainView.ready.value = true
    document.body.innerHTML = 
			`
				${newMenuContent}
				<div class='${viewModel.main.clazz}'>
					<p>main view: this is main ${app.user.role.value} content</p>
          ${mainView.child[mainView.children[1]].html}
				</div>
			`
    let attempts = 0
    ;(function getMyEl() {
      ++attempts
      const myDomEl = document.querySelector('.main')
      if (!myDomEl) {
        glob.requestAnimationFrame(getMyEl)
      } else {
        // TODO provide elements to each child
        console.log('%o: %s', myDomEl, attempts.toString())
        mainView.children.forEach((childName, index) => {
          if (!(mainView.child[childName] && mainView.child[childName].html)) {
            return
          }
          if (!mainView.child[childName].elWatcher) {
            throw new Error(`${mName}: no watcher specified for ${childname} child`)
          }
          if (myDomEl.childElementCount <= index) {
            throw new Error(`${mName}: child elements count is lower than current index: ${myDomEl.childElementCount},${index}`)
          }
          // invoke a watcher to provide element to child
          mainView.child[childName].elWatcher(myDomEl.children[index])
        })
      }
    })();

	})

})(window, '<main_view>');
