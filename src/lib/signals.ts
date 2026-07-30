import { getCollection, type CollectionEntry } from "astro:content";

export type Signal = CollectionEntry<"signals">;

export async function getPublishedSignals() {
  const signals = await getCollection("signals", ({ data }) => !data.draft);
  return signals.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}

export function signalPath(signal: Signal) {
  return `/${signal.id.replace(/\.(md|mdx)$/, "")}/`;
}
