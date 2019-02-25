import mitt from 'mitt'

type TypesMap = {
	foo: string,
	bar: { a: number },
	xyz: undefined
}

const m = mitt<TypesMap>()

// $ExpectType void
m.emit('foo', 'test')
// $ExpectError
m.emit('foo', 42)
// $ExpectError
m.emit('foo');

m.emit('bar', { a: 42 })
// $ExpectError
m.emit('bar', { a: '42' })
// $ExpectError
m.emit('bar');

// $ExpectType void
m.emit('xyz')
// $ExpectError
m.emit('xyz', 'test');

m.on('foo', data => {
	data // $ExpectType string
})
m.on('foo', () => {});

m.on('bar', data => {
	data // $ExpectType { a: number; }
})

m.on('xyz', data => {
	data // $ExpectType undefined
});


const acceptsString = (s: string) => {}
const acceptsNumber = (n: number) => {}
const acceptsNoArg = () => {}

m.off('foo', acceptsString)
m.off('foo', acceptsNoArg)
// $ExpectError
m.off('foo', acceptsNumber)
// $ExpectError
m.off("foo")
