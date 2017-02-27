;(function(glob, mName) {
	'use strict'

	if (!glob.app || typeof glob.app !== 'object') {
		throw new Error(`${mName}: global [app] is not defined or wrong type`)
	}
	const tmp = {
		userToken: ''
	}

	const viewModel = {
		menu: {
			clazz: 'menu',
			children: {
				login: {
					type: 'button',
					action: {
						name: "menu_login_button_click",
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
			clazz: 'main',
			children: {},
			attrs: {},
			content: 'this is main guest content'
		},
		footer: {
		},
		loginForm: {
			clazz: 'loginForm',
			action: {
				signin: {
					name: "login_form_sign_in",
					func: (event) => {
						console.log('login form signin button click')
						app.user.login(tmp.userToken)
					},
				},
				cancel: {
					name: "login_form_cancel",
					func: (event) => {
						console.log('login form cancel')
						document.querySelector('.modal').classList.remove('in')
					},
				},
				inputChange: {
					name: "login_form_input_change",
					func: (event) => {
						console.log('login form input change')
						tmp.userToken = event.target.value
					},
				},
			},
			children: {},
			attrs: {},
			content: ''
		},
	}
	const login_button = viewModel.menu.children.login
	const loginForm = viewModel.loginForm

	glob.app.view.name.watch((newView) => {
		if ('login' === newView) {
			document.body.innerHTML = 
				`
					<div class="${viewModel.menu.clazz}">
						<p style="display: inline;">Hello, guest</p>
						<button style="position: absolute; right: 0" onclick='app.action(event, "${login_button.action.name}")'>
							${login_button.content}
						</button>
					</div>
					<div class='${viewModel.main.clazz}'>
						<p>${viewModel.main.content}</p>
					</div>
					<div class='modal'>
						<div class='${loginForm.clazz}'>
							<div>
								<label>Token</label><input type="text" onchange='app.action(event, "${loginForm.action.inputChange.name}")'/>
							</div>
							<button type="button" onclick='app.action(event, "${loginForm.action.signin.name}")'>Sign in</button>
							<button type="button" onclick='app.action(event, "${loginForm.action.cancel.name}")'>Cancel</button>
						</div>
					</div>
				`
			return
		}
	})

	app.registerAction(login_button.action.name, login_button.action.func)
	app.registerAction(loginForm.action.signin.name, loginForm.action.signin.func)
	app.registerAction(loginForm.action.cancel.name, loginForm.action.cancel.func)
	app.registerAction(loginForm.action.inputChange.name, loginForm.action.inputChange.func)
})(window, '<main_view>');
