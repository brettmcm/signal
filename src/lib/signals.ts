import { getCollection, type CollectionEntry } from "astro:content";
import { isPublishedSignalData } from "./signal-data";

export type Signal = CollectionEntry<"signals">;
export type NumberedSignal = Signal & {
  signalNumber: string;
};

export async function getPublishedSignals() {
  const signals = await getCollection(
    "signals",
    ({ data }) => isPublishedSignalData(data),
  );

  const duplicateNumbers = signals
    .map((signal) => signal.data.signalNumber)
    .filter((number, index, numbers) => numbers.indexOf(number) !== index);

  if (duplicateNumbers.length > 0) {
    throw new Error(
      `Duplicate signal number${duplicateNumbers.length === 1 ? "" : "s"}: ${[
        ...new Set(duplicateNumbers),
      ].join(", ")}`,
    );
  }

  return signals
    .map((signal) => ({
      ...signal,
      signalNumber: String(signal.data.signalNumber).padStart(3, "0"),
    }))
    .sort(
      (a, b) =>
        b.data.publishedAt.getTime() - a.data.publishedAt.getTime() ||
        b.data.signalNumber - a.data.signalNumber,
    );
}

export function signalPath(signal: Signal) {
  return `/signals/${signal.id.replace(/\.(md|mdx)$/, "")}/`;
}
