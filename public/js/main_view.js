;(function(glob, mName) {
	'use strict'

	if (!glob.app || typeof glob.app !== 'object') {
		throw new Error(`${mName}: global [app] is not defined or wrong type`)
	}

	const viewModel = {
		menu: {
			clazz: 'menu',
			children: {
				logout: {
					type: 'button',
					action: {
						name: "menu_logout_button_click",
						func: event => glob.app.user.logout(),
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
			content: '',
		},
		footer: {
		}
	}
	const logout_button = viewModel.menu.children.logout

	glob.app.view.name.watch((newView) => {
		if ('main' === newView) {
			document.body.innerHTML = 
				`
					<div class="${viewModel.menu.clazz}">
						<p style="display: inline;">Hello, ${glob.app.user.name.value}</p>
						<button style="position: absolute; right: 0" onclick='app.action(event, "${logout_button.action.name}")'>
							${logout_button.content}
						</button>
					</div>
					<div class='${viewModel.main.clazz}'>
						<p>this is main ${glob.app.user.role.value} content</p>
					</div>
				`
			return
		}
	})

	app.registerAction(logout_button.action.name, logout_button.action.func)
})(window, '<main_view>');
