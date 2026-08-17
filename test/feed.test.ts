import { describe, expect, it } from "vitest";
import { XMLParser } from "fast-xml-parser";
import {
  FEED_LIMIT,
  absolutizeHtmlUrls,
  renderFeedContent,
  selectFeedSignals,
} from "../src/lib/feed";
import { isPublishedSignalData } from "../src/lib/signal-data";

function signal(number: number, date: string) {
  return {
    id: `signal-${number}.mdx`,
    signalNumber: String(number).padStart(3, "0"),
    data: {
      signalNumber: number,
      title: `Signal ${number}`,
      description: "Description",
      publishedAt: new Date(`${date}T00:00:00Z`),
      tags: [],
      status: "published",
      featured: false,
    },
  } as any;
}

describe("Signal RSS helpers", () => {
  it("sorts newest first and limits the feed to 50 entries", () => {
    const signals = Array.from({ length: 55 }, (_, index) =>
      signal(index + 1, `2026-07-${String((index % 28) + 1).padStart(2, "0")}`),
    );
    const selected = selectFeedSignals(signals);

    expect(selected).toHaveLength(FEED_LIMIT);
    expect(selected[0].data.publishedAt.getTime()).toBeGreaterThanOrEqual(
      selected.at(-1)!.data.publishedAt.getTime(),
    );
  });

  it("keeps full readable content and links interactive capsules to the site", () => {
    const source = `
import DemoPanel from "../../capsules/007/02/index.astro";

## Tools & craft

A paragraph with [a relative link](/about/) and an image:

![Artifact](./artifact.png)

- One
- Two

\`\`\`js
const safe = "<xml> & more";
\`\`\`

<DemoPanel />
`;
    const pageUrl = new URL("https://signal.brettmcm.com/signals/demo/");
    const html = renderFeedContent(source, pageUrl, {
      posterUrl: new URL("https://signal.brettmcm.com/capsules/007/02/poster.jpg"),
    });

    expect(html).toContain("<h2>Tools &amp; craft</h2>");
    expect(html).toContain('href="https://signal.brettmcm.com/about/"');
    expect(html).toContain('src="https://signal.brettmcm.com/signals/demo/artifact.png"');
    expect(html).toContain("<ul>");
    expect(html).toContain("<pre><code");
    expect(html).toContain(
      'href="https://signal.brettmcm.com/signals/demo/#capsule-007-02"',
    );
    expect(html).toContain(
      'src="https://signal.brettmcm.com/capsules/007/02/poster.jpg"',
    );
    expect(html).not.toContain("import DemoPanel");
    expect(html).not.toContain("<DemoPanel");
  });

  it("rewrites relative URLs without changing fragments or mail links", () => {
    const html = absolutizeHtmlUrls(
      '<a href="../one/">One</a><a href="#two">Two</a><a href="mailto:test@example.com">Mail</a>',
      new URL("https://signal.brettmcm.com/signals/example/"),
    );
    expect(html).toContain('href="https://signal.brettmcm.com/signals/one/"');
    expect(html).toContain('href="#two"');
    expect(html).toContain('href="mailto:test@example.com"');
  });

  it("distinguishes published and draft entries", () => {
    expect(isPublishedSignalData({ status: "published" } as any)).toBe(true);
    expect(isPublishedSignalData({ status: "draft" } as any)).toBe(false);
  });

  it("produces XML-safe feed fragments", () => {
    const xml = `<?xml version="1.0"?><rss><channel><item><title>Tools &amp; craft</title></item></channel></rss>`;
    const parsed = new XMLParser().parse(xml);
    expect(parsed.rss.channel.item.title).toBe("Tools & craft");
  });
});
