import type { AstroUserConfig } from "astro";
import rehypeCustomEmoji from "rehype-custom-emoji";
import rehypeDocument from "rehype-document";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import rehypeToc from "rehype-toc";
import remarkFootnote from "remark-footnotes";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStarryNight from "./code";
import { markdownHeading } from "./heading";

export const emojis: Record<string, string> = {
  adore: "/assets/emoji/adore.png",
  argggg: "/assets/emoji/argggg.png",
  christ: "/assets/emoji/christ.png",
  confused: "/assets/emoji/confused.png",
  cry: "/assets/emoji/cry.png",
  doubt: "/assets/emoji/doubt.png",
  go: "/assets/emoji/go.png",
  gun: "/assets/emoji/gun.png",
  lookdown: "/assets/emoji/look_down.png",
  moka: "/assets/emoji/moka.png",
  mokas: "/assets/emoji/mokas.png",
  ok: "/assets/emoji/ok.png",
  okay: "/assets/emoji/okay.png",
  pepe_surrender: "/assets/emoji/pepe_surrender.png",
  popcorn: "/assets/emoji/popcorn.png",
  rage: "/assets/emoji/rage.png",
  sad: "/assets/emoji/sad.png",
  smug: "/assets/emoji/smug.png",
  snug: "/assets/emoji/snug.png",
  stab: "/assets/emoji/stab.png",
  surrender: "/assets/emoji/surrender.png",
  yikes: "/assets/emoji/yikes.png",
  sosad: "/assets/emoji/sosad.gif",
  nosebleed: "/assets/emoji/nosebleed.png",
  smoke: "/assets/emoji/smoke.png",
};

const markdown: AstroUserConfig["markdown"] = {
  remarkPlugins: [
    remarkParse as unknown as string,
    remarkMath,
    remarkGfm,
    [remarkFootnote, { inlineNotes: true }],
    [remarkRehype as unknown as string, { allowDangerousHtml: true }],
  ],
  rehypePlugins: [
    rehypeStarryNight,
    rehypeKatex,
    [
      rehypeDocument,
      { css: "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" },
    ],
    markdownHeading as unknown as string,
    rehypeToc as unknown as string,
    [rehypeStringify as unknown as string, { allowDangerousHtml: true }],
    [rehypeExternalLinks, { target: "_blank", rel: ["noopener noreferrer"] }],
    [rehypeCustomEmoji, { emojis }],
  ],
};

export default markdown;
