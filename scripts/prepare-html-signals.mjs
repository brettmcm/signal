import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const target = resolve(root, ".signal-public");
const config = JSON.parse(await readFile(resolve(root, "signal.config.json"), "utf8"));
const publicSignals = config.publicHtml ?? [];

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await mkdir(resolve(target, "fonts"), { recursive: true });
await cp(
  resolve(root, "src/assets/DepartureMono-Regular.woff"),
  resolve(target, "fonts/DepartureMono-Regular.woff"),
);
await cp(resolve(root, "src/assets/rss.xsl"), resolve(target, "rss.xsl"));
await cp(
  resolve(root, "src/assets/capsules"),
  resolve(target, "capsules"),
  { recursive: true },
);

for (const slug of publicSignals) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error(`Invalid standalone signal slug: ${slug}`);
  }
  await cp(resolve(root, slug), resolve(target, slug), { recursive: true });
}
