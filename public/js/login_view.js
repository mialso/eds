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
			content: ''
		},
		footer: {
		},
		loginForm: {
			clazz: 'loginForm',
			action: {
				showSignin: {
					name: "userLoginTokenValid",
					func: () => {
						document.querySelector('.signInButton').disabled = false
					}
				},
				signin: {
					name: "userLogin",
					func: (event) => {
						console.log('login form signin button click')
					},
				},
				cancel: {
					name: "loginForm_hide",
					func: (event) => {
						console.log('login form cancel')
						document.querySelector('.modal').classList.remove('in')
					},
				},
				inputChange: {
					name: "userLoginTokenInput_change",
					func: (event) => {
						console.log('login form input change')
					},
				},
				inputInput: {
					name: "userLoginInput_disableButton",
					func: (event) => {
						document.querySelector('.signInButton').disabled = true
					},
				},
			},
			children: {},
			attrs: {},
			content: ''
		},
	}
	const loginForm = viewModel.loginForm

	app.view.menu.content.viewWatch((newMenuContent) => {
		if (app.user.role.value !== 'guest') return
		document.body.innerHTML = 
			`
				${newMenuContent}
				<div class='${viewModel.main.clazz}'>
					<p>login view: this is main ${app.user.role.value} content</p>
				</div>
				<div class='modal'>
					<div class='${loginForm.clazz}'>
						<div>
							<label>Token</label>
							<input
								type="text"
								onchange='app.action(event, "${loginForm.action.inputChange.name}")'
								oninput='app.action(event, "${loginForm.action.inputInput.name}")'
							/>
						</div>
						<button class='signInButton' disabled type="button" onclick='app.action(event, "${loginForm.action.signin.name}")'>Sign in</button>
						<button type="button" onclick='app.action(event, "${loginForm.action.cancel.name}")'>Cancel</button>
					</div>
				</div>`
	})

	app.registerAction('userLoginTokenValid', loginForm.action.showSignin.func)
	app.registerAction(loginForm.action.signin.name, loginForm.action.signin.func)
	app.registerAction(loginForm.action.cancel.name, loginForm.action.cancel.func)
	app.registerAction(loginForm.action.inputChange.name, loginForm.action.inputChange.func, true)
	app.registerAction(loginForm.action.inputInput.name, loginForm.action.inputInput.func)
})(window, '<main_view>');
