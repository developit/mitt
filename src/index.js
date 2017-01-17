/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
export default function mitt () {
  let ret = {
    all: Object.create(null),

    /**
     * Register an event handler for the given type.
     *
     * @param  {String} type    Type of event to listen for, or `"*"` for all events
     * @param  {Function} handler Function to call in response to given event
     * @return {Object} the `mitt` instance for chaining
     * @memberOf mitt
     */
    on(type, handler) {
      list(type).add(handler);
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
      list(type).delete(handler);
      return ret;
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked prior to type-matched handlers.
     *
     * @param {String} type  The event type to invoke
     * @param {Any} [arg1]  A value (first argument), passed to each handler
     * @param {Any} [arg2]  A value (second argument), passed to each handler
     * @param {Any} [arg3]  A value (third argument), passed to each handler
     * @return {Object} the `mitt` instance for chaining
     * @memberof mitt
     */
    emit(type, arg1, arg2, arg3) {
      list(type).forEach((handler) => handler(arg1, arg2, arg3));
      list('*').forEach((handler) => handler(type, arg1, arg2, arg3));
      return ret;
    }
  };

  // Get or create a named handler list
  let list = (type) => {
    return ret.all[type = type.toLowerCase()] || (ret.all[type] = new Set());
  };

  return ret;
}
