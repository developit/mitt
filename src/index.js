// @flow
// An event handler can take an optional event argument
// and should not return a value
type EventHandler = (event?: any) => void;
// An array of all currently registered event handlers for a type
type EventHandlerList = Array<EventHandler>;
// A map of event types and their corresponding event handlers.
type EventHandlerMap = {
  [type: string]: EventHandlerList,
};

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
export default function mitt(all: EventHandlerMap) {
	all = all || Object.create(null);

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type    Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on(type: string, handler: EventHandler) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param  {String} type    Type of event to unregister `handler` from, or `"*"`
		 * @param  {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off(type: string, handler: EventHandler) {
			let e = all[type] || (all[type] = []);
			e.splice(e.indexOf(handler) >>> 0, 1);
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked prior to type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
		 * @memberof mitt
		 */
		emit(type: string, evt: EventHandler) {
			(all[type] || []).map((handler) => { handler(evt); });
			(all['*'] || []).map((handler) => { handler(type, evt); });
		}
	};
}
