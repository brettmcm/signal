import { defineConfig, envField } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://signal.brettmcm.com",
  output: "server",
  adapter: cloudflare({ imageService: "passthrough" }),
  publicDir: ".signal-public",
  trailingSlash: "always",
  devToolbar: {
    enabled: false,
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/secure/"),
    }),
  ],
  env: {
    schema: {
      SIGNAL_PASSWORDS: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SIGNAL_SESSION_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
});
