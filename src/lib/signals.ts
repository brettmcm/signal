import { getCollection, type CollectionEntry } from "astro:content";

export type Signal = CollectionEntry<"signals">;
export type NumberedSignal = Signal & {
  signalNumber: string;
};

export async function getPublishedSignals() {
  const signals = await getCollection("signals", ({ data }) => !data.draft);

  return signals
    .sort((a, b) => {
      const dateDifference =
        a.data.publishedAt.valueOf() - b.data.publishedAt.valueOf();

      return dateDifference || a.id.localeCompare(b.id);
    })
    .map((signal, index) => ({
      ...signal,
      signalNumber: String(index + 1).padStart(3, "0"),
    }))
    .reverse();
}

export function signalPath(signal: Signal) {
  return `/${signal.id.replace(/\.(md|mdx)$/, "")}/`;
}
