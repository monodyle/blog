import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeStarryNight from "./code";
import { markdownHeading } from "./heading";
import rehypeKatex from "rehype-katex";
import rehypeToc from "rehype-toc";
import rehypeDocument from "rehype-document";

export const parseMarkdown = async (raw: string) => {
  const compiler = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNight)
    .use(rehypeKatex)
    .use(rehypeDocument, {
      css: "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css",
    })
    .use(markdownHeading)
    .use(rehypeToc)
    .use(rehypeStringify, { allowDangerousHtml: true });
  const result = await compiler.process(raw);
  const content = String(result);
  return content;
};
