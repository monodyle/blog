---
title: JavaScript sort callback
date: Aug 27, 2023
tags: [javascript]
---

### The Sort

JavaScript `Array.sort` default algorithm:
- Firefox (SpiderMonkey engine): Merge Sort[^1]
- Chromium/Node (V8 engine): Tim Sort [^2]

[^1]: https://bugzilla.mozilla.org/attachment.cgi?id=150540&action=edit
[^2]: https://github.com/v8/v8/blob/00e0311b24f81702be8952994afd5ce8a9b415b8/third_party/v8/builtins/array-sort.tq#L5

### The callback

Sort callback: `comparefn(a, b)`

> The sort must be stable (that is, elements that compare equal must remain in their original order).
> If `comparefn` is not **undefined**, it should be a function that accepts two arguments `x` and `y`
> and returns a negative Number if `x < y`, a positive Number if `x > y`, or a zero otherwise.
>
> - ECMAScript Language Specification[^3]

[^3]: https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.sort

So the `comparefn` **expect** you to return **negative number, zero, or positive number**.
But you can return any other type without any error (runtime or default linter setting).

Firefox and Chromium/Node have a difference arguments order (reversed):

![image](https://github.com/monodyle/note/assets/30283022/152aed4e-04a1-4a0f-bf98-ce5558d686a2)

Left is firefox console, right is edge console.
