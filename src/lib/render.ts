import rehypeShiki from '@shikijs/rehype'
import { transformerNotationHighlight } from '@shikijs/transformers'
import { h } from 'hastscript'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCustomEmoji from 'rehype-custom-emoji'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import rehypeToc from 'rehype-toc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { emojis } from './emojis'

export function render(content: string) {
  return unified()
    .use(remarkParse, { fragment: true })
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, {
      ...defaultSchema,
      tagNames: [
        ...defaultSchema.tagNames || [],
        'video',
        'source'
      ],
      attributes: {
        ...defaultSchema.attributes,
        video: [
          'controls',
          'width',
          'height'
        ],
        source: [
          'src',
          'type'
        ]
      }
    })
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
    .use(rehypeCustomEmoji, { emojis })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeExternalLinks, {
      target: '_blank',
      rel: ['noopener noreferrer'],
    })
    .process(content)
}
