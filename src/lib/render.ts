import rehypeShiki from '@shikijs/rehype'
import { transformerNotationHighlight } from '@shikijs/transformers'
import { h } from 'hastscript'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCustomEmoji from 'rehype-custom-emoji'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeImageCaption from 'rehype-image-caption'
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
import rehypeGithubMention from './github-mention'
import transformerFilename from './filename'

export function render(content: string) {
  return unified()
    .use(remarkParse, { fragment: true })
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, {
      theme: 'vitesse-light',
      colorReplacements: {
        '#ffffff': 'transparent',
      },
      addLanguageClass: true,
      transformers: [transformerNotationHighlight(), transformerFilename()],
      parseMetaString: (str: string) => {
        type MetaEntry = [string, string | boolean]

        const parseEntry = (entry: string): MetaEntry | null => {
          const [key, rawValue] = entry.split('=')
          const isValidKey = /^[A-Z0-9]+$/i.test(key)
          if (!isValidKey) return null

          const value = rawValue
            ? rawValue.replace(/^["'](.*)["']$/, '$1') || true
            : true

          return [key, value]
        }

        return Object.fromEntries(
          str
            .split(' ')
            .map(parseEntry)
            .filter((entry): entry is MetaEntry => entry !== null),
        )
      },
    })
    .use(rehypeRaw)
    .use(rehypeSanitize, {
      ...defaultSchema,
      tagNames: [
        ...(defaultSchema.tagNames || []),
        'small',
        'video',
        'source',
        'iframe',
        'figure',
        'figcaption',
      ],
      attributes: {
        ...defaultSchema.attributes,
        video: ['controls', 'width', 'height'],
        source: ['src', 'type'],
        iframe: ['src', 'frameborder', 'width', 'height'],
        '*': ['className'],
        span: ['style'],
      },
      clobberPrefix: '', // https://github.com/syntax-tree/hast-util-sanitize/issues/29#issuecomment-1781129045
    })
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'prepend',
      content: [h('span.anchor', { ariaHidden: true })],
    })
    .use(rehypeToc)
    .use(rehypeImageCaption)
    .use(rehypeCustomEmoji, { emojis })
    .use(rehypeGithubMention)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeExternalLinks, {
      target: '_blank',
      rel: ['noopener noreferrer'],
    })
    .process(content)
}
