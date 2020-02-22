declare var mitt: mitt.MittStatic;

declare module "mitt" {
    export = mitt;
}

declare namespace mitt {
	type Handler<T = any | undefined> = (event: T) => void;
	type WildcardHandler = (type: string, event?: any) => void;

	interface MittStatic {
		(all?: {[key: string]: Array<Handler>}): Emitter<EventTypes>;
	}

	/**
	 * Augment this interface to provide typings for events
	 */
	interface EventTypes {
	}

	interface Emitter<T> {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param {string} type Type of event to listen for, or `"*"` for all events.
		 * @param {Handler} handler Function to call in response to the given event.
		 *
		 * @memberOf Mitt
		 */
		on(type: keyof T extends never ? string : never, handler: Handler): void;
		on<K extends keyof T>(type: K, handler: Handler<T[K]>): void;
		on(type: "*", handler: WildcardHandler): void;

		/**
		 * Function to call in response to the given event
		 *
		 * @param {string} type Type of event to unregister `handler` from, or `"*"`
		 * @param {Handler} handler Handler function to remove.
		 *
		 * @memberOf Mitt
		 */
		off(type: keyof T extends never ? string : never, handler: Handler): void;
		off<K extends keyof T>(type: K, handler: Handler<T[K]>): void;
		off(type: "*", handler: WildcardHandler): void;

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked prior to type-matched handlers.
		 *
		 * @param {string} type The event type to invoke
		 * @param {any} [event] An event object, passed to each handler
		 *
		 * @memberOf Mitt
		 */
		emit(type: keyof T extends never ? string : never, event?: any): void;
		emit<K extends keyof T>(type: K, event: T[K]): void;
		/**
		 * Note: Manually firing "*" events is unsupported.
		 */
		emit(type: "*", event?: any): void;
	}
}
