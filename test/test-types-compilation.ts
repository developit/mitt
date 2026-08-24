/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */

import mitt, { Emitter } from '..';

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

/*
 * Check that interface- and alias-declared event maps are accepted
 * https://github.com/developit/mitt/issues/209
 */
{
	interface InterfaceEvents {
		foo: string;
		bar?: number;
	}

	type AliasEvents = {
		foo: string;
		bar?: number;
	};

	const fromInterface: Emitter<InterfaceEvents> = mitt<InterfaceEvents>();
	const fromAlias = mitt<AliasEvents>();

	fromInterface.on('foo', fooHandler);
	fromInterface.on('bar', barHandler);
	// @ts-expect-error
	fromInterface.emit('someEvent', { name: 'jack' });
	// @ts-expect-error
	fromInterface.emit('foo', 42);

	fromAlias.on('foo', (e) => {
		const check: string = e;
	});
	// @ts-expect-error
	fromAlias.emit('foo');
}
