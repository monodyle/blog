import { h } from 'hastscript'
import type { ShikiTransformer } from 'shiki'

export default function transformerFilename(): ShikiTransformer {
  return {
    name: 'shiki-filename',
    pre(this, root) {
      const meta = this.options.meta || {}
      const title = meta.file

      if (title) {
        const filenameElement = h('div', { class: 'shiki-filename' }, [
          h('span', { class: 'shiki-filename-title' }, title),
        ])
        root.children.unshift(filenameElement)
      }
    },
  }
}
