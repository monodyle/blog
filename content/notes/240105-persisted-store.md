---
title: JavaScript persisted store
date: Jan 05, 2024
tags: [typescript, snippet]
---

```ts file="schema.ts"
type Session = {
  id: string
  email: string
  displayName: string
}

type Store = {
  sessions: Array<Session>
  active: Session | null
}

const defaultStore: Store = {
  sessions: []
  active: null
}
```

```ts file="store.ts"
import localforage from 'localforage'

const store = {
  key() {
    return 'storage'
  },
  write(state: Store) {
    return localforage.setItem(store.key(), JSON.stringify(value))
  },
  async read() {
    const raw = (await localforage.getItem(store.key())) as string | undefined
    const obj = raw ? JSON.parse(raw) : undefined
    return obj as Store
  },
  clear() {
    return localforage.removeItem(store.key())
  },
}
```

```ts file="persisted.ts"
import type { Draft } from 'immer'
import { produce } from 'immer'

let _state: Store = defaultStore

const persisted = {
  async init() {
    const stored = await store.read()
    if (!stored) {
      await store.write(defaultStore)
    }
    _state = stored || defaultStore
  },
  read<Selected>(selector: (persisted: Store) => Selected): Selected {
    return selector(_state)
  },
  write(writer: (draft: Draft<Store>) => void) {
    _state = produce(_state, writer)
    await store.write(_state)
  }
}
```
