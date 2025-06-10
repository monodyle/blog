---
title: React Toaster
excerpt: Quick implement React toast
date: June 10, 2025
tags: [react, snippet]
---

## Context

Implementing UI elements like toast or modal in React can be a bit tricky. Recently, during a chat about pattern with @github.com/nhducit, @github.com/ducan-ne, and @github.com/huyng12, we explored different approaches.

We notice that [React Aria](https://react-spectrum.adobe.com/react-aria/index.html) by Adobe using [Queue](https://react-spectrum.adobe.com/react-aria/Toast.html#toastqueue-api) for managing toasts, syncing it with React's hook life-cycle via `useSyncExternalStore`.

Another popular library, [Sonner](https://sonner.emilkowal.ski/) by @github.com/emilkowalski uses an observer, publish & subscribe pattern within `useEffect` for rendering.

This discussion led me to consider a component designed with the singleton pattern as a potential, simple, and incredibly effective solution.

## Implementation

```jsx file="toaster.jsx"
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { nanoid } from 'nanoid';

// This variable holds a reference to the function that adds a new toast
// It's initialized to `undefined` and will be set when <ToastRegion /> mounts
// This allows the `toast` utility function to trigger toast display from anywhere in the app
// By not exporting `_openToastFunction` directly, it prevent external modules from
// inadvertently reassigning or misusing the internal toast adding logic,
// ensuring that all toast additions go through the controlled `toast` public API
let _openToastFunction = undefined

export function ToastRegion() {
  const [toasts, setToasts] = useState([])

  // If there are no toasts to display, render nothing
  // This optimizes rendering by not creating a portal or any toast items when not needed
  if (toasts.length === 0) {
    return null
  }

  // Assign add new toast function to the global `_openToastFunction`
  _openToastFunction = (data) => setToasts((prev) => [{ ...data, id: nanoid() }, ...prev])

  // `closeToast` is a memoized callback function to remove a toast by its id
  const closeToast = (id) => setToasts((prev) => prev.filter(toast => toast.id !== id))

  return createPortal(
    toasts.map((toast) => (
      <ToastItem key={toast.id} data={toast} onClose={() => closeToast(toast.id)} />
    )),
    document.body
   )
}

export function toast(data) {
  // `_openToastFunction` has been set by a mounted <ToastRegion /> component
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

## Limitations

This design fundamentally assumes only one `ToastRegion` component will ever be rendered in the entire application. If you needed multiple, independent toast areas (e.g., one for notifications, one for system alerts in a specific part of the UI), this design wouldn't support it without significant refactoring.

## References

- [N ways to open modal/toasts](https://www.notion.so/nhducit/N-ways-to-open-modal-toasts-20badcd74d998068b37ae317645a14c5) by @github.com/nhducit
- [Sonner](https://sonner.emilkowal.ski/) by @github.com/emilkowalski
- [Toast – React Aria](https://react-spectrum.adobe.com/react-aria/Toast.html) by Adobe's React Aria
