import mitt, { EventHandlerList, EventHandlerMap } from '..';

const events = mitt();
function foo() {}
events.on('foo', foo);
events.emit('foo', 'hello');

// handler return type should be ignored:
events.on('foo', async e => e * 42);

// event map type
const map = new Map<string, EventHandlerList>([
	['foo', [foo]]
]);
const events2 = mitt(map);
events2.emit('foo', 'hello');

// event map type & iterables
const map2 : EventHandlerMap = new Map(Object.entries(({ foo: [foo] })));
mitt(map2);
