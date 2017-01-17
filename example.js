'use strict'

var mitt = require('./dist/mitt')
var ee = mitt()

ee
  .on('*', (type, arg) => console.log('wildcard:', type, arg))
  .on('foo', (one, two, three) => console.log('foo1:', one, two, three))
  .on('foo', (one, two, three) => console.log('foo2:', one, two, three))
  .on('bar', (arg) => console.log('bar:', arg))
  .emit('foo', 1, 2, 3)
  .emit('bar', 444)

console.log(ee.all)

var emitter = mitt()

console.log(emitter.all) // => {}

emitter.emit('foo', 777)
