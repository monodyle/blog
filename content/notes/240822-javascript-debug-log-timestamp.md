---
title: JavaScript debug log with timestamp
date: Aug 22, 2024
tags: [javascript, snippet]
---

```js
const _logger = console.debug.bind(console)
console.debug = function (...data: unknown[]) {
	_logger.call(this, `[${new Date().toISOString()}]`, ...data)
}
```
