import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://rogerdigital.github.io",
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    },
  },
});
