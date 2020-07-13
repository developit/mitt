/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */

import mitt from '..';

const emitter = mitt();

/*
 * Check that if on is provided a generic, it only accepts handlers of that type
 */
{
	const badHandler = (x: number) => {};
	const goodHandler = (x: string) => {};

	// @ts-expect-error
	emitter.on<string>('foo', badHandler);
	emitter.on<string>('foo', goodHandler);
}

/*
 * Check that if off is provided a generic, it only accepts handlers of that type
 */
{
	const badHandler = (x: number) => {};
	const goodHandler = (x: string) => {};

	// @ts-expect-error
	emitter.off<string>('foo', badHandler);
	emitter.off<string>('foo', goodHandler);
}


/*
 * Check that if emitt is provided a generic, it only accepts event data of that type
 */
{
	interface SomeEventData {
    name: string;
  }
  // @ts-expect-error
	emitter.emit<SomeEventData>('foo', 'NOT VALID');
	emitter.emit<SomeEventData>('foo', { name: 'jack' });
}

