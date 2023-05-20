import type { Element, ElementContent } from "hast";

export default function starryNightHeader(
  language: string,
  caption: string
): Element {
  /** @type {Array<ElementContent>} */
  const children: ElementContent[] = [];

  if (language) {
    children.push({
      type: "element",
      tagName: "div",
      properties: { className: ["highlight-language"] },
      children: [
        {
          type: "text",
          value: language,
        },
      ],
    });
  }

  if (caption) {
    children.push({
      type: "element",
      tagName: "div",
      properties: { className: ["highlight-caption"] },
      children: [
        {
          type: "text",
          value: caption,
        },
      ],
    });
  }

  return {
    type: "element",
    tagName: "div",
    properties: { className: ["highlight-header"] },
    children,
  };
}
