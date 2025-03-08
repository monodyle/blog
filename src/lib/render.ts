import rehypeCustomEmoji from 'rehype-custom-emoji'
import { h } from 'hastscript'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { emojis } from './emojis'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeToc from 'rehype-toc'
import rehypeStringify from 'rehype-stringify'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeShiki from '@shikijs/rehype'
import { transformerNotationHighlight } from '@shikijs/transformers'

export function render(content: string) {
  return unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeCustomEmoji, { emojis })
    .use(rehypeShiki, {
      theme: 'vitesse-light',
      colorReplacements: {
        '#ffffff': '#ffffff80'
      },
      transformers: [transformerNotationHighlight()],
    })
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'prepend',
      content: [h('span.anchor', { ariaHidden: true })],
    })
    .use(rehypeToc)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeExternalLinks, {
      target: '_blank',
      rel: ['noopener noreferrer'],
    })
    .process(content)
}
