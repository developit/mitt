/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
export default function mitt(all) {
	all = all || Object.create(null);

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type    Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @return {Object} the `mitt` instance for chaining
		 * @memberOf mitt
		 */
		on(type, handler) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param  {String} type    Type of event to unregister `handler` from, or `"*"`
		 * @param  {Function} handler Handler function to remove
		 * @return {Object} the `mitt` instance for chaining
		 * @memberOf mitt
		 */
		off(type, handler) {
			let e = all[type] || (all[type] = []);
			e.splice(e.indexOf(handler) >>> 0, 1);
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked prior to type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
		 * @return {Object} the `mitt` instance for chaining
		 * @memberof mitt
		 */
		emit(type, evt) {
			(all[type] || []).map((handler) => { handler(evt); });
			(all['*'] || []).map((handler) => { handler(type, evt); });
		}
	};
}
