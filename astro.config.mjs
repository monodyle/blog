import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkFootnote from "remark-footnotes";
import remarkRehype from "remark-rehype";
import rehypeStarryNight from "./src/libs/markdown/code";
import { markdownHeading } from "./src/libs/markdown/heading";
import rehypeKatex from "rehype-katex";
import rehypeToc from "rehype-toc";
import rehypeDocument from "rehype-document";
import rehypeStringify from "rehype-stringify";
// import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [
      remarkParse,
      remarkMath,
      remarkGfm,
      [remarkFootnote, { inlineNotes: true }],
      [remarkRehype, { allowDangerousHtml: true }],
    ],
    rehypePlugins: [
      rehypeStarryNight,
      rehypeKatex,
      [
        rehypeDocument,
        { css: "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" },
      ],
      markdownHeading,
      rehypeToc,
      [rehypeStringify, { allowDangerousHtml: true }],
    ],
  },
  output: "static",
  // experimental: {
  //   hybridOutput: true
  // },
  // output: "hybrid",
  // adapter: cloudflare(),
});
