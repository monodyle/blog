---
title: JavaScript method interceptor
excerpt: How to "hooks" into the object's method
date: May 29, 2025
tags: [javascript]
---

```js
function sum(...nums) {
  return nums.reduce((a, c) => a + c, 0);
}

function intercept(fn, { beforeFn, afterFn }) {
  return new Proxy(fn, {
    apply(target, thisArg, ...args) {
      beforeFn.apply(thisArg, args);
      const anyReturn = target.apply(thisArg, args);
      afterFn.apply(thisArg, args);
      return anyReturn;
    },
  });
}

const interceptedSum = intercept(sum, {
  beforeFn: (nums) => console.log("first", nums[0]),
  afterFn: (nums) => console.log("all", ...nums),
});

interceptedSum();
```
