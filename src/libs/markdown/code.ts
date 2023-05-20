import { Grammar, all, createStarryNight } from "@wooorm/starry-night";
import "@wooorm/starry-night/style/light.css";
import type * as Hast from "hast";
import { toString } from "hast-util-to-string";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import fenceparser from "./fenceparser";
import starryNightGutter, { Metadata, search } from "./starrynight/gutter";
import starryNightHeader from "./starrynight/header";

interface Options {
  aliases?: Record<string, string>;
  grammars?: Grammar[];
}

function extractMetadata(node: Hast.ElementContent): Metadata {
  let metadata;
  try {
    const { meta = "" } = node.data || {};
    metadata = fenceparser(meta as string).metadata;
  } catch (e) {}
  return (metadata || {}) as unknown as Metadata;
}

const rehypeStarryNight: Plugin<Options[], Hast.Root> = (options) => {
  // Careful: "options" is always optional in a unified.js Plugin
  const { aliases = {}, grammars = all } = options || {};
  const starryNightPromise = createStarryNight(grammars);
  const prefix = "language-";
  const plugin = async (tree: Hast.Root) => {
    const starryNight = await starryNightPromise;
    visit(tree, "element", function (node, index, parent) {
      if (!parent || index === null || node.tagName !== "pre") {
        return;
      }
      const head = node.children[0];
      if (
        !head ||
        head.type !== "element" ||
        head.tagName !== "code" ||
        !head.properties
      ) {
        return;
      }
      const classes = head.properties.className;
      if (!Array.isArray(classes)) return;
      const language = classes.find(
        (d) => typeof d === "string" && d.startsWith(prefix)
      );
      if (typeof language !== "string") return;
      const metadata = extractMetadata(head);
      const languageFragment = language.slice(prefix.length);
      const languageId = aliases[languageFragment] || languageFragment || "txt";

      const scope = starryNight.flagToScope(languageId);
      const code = toString(head);
      let children: Array<Hast.RootContent>;
      if (scope) {
        const fragment = starryNight.highlight(code, scope);
        children = fragment.children;
      } else {
        console.warn(
          `Grammar not found for ${languageId}; rendering the code without syntax highlighting`
        );
        children = head.children;
      }
      parent.children.splice(index, 1, {
        type: "element",
        tagName: "div",
        properties: {
          className: ["highlight", "highlight-" + languageId],
        },
        children: [
          starryNightHeader(
            languageFragment,
            (metadata as unknown as Record<string, string>)["caption"]
          ),
          {
            type: "element",
            tagName: "pre",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "code",
                properties: { tabindex: 0 },
                children: starryNightGutter(
                  children as unknown as Hast.ElementContent[],
                  code.match(search)?.length || 0,
                  metadata as Metadata
                ),
              },
            ],
          },
        ],
      });
    });
  };
  return plugin;
};

export default rehypeStarryNight;
