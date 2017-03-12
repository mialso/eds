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
    this.html = {
      projectListUser: '',
    }
    this.ready = new app.Atom('mainView_ready', 'boolean')
    this.addItem = (child) => {
      this.html[child.id.split('_').shift()] = child.html
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
		glob.setTimeout(() => {
      document.body.innerHTML = 
			`
				${newMenuContent}
				<div class='${viewModel.main.clazz}'>
					<p>main view: this is main ${app.user.role.value} content</p>
          ${mainView.html.projectListUser}
				</div>
			`
    }, 0)
    let attempts = 0
    ;(function getMyEl() {
      ++attempts
      if (!document.querySelector('.main')) {
        glob.requestAnimationFrame(getMyEl)
      } else {
        // TODO provide elements to each child
        console.log('%o: %s', document.querySelector('.main'), attempts.toString())
      }
    })();

	})

})(window, '<main_view>');
