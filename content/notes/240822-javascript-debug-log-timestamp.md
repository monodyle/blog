---
title: JavaScript debug log with timestamp
date: Aug 22, 2024
tags: [javascript, snippet]
---

#### Bind to `console`

```js
const _logger = console.debug.bind(console)
console.debug = function (...data: unknown[]) {
	_logger.call(this, `[${new Date().toISOString()}]`, ...data)
}
```

#### Or using new method

```js
const log = (...args) => console.debug(`[${new Date().toISOString()}]`, ...args);
```

#### Usage

```js
console.debug('User connected to socket')
// [2024-08-22T07:42:44.488Z] User connected to socket
// [2024-08-22T07:42:44.905Z] New message
```
