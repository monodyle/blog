import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import markdown from "./src/libs/markdown/markdown";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap()],
  markdown,
  output: "static",
  // experimental: {
  //   hybridOutput: true
  // },
  // output: "hybrid",
  // adapter: cloudflare(),
});
