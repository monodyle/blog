import type { Root } from 'hast'
import { findAndReplace } from 'hast-util-find-and-replace'

export default function rehypeGithubMention() {
  return (tree: Root) => {
    findAndReplace(tree, [
      [
        /@github\.com\/([a-zA-Z0-9_-]+)/g,
        (...match) => {
          return {
            type: 'element',
            tagName: 'a',
            properties: {
              className: 'github-mention',
              href: `https://github.com/${match[1]}`,
            },
            children: [
              {
                type: 'element',
                tagName: 'img',
                properties: {
                  src: `https://github.com/${match[1]}.png`,
                  alt: `${match[1]}`,
                  width: 18,
                  height: 18,
                  loading: 'lazy',
                },
                children: [],
              },
              { type: 'text', value: `${match[1]}` },
            ],
          }
        },
      ],
    ])
  }
}
