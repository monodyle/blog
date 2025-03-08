---
title: Type-safe string replacement
date: Mar 12, 2023
tags: [typescript, snippet]
excerpt: uses conditional types to parse path parameters and ensure type safety when replacing dynamic segments
---

```ts
// recursive functional
type ParseHrefParam<Path> = Path extends `${infer Start}/${infer Rest}`
	? ParseHrefParam<Start> & ParseHrefParam<Rest>
	: Path extends `:${infer Param}`
		? { [K in Param]: string }
		: NonNullable<unknown>;

// the utility
function href<Path extends string>(
	...args: keyof ParseHrefParam<Path> extends never
		? [path: Path]
		: [path: Path, params: ParseHrefParam<Path>]
): string {
	const [path, params] = args;
	let result: string = path;

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			result = result.replace(`:${key}`, value);
		}
	}

	return result;
}

// no parameter
href("/posts");
// expect "/posts"

// single parameter
href("/post/:id", { id: "1" });
// expect "/post/1"

// multiple parameters
href("/user/:id/settings/:name", {
	id: "d3dcb6ab-b3f9-4b35-8ee0-24967505b31b",
	name: "email",
});
// expect "/user/d3dcb6ab-b3f9-4b35-8ee0-24967505b31b/settings/email"

// @ts-expect-error: no parameters
href("/articles", { foo: 'example' })

// @ts-expect-error: missing parameters
href("/users/:id")

// @ts-expect-error: invalid parameters
href("/blog/:slug", { id: '1' })
```
