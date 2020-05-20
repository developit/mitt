// An event handler can take an optional event argument
// and should not return a value
type Handler = (event?: any) => void;
type WildcardHandler = (type: string, event?: any) => void
// An array of all currently registered event handlers for a type
type EventHandlerList = Array<Handler>;
type WildCardEventHandlerList = Array<WildcardHandler>;
// A map of event types and their corresponding event handlers.
type EventHandlerMap = {
  '*'?: WildCardEventHandlerList;
  [type: string]: EventHandlerList;
};

export interface Emitter {
	on(type: string, handler: Handler): void;
	on(type: "*", handler: WildcardHandler): void;

	off(type: string, handler: Handler): void;
	off(type: "*", handler: WildcardHandler): void;

	emit(type: string, event?: any): void;
	emit(type: "*", event?: any): void;
}

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
export default function mitt(all: EventHandlerMap): Emitter {
	all = all || Object.create(null);

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param {string} type Type of event to listen for, or `"*"` for all events
		 * @param {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on(type: string, handler: Handler) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param {string} type Type of event to unregister `handler` from, or `"*"`
		 * @param {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off(type: string, handler: Handler) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked after type-matched handlers.
		 *
		 * Note: Manually firing "*" handlers is not supported.
		 *
		 * @param {String} type The event type to invoke
		 * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit(type: string, evt: any) {
			(all[type] || []).slice().map((handler) => { handler(evt); });
			(all['*'] || []).slice().map((handler) => { handler(type, evt); });
		}
	};
}
