;(function(glob, mname) {

	'use strict'

	if (!glob.app || typeof glob.app !== 'object') {
		throw new Error(`${mName}: global [app] is not defined or wrong type`)
	}

	const app = glob.app

	const viewModel = {
		login: {
			clazz: 'menu',
			children: {
				loginButton: {
					type: 'button',
					action: {
						name: "loginForm_show",
						func: (event) => {
							console.log('menu login action')
							document.querySelector('.modal').classList.add('in')
						},
					},
					content: 'Log in',
				},
			},
			attrs: {
			},
		},
		main: {
			clazz: 'menu',
			children: {
				logoutButton: {
					type: 'button',
					action: {
						name: "menu_logoutButton_click",
						func: event => app.user.logout(),
					},
					content: 'Log out',
				},
			},
			attrs: {
			},
		},
	}

	const menuView = {}
	Object.defineProperty(menuView, 'content', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: new app.Atom('view_menu', 'string')
	})
	app.view.menu = menuView

	const loginButton = viewModel.login.children.loginButton
	app.registerAction(loginButton.action.name, loginButton.action.func)
	const logoutButton = viewModel.main.children.logoutButton
	app.registerAction(logoutButton.action.name, logoutButton.action.func)

	app.user.role.viewWatch((name) => {
		switch (name) {
			case 'teacher':
			case 'student':
				menuView.content.value = `
					<div class="${viewModel.main.clazz}">
						<p style="display: inline;">Hello, ${app.user.name.value}</p>
						<button style="position: absolute; right: 0" onclick='app.action(event, "${logoutButton.action.name}")'>
							${logoutButton.content}
						</button>
					</div>`
				break
			case 'guest':
				menuView.content.value = `
					<div class="${viewModel.login.clazz}">
						<p style="display: inline;">Hello, ${app.user.name.value}</p>
						<button style="position: absolute; right: 0" onclick='app.action(event, "${loginButton.action.name}")'>
							${loginButton.content}
						</button>
					</div>`
			default: break
		}
	})
})(window, '<menu>');
