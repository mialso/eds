console.log(`router.js: location: ${window.location.pathname}`)

function showLogin() {
	console.log(`show login`)
	if (document.body.querySelector('.login')) return
	console.log(`recreate body`)
	document.body.innerHTML = `
	  <div class='login'>
			<input type='text' onchange='app.login(event)'/>
		</div>`
}

function showMain() {
	console.log(`show main`)
	if (document.body.querySelector('.main')) return
	document.body.innerHTML = "<div class='main'>created main</div>"
}


const app = {
	show: function(state) {
		switch (state) {
			case 'login': showLogin(); return
			case 'main': showMain(); return
			default: showError(); return
		}
	},
	login: function(ev) {
		console.log(`login: ${ev.target.value}`)
		switch (ev.target.value) {
			case 'Mik': localStorage.setItem('user', 'some'); return
			case 'Jim': localStorage.setItem('user', 'awesome'); return
			default: return
		}
	},
	server: {
		getUser: function(userToken) {
			switch (userToken) {
				case 'some': return { name: 'Mik' }
				case 'awesome': return { name: 'Jim' }
				default: return null
			}
		}
	}
}

const user = app.server.getUser(localStorage.getItem('user'))

if (!user) {
	app.show('login')
} else {
	app.show('main')
}



