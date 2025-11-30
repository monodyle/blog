import type { ElementContent, Root } from 'hast'
import { findAndReplace } from 'hast-util-find-and-replace'

const URL_PATTERN = /^https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([0-9A-Za-z_-]+)/;

export default function rehypeYoutubeEmbed() {
  return (tree: Root) => {
    findAndReplace(tree, [
      URL_PATTERN,
      (...match) => {
        const iframe: ElementContent = {
          type: 'element',
          tagName: 'iframe',
          properties: {
            src: `https://www.youtube.com/embed/${match[1]}`,
            width: '100%',
            height: 'auto',
            frameborder: '0',
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
            referrerpolicy: 'strict-origin-when-cross-origin',
            allowfullscreen: true,
          },
          children: [],
        }

        return {
          type: 'element',
          tagName: 'figure',
          properties: {
            className: 'youtube-embed',
          },
          children: [iframe],
        }
      },
    ]);
  }
}
