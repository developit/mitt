type EventType = string | symbol;

// An event handler can take an optional event argument
// and should not return a value
type Handler<T = any> = (event?: T) => void;
type WildcardHandler = (type: EventType, event?: any) => void

// An array of all currently registered event handlers for a type
type EventHandlerList = Array<Handler>;
type WildCardEventHandlerList = Array<WildcardHandler>;

// A map of event types and their corresponding event handlers.
type EventHandlerMap = Map<EventType, EventHandlerList | WildCardEventHandlerList>;

export interface Emitter {
	on<T = any>(type: EventType, handler: Handler<T>): void;
	on(type: "*", handler: WildcardHandler): void;

	off(type: EventType, handler: Handler): void;
	off(type: "*", handler: WildcardHandler): void;

	emit(type: EventType, event?: any): void;
	emit(type: "*", event?: any): void;
}

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
export default function mitt(all: EventHandlerMap): Emitter {
	all = all || new Map();

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param {EventType} type Type of event to listen for, or `"*"` for all events
		 * @param {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on(type: EventType, handler: Handler) {
			const handlers = (all.get(type) || []);
			handlers.push(handler);
			all.set(type, handlers);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param {EventType} type Type of event to unregister `handler` from, or `"*"`
		 * @param {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off(type: EventType, handler: Handler) {
			if (all.has(type)) {
				all.get(type).splice(all.get(type).indexOf(handler) >>> 0, 1);
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked after type-matched handlers.
		 *
		 * Note: Manually firing "*" handlers is not supported.
		 *
		 * @param {EventType} type The event type to invoke
		 * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit(type: EventType, evt: any) {
			((all.get(type) || []) as EventHandlerList).slice().map((handler) => { handler(evt); });
			((all.get('*') || []) as WildCardEventHandlerList).slice().map((handler) => { handler(type, evt); });
		}
	};
}
