import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from 'rehype-stringify'
import rehypeStarryNight from "./code";
import { markdownHeading } from "./heading";

export const parseMarkdown = async (raw: string) => {
  const compiler = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStarryNight)
    .use(markdownHeading)
    .use(rehypeStringify);
  const result = await compiler.process(raw);
  const content = String(result);
  return content;
};
