import rss from "@astrojs/rss";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { getSignalSource, renderFeedContent, selectFeedSignals } from "../lib/feed";
import { getPublishedSignals, signalPath } from "../lib/signals";

export async function GET(context: { site: URL }) {
  const signals = selectFeedSignals(await getPublishedSignals());
  const feedUrl = new URL("/rss.xml", context.site);
  const items = await Promise.all(
    signals.map(async (signal) => {
      const link = signal.data.canonical ?? new URL(signalPath(signal), context.site).href;
      const media = signal.data.capsuleMedia;
      const enclosure = media ? {
        url: new URL(media.url, context.site).href,
        type: media.type,
        length: (await stat(resolve(".signal-public", media.url.slice(1)))).size,
      } : undefined;
      return {
        title: signal.data.title,
        description: signal.data.description,
        pubDate: signal.data.publishedAt,
        link,
        categories: signal.data.tags,
        content: renderFeedContent(
          await getSignalSource(signal),
          new URL(link),
          media ? { posterUrl: new URL(media.poster, context.site) } : undefined,
        ),
        enclosure,
      };
    }),
  );

  return rss({
    title: "signal.brettmcm",
    description: "Thoughts, experiments, writing, and useful artifacts.",
    site: context.site,
    stylesheet: "/rss.xsl",
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData:
      `<language>en-us</language>` +
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>` +
      `<atom:link href="${feedUrl.href}" rel="self" type="application/rss+xml" />`,
    items,
  });
}
