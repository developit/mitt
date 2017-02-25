'use strict'

var mitt = require('./dist/mitt')
var ee = mitt()

ee
	.on('*', (type, arg) => console.log('wildcard:', type, arg))
	.on('foo', (one, c) => console.log('foo1:', one)) // => 1
	.on('foo', (one) => console.log('foo2:', one)) // => 1
	.on('bar', (arg) => console.log('bar:', arg)) // => 444
	.emit('foo', 1, 2, 3) // we not support multiple arguments
	.emit('bar', 444)

console.log(ee.all)

var emitter = mitt()

console.log(emitter.all) // => {}

emitter.emit('foo', 777)
