'use strict'

const serve = require('koa-static')
const koa = require('koa')

const port = 5999

const app = koa()

app.use(serve('public'))

app.listen(port)
 
console.log(`app listens localhost:${port}`)
