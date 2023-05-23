import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import markdown from "./src/libs/markdown/markdown";

// https://astro.build/config
export default defineConfig({
  site: "https://minhle.space",
  integrations: [mdx(), sitemap()],
  markdown,
  output: "static",
});
