---
title: React Toaster
excerpt: Quick implement React toast
date: June 10, 2025
tags: [react, snippet]
---

## Context

Implementing UI elements like toast or modal in React can be a bit tricky. Recently, during a chat about pattern with @github.com/nhducit and @github.com/ducan-ne, we explored different approaches.

We notice that [React Aria](https://react-spectrum.adobe.com/react-aria/index.html) by Adobe using [Queue](https://react-spectrum.adobe.com/react-aria/Toast.html#toastqueue-api) for managing toasts, syncing it with React's hook life-cycle via `useSyncExternalStore`.

Another popular library, [Sonner](https://sonner.emilkowal.ski/) by @github.com/emilkowalski uses an observe, publish & subscribe pattern within `useEffect` for rendering.

This discussions led me to consider that a component designed with the singleton pattern as a potential, simple, and incredibly effective solution.

## Implement

```jsx file="toaster.jsx"
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { nanoid } from 'nanoid';

let _openToastFunction = undefined

export function ToastRegion() {
	const [toasts, setToasts] = useState([])
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted || toasts.length === 0) {
		return null
	}

	_openToastFunction = () => setToasts((prev) => [{ ...data, id: nanoid() }, ...prev])
	const closeToast = (id) => setToasts((prev) => prev.filter(toast => toast.id !== id))

	return createPortal(
		toasts.map((toast) => (
      <ToastItem key={toast.id} data={toast} onClose={() => closeToast(toast.id)} />
    )),
    document.body
   )
}

export function toast(data) {
	if (_openToastFunction !== undefined && typeof _openToastFunction === 'function') {
		_openToastFunction(data)
    return
	}

	throw new Error('<ToastRegion /> component is not mounted.')
}
```

## Usage

```jsx
import { toast, ToastRegion } from './toaster'

function Application() {
  return (
    <>
      <button onClick={() => toast({ message: 'Hello!' })}>
        Click me!
      </button>
      <ToastRegion />
    </>
  )
}
```

## Other patterns

- [N ways to open modal/toasts](https://www.notion.so/nhducit/N-ways-to-open-modal-toasts-20badcd74d998068b37ae317645a14c5) by @github.com/nhducit
- [Sonner](https://sonner.emilkowal.ski/) by @github.com/emilkowalski
- [Toast – React Aria](https://react-spectrum.adobe.com/react-aria/Toast.html) by Adobe's React Aria
