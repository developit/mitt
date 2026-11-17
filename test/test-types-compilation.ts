/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */

import mitt from '..';

interface SomeEventData {
	name: string;
}

const emitter = mitt<{
	foo: string;
	someEvent: SomeEventData;
	bar?: number;
}>();

const barHandler = (x?: number) => {};
const fooHandler = (x: string) => {};
const wildcardHandler = (
	_type: 'foo' | 'bar' | 'someEvent',
	_event: string | SomeEventData | number | undefined
) => {};

/*
 * Check that event maps declared as interfaces work too (#209).
 * Interfaces have no implicit index signature, so they did not satisfy
 * the old `Record<EventType, unknown>` constraint.
 */
interface InterfaceEvents {
	foo: string;
	bar?: number;
}

const interfaceEmitter = mitt<InterfaceEvents>();
interfaceEmitter.on('foo', fooHandler);
interfaceEmitter.emit('foo', 'string');
interfaceEmitter.emit('bar', 1);
// @ts-expect-error
interfaceEmitter.emit('foo', 1);

/*
 * Check that 'on' args are inferred correctly
 */
{
	// @ts-expect-error
	emitter.on('foo', barHandler);
	emitter.on('foo', fooHandler);

	emitter.on('bar', barHandler);
	// @ts-expect-error
	emitter.on('bar', fooHandler);

	emitter.on('*', wildcardHandler);
	// fooHandler is ok, because ('foo' | 'bar' | 'someEvent') extends string
	emitter.on('*', fooHandler);
	// @ts-expect-error
	emitter.on('*', barHandler);
}

/*
 * Check that 'off' args are inferred correctly
 */
{
	// @ts-expect-error
	emitter.off('foo', barHandler);
	emitter.off('foo', fooHandler);

	emitter.off('bar', barHandler);
	// @ts-expect-error
	emitter.off('bar', fooHandler);

	emitter.off('*', wildcardHandler);
	// fooHandler is ok, because ('foo' | 'bar' | 'someEvent') extends string
	emitter.off('*', fooHandler);
	// @ts-expect-error
	emitter.off('*', barHandler);
}

/*
 * Check that 'emit' args are inferred correctly
 */
{
	// @ts-expect-error
	emitter.emit('someEvent', 'NOT VALID');
	emitter.emit('someEvent', { name: 'jack' });

	// @ts-expect-error
	emitter.emit('foo');
	// @ts-expect-error
	emitter.emit('foo', 1);
	emitter.emit('foo', 'string');

	emitter.emit('bar');
	emitter.emit('bar', 1);
	// @ts-expect-error
	emitter.emit('bar', 'string');
}
