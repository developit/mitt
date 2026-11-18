export type EventType = string | symbol;

// An event handler can take an optional event argument
// and should not return a value
export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (
	type: keyof T,
	event: T[keyof T]
) => void;

// An array of all currently registered event handlers for a type
export type EventHandlerList<T = unknown> = Array<Handler<T>>;
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<
	WildcardHandler<T>
>;

// A map of event types and their corresponding event handlers.
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
	keyof Events | '*',
	EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;

export interface Emitter<Events extends Record<EventType, unknown>> {
	all: EventHandlerMap<Events>;

	on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
	on(type: '*', handler: WildcardHandler<Events>): void;

	once<Key extends keyof Events>(
		type: Key,
		handler: Handler<Events[Key]>
	): void;
	once(type: '*', handler: WildcardHandler<Events>): void;

	off<Key extends keyof Events>(
		type: Key,
		handler?: Handler<Events[Key]>
	): void;
	off(type: '*', handler: WildcardHandler<Events>): void;

	emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
	emit<Key extends keyof Events>(
		type: undefined extends Events[Key] ? Key : never
	): void;
}

const onceHandlerKey = '__mittOnce';
const onceHandlerMarker = {};

/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
export default function mitt<Events extends Record<EventType, unknown>>(
	all?: EventHandlerMap<Events>
): Emitter<Events> {
	type GenericEventHandler =
		| Handler<Events[keyof Events]>
		| WildcardHandler<Events>;
	type OnceHandlerMetadata = {
		marker: typeof onceHandlerMarker;
		handler: GenericEventHandler;
	};
	all = all || new Map();

	return {
		/**
		 * A Map of event names to registered handler functions.
		 */
		all,

		/**
		 * Register an event handler for the given type.
		 * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
		 * @param {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
			const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
			if (handlers) {
				handlers.push(handler);
			} else {
				all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
			}
		},

		/**
		 * Register an event handler for the given type that is invoked at most once.
		 * The handler is removed after its first invocation, and can also be
		 * removed beforehand with `off(type, handler)`.
		 * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
		 * @param {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		once<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
			let fired = false;
			const wrapper = ((...args: Array<unknown>) => {
				// emit() invokes handlers from a snapshot, so when an
				// earlier listener re-emits synchronously the nested emit
				// would invoke this wrapper and the outer emit would invoke
				// it again. Guard on `fired` so it runs at most once.
				if (fired) {
					return;
				}
				fired = true;
				const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
				if (handlers) {
					handlers.splice(handlers.indexOf(wrapper) >>> 0, 1);
				}
				(handler as (...args: Array<unknown>) => void)(...args);
			}) as GenericEventHandler;
			// Store the handler on its wrapper so emitters sharing a map
			// can identify it without requiring WeakMap.
			Object.defineProperty(wrapper, onceHandlerKey, {
				value: { marker: onceHandlerMarker, handler }
			});
			const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
			if (handlers) {
				handlers.push(wrapper);
			} else {
				all!.set(type, [wrapper] as EventHandlerList<Events[keyof Events]>);
			}
		},

		/**
		 * Remove an event handler for the given type.
		 * If `handler` is omitted, all handlers of the given type are removed.
		 * @param {string|symbol} type Type of event to unregister `handler` from (`'*'` to remove a wildcard handler)
		 * @param {Function} [handler] Handler function to remove
		 * @memberOf mitt
		 */
		off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
			const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
			if (handlers) {
				if (handler) {
					// A handler registered via `once()` is stored as a wrapper,
					// so match it through the original handler. Like Node's
					// `removeListener`, the first matching listener is removed.
					// A plain loop (no Array.prototype.findIndex) keeps this
					// working on IE11, within the README's advertised IE9+
					// support.
					let index = -1;
					for (let i = 0; i < handlers.length; i++) {
						const listener = handlers[i];
						if (listener !== handler) {
							const descriptor: PropertyDescriptor | undefined =
								typeof listener === 'function'
									? Object.getOwnPropertyDescriptor(listener, onceHandlerKey)
									: undefined;
							const metadata: OnceHandlerMetadata | undefined = descriptor
								? descriptor.value
								: undefined;
							if (
								!metadata ||
								metadata.marker !== onceHandlerMarker ||
								metadata.handler !== handler
							) {
								continue;
							}
						}
						index = i;
						break;
					}
					handlers.splice(index >>> 0, 1);
				} else {
					all!.set(type, []);
				}
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `'*'` handlers are invoked after type-matched handlers.
		 *
		 * Note: Manually firing '*' handlers is not supported.
		 *
		 * @param {string|symbol} type The event type to invoke
		 * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
			let handlers = all!.get(type);
			if (handlers) {
				(handlers as EventHandlerList<Events[keyof Events]>)
					.slice()
					.map((handler) => {
						handler(evt!);
					});
			}

			handlers = all!.get('*');
			if (handlers) {
				(handlers as WildCardEventHandlerList<Events>)
					.slice()
					.map((handler) => {
						handler(type, evt!);
					});
			}
		}
	};
}
