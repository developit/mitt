# `mitt`

[![NPM](https://img.shields.io/npm/v/mitt.svg?style=flat)](https://www.npmjs.org/package/mitt)
[![travis-ci](https://travis-ci.org/developit/mitt.svg?branch=master)](https://travis-ci.org/developit/mitt)

**Tiny (~200b) functional event emitter / pubsub.**

**It's tiny:** no dependencies and only **190 bytes** when gzipped _(250b without)_.

* * *

## Installation

```sh
npm install --save mitt
```

* * *

## API

### mitt

Mitt: Tiny (~200b) functional event emitter / pubsub.

Returns **Mitt** 

#### on

Register an event handler for the given type.

**Parameters**

-   `type` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of event to listen for, or `"*"` for all events
-   `handler` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Function to call in response to the given event

#### off

Remove an event handler for the given type.

**Parameters**

-   `type` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of event to unregister `handler` from, or `"*"`
-   `handler` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Handler function to remove

#### emit

Invoke all handlers for the given type.
If present, `"*"` handlers are invoked prior to type-matched handlers.

**Parameters**

-   `type` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The event type to invoke
-   `event` **\[Any]** An event object, passed to each handler
