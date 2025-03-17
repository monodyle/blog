---
title: JavaScript persisted store
date: Jan 05, 2024
tags: [typescript, snippet]
---

```ts file="persisted.ts"
import type { Draft } from 'immer'
import { produce } from 'immer'

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

const _key = 'application_store' as const
let _state: Store = defaultStore

const persisted = {
  init() {
    const value = localStorage.getItem(_key)
    if (!value) return defaultStore
    _state = JSON.parse(value) || defaultStore
  },
  read<Selected>(selector: (persisted: Store) => Selected): Selected {
    return selector(_state)
  },
  write(writer: (draft: Draft<Store>) => void) {
    _state = produce(_state, writer)
    localStorage.setItem(_key, JSON.stringify(_state))
  },
}

export default persisted
```
