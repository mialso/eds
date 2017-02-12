'use strict'

const serve = require('koa-static')
//const mount = require('koa-mount')
const fs = require('fs')
const koa = require('koa')

const port = 5999

const app = koa()

app.use(serve('public'))
const data = fs.readFileSync('public/index.html')

app.use(function * (next) {
	yield next
	if (this.url.split('.').length === 1) {
		this.body = data.toString()
	}
})

app.listen(port)
 
console.log(`app listens localhost:${port}`)
