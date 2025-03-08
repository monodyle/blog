---
title: Type-safe string replacement
date: Mar 12, 2023
tags: [typescript, snippet]
---

```ts
type ParseHrefParam<Path> = Path extends `${infer Start}/${infer Rest}`
	? ParseHrefParam<Start> & ParseHrefParam<Rest>
	: Path extends `:${infer Param}`
		? { [K in Param]: string }
		: NonNullable<unknown>;

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

href("/posts");
// /posts

href("/post/:id", { id: "1" });
// /post/1

href("/user/:id/settings/:name", {
	id: "d3dcb6ab-b3f9-4b35-8ee0-24967505b31b",
	name: "email",
});
// /user/d3dcb6ab-b3f9-4b35-8ee0-24967505b31b/settings/email
```
