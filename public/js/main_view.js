;(function(glob, mName) {
	'use strict'

	if (!glob.app || typeof glob.app !== 'object') {
		throw new Error(`${mName}: global [app] is not defined or wrong type`)
	}

	const viewModel = {
		menu: {
			clazz: 'menu',
			children: {
				login: {
					type: 'button',
					action: {
						name: "menu_login_button_click",
						func: (event) => { console.log('mainView menu login action') },
					},
					content: 'Log out',
				},
			},
			attrs: {
			},
		},
		main: {
			clazz: 'main',
			children: {},
			attrs: {},
			content: 'this is main content'
		},
		footer: {
		}
	}
	const login_button = viewModel.menu.children.login

	glob.app.view.name.watch((newView) => {
		if ('main' === newView) {
			document.body.innerHTML = 
				`
					<div class="${viewModel.menu.clazz}">
						<p style="display: inline;">Hello, ${glob.app.user.name.value}</p>
						<button style="position: absolute; right: 0" onclick='app.action(event, "${login_button.action.name}")'>
							${login_button.content}
						</button>
					</div>
					<div class='${viewModel.main.clazz}'>
						<p>${viewModel.main.content}</p>
					</div>
				`
			return
		}
	})

	app.registerAction(login_button.action.name, login_button.action.func)
})(window, '<main_view>');
