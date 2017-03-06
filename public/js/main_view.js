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

	app.view.menu.content.viewWatch((newMenuContent) => {
		if (app.user.role.value === 'guest') return
		document.body.innerHTML = 
			`
				${newMenuContent}
				<div class='${viewModel.main.clazz}'>
					<p>main view: this is main ${app.user.role.value} content</p>
				</div>
			`
	})

})(window, '<main_view>');
