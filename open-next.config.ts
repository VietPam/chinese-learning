import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();
// Workers Builds runs npm run build. Keep Next's build separate to avoid recursion.
config.buildCommand = "npm run build:next";
export default config;
