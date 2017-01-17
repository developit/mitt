<p align="center">
  <img src="https://i.imgur.com/BqsX9NT.png" width="256" height="256" alt="mitt">
  <br>
  <b>Mitt</b>: tiny 200b functional event emitter / pubsub.
  <br>
  <a href="https://www.npmjs.org/package/mitt"><img src="https://img.shields.io/npm/v/mitt.svg?style=flat" alt="npm"></a> <a href="https://travis-ci.org/developit/mitt"><img src="https://travis-ci.org/developit/mitt.svg?branch=master" alt="travis"></a>
</p>

## Why Mitt?

- **Microscopic:** weighs less than 200 bytes gzipped
- **Useful:** a wildcard `"*"` event type listens to all events
- **Familiar:** same names & ideas as [Node's EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)
- **Functional:** methods don't rely on `this`
- **Great Name:** somehow [mitt](https://npm.im/mitt) wasn't taken

> Mitt was made for the browser, but works in any JavaScript runtime. It has no dependencies and supports IE9+.


## Examples & Demos

<a href="http://codepen.io/developit/pen/rjMEwW?editors=0110">
  <b>Preact + Mitt Codepen Demo</b>
  <br>
  <img src="https://i.imgur.com/CjBgOfJ.png" width="278" alt="preact + mitt preview">
</a>

* * *

## Usage

After installing via `npm install --save mitt`:

```js
import mitt from 'mitt'

let emitter = mitt()

// listen to an event
emitter.on('foo', e => console.log('foo', e) )

// listen to all events
emitter.on('*', (type, e) => console.log(type, e) )

// fire an event
emitter.emit('foo', { a: 'b' })

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten
```

* * *

## API

### mitt

Mitt: Tiny (~200b) functional event emitter / pubsub.

Returns **Mitt**

#### emit

Invoke all handlers for the given type.
If present, `"*"` handlers are invoked prior to type-matched handlers.

**Parameters**

-   `type` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The event type to invoke
-   `arg1` **\[Any]** A value (first argument), passed to each handler
-   `arg2` **\[Any]** A value (second argument), passed to each handler

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the `mitt` instance for chaining

### on

Register an event handler for the given type.

**Parameters**

-   `type` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of event to listen for, or `"*"` for all events
-   `handler` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Function to call in response to given event

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the `mitt` instance for chaining

### off

Remove an event handler for the given type.

**Parameters**

-   `type` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of event to unregister `handler` from, or `"*"`
-   `handler` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Handler function to remove

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the `mitt` instance for chaining
