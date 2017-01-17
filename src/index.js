/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *	@name mitt
 *	@returns {Mitt}
 */
function mitt() {
	// Arrays of event handlers, keyed by type
	let all = {};

	return {

		/** Register an event handler for the given type.
		 *	@param {String} type		Type of event to listen for, or `"*"` for all events
		 *	@param {Function} handler	Function to call in response to the given event
		 *	@memberof mitt
		 */
		on(type, handler) {
			(all[type = type.toLowerCase()] || (all[type] = [])).push(handler);
		},

		/** Remove an event handler for the given type.
		 *	@param {String} type		Type of event to unregister `handler` from, or `"*"`
		 *	@param {Function} handler	Handler function to remove
		 *	@memberof mitt
		 */
		off(type, handler) {
			let e = all[type = type.toLowerCase()] || (all[type] = []);
			e.splice(e.indexOf(handler)>>>0, 1);
		},

		/** Invoke all handlers for the given type.
		 *	If present, `"*"` handlers are invoked prior to type-matched handlers.
		 *	@param {String} type	The event type to invoke
		 *	@param {Any} [event]	An event object, passed to each handler
		 *	@memberof mitt
		 */
		emit(type, event) {
			(all[type = type.toLowerCase()] || []).map( f => { f(event); });
			(all['*'] || []).map( f => { f(type, event); });
		}
	};
}
try { module.exports = mitt; }catch(e){}
