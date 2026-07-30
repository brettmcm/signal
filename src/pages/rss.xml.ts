import rss from "@astrojs/rss";
import { getPublishedSignals, signalPath } from "../lib/signals";

export async function GET(context: { site: URL }) {
  const signals = await getPublishedSignals();
  return rss({
    title: "Signal — Brett McMillin",
    description: "Thoughts, experiments, writing, and useful artifacts.",
    site: context.site,
    items: signals.map((signal) => ({
      title: signal.data.title,
      description: signal.data.description,
      pubDate: signal.data.publishedAt,
      link: signalPath(signal),
    })),
  });
}
