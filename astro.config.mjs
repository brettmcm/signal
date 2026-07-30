import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://signal.brettmcm.com",
  output: "static",
  publicDir: ".signal-public",
  trailingSlash: "always",
  devToolbar: {
    enabled: false,
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
});
