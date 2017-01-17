/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
export default function mitt () {
	let all = Object.create(null)
	let ret = {
		all,

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
			return ret;
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
			return ret;
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked prior to type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [arg1]  A value (first argument), passed to each handler
		 * @param {Any} [arg2]  A value (second argument), passed to each handler
		 * @return {Object} the `mitt` instance for chaining
		 * @memberof mitt
		 */
		emit(type, arg1, arg2) {
			(all[type] || []).map((handler) => { handler(arg1, arg2); });
			(all['*'] || []).map((handler) => { handler(type, arg1, arg2); });
			return ret;
		}
	};
	return ret;
}
