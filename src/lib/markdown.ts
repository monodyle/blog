import type { AstroUserConfig } from 'astro'
import { h } from 'hastscript'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCustomEmoji from 'rehype-custom-emoji'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import rehypeToc from 'rehype-toc'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import { lightTheme } from './shiki-theme'

export const emojis: Record<string, string> = {
  adore: '/assets/emoji/adore.png',
  argggg: '/assets/emoji/argggg.png',
  christ: '/assets/emoji/christ.png',
  confused: '/assets/emoji/confused.png',
  cry: '/assets/emoji/cry.png',
  doubt: '/assets/emoji/doubt.png',
  go: '/assets/emoji/go.png',
  gun: '/assets/emoji/gun.png',
  lookdown: '/assets/emoji/look_down.png',
  moka: '/assets/emoji/moka.png',
  mokas: '/assets/emoji/mokas.png',
  ok: '/assets/emoji/ok.png',
  okay: '/assets/emoji/okay.png',
  pepe_surrender: '/assets/emoji/pepe_surrender.png',
  popcorn: '/assets/emoji/popcorn.png',
  rage: '/assets/emoji/rage.png',
  sad: '/assets/emoji/sad.png',
  smug: '/assets/emoji/smug.png',
  snug: '/assets/emoji/snug.png',
  stab: '/assets/emoji/stab.png',
  surrender: '/assets/emoji/surrender.png',
  yikes: '/assets/emoji/yikes.png',
  sosad: '/assets/emoji/sosad.gif',
  nosebleed: '/assets/emoji/nosebleed.png',
  smoke: '/assets/emoji/smoke.png',
}

const markdown: AstroUserConfig['markdown'] = {
  syntaxHighlight: 'shiki',
  shikiConfig: {
    theme: lightTheme,
    transformers: [],
  },
  remarkRehype: {
    allowDangerousHtml: true,
  },
  gfm: true,
  remarkPlugins: [remarkParse, remarkMath],
  rehypePlugins: [
    [rehypeCustomEmoji, { emojis }],
    rehypeKatex,
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'prepend',
        content: [h('span.anchor', { ariaHidden: true })],
      },
    ],
    rehypeToc as unknown as string,
    [rehypeStringify, { allowDangerousHtml: true }],
    [rehypeExternalLinks, { target: '_blank', rel: ['noopener noreferrer'] }],
  ],
}

export default markdown
