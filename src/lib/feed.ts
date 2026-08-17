import { readFile } from "node:fs/promises";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export const FEED_LIMIT = 50;

type FeedContentOptions = {
  posterUrl?: URL;
};

type FeedSignal = {
  id: string;
  signalNumber: string;
  data: {
    signalNumber: number;
    publishedAt: Date;
  };
};

type SourceSignal = FeedSignal & {
  body?: string;
  filePath?: string;
};

export function selectFeedSignals<T extends FeedSignal>(signals: T[]): T[] {
  return [...signals]
    .sort(
      (a, b) =>
        b.data.publishedAt.getTime() - a.data.publishedAt.getTime() ||
        b.data.signalNumber - a.data.signalNumber,
    )
    .slice(0, FEED_LIMIT);
}

export async function getSignalSource(signal: SourceSignal) {
  if (typeof signal.body === "string") return signal.body;
  if (signal.filePath) {
    const source = await readFile(signal.filePath, "utf8");
    return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  }
  throw new Error(`Signal ${signal.id} has no readable MDX source`);
}

export function renderFeedContent(
  source: string,
  pageUrl: URL,
  options: FeedContentOptions = {},
) {
  const componentLinks = new Map<string, string>();
  const withoutImports = source.replace(
    /^import\s+([A-Z][\w]*)\s+from\s+["'][^"']*\/capsules\/(\d+)\/(\d+)\/index\.astro["'];?\s*$/gm,
    (_match, component, signalNumber, capsuleNumber) => {
      componentLinks.set(
        component,
        `capsule-${String(signalNumber).padStart(3, "0")}-${String(capsuleNumber).padStart(2, "0")}`,
      );
      return "";
    },
  ).replace(/^import\s+[\s\S]*?;\s*$/gm, "");

  let feedMarkdown = withoutImports;
  for (const [component, anchor] of componentLinks) {
    const componentPattern = new RegExp(`<${component}\\b[^>]*\\/>`, "g");
    const capsuleUrl = new URL(`#${anchor}`, pageUrl).href;
    const preview = options.posterUrl
      ? `[![Interactive Capsule preview](${options.posterUrl.href})](${capsuleUrl})\n\n`
      : "";
    feedMarkdown = feedMarkdown.replace(
      componentPattern,
      `\n\n${preview}[View the interactive capsule on Signal](${capsuleUrl})\n\n`,
    );
  }

  feedMarkdown = feedMarkdown.replace(
    /<[A-Z][\w.]*\b[^>]*\/>/g,
    `\n\n[View the interactive element on Signal](${pageUrl.href})\n\n`,
  );

  const rendered = marked.parse(feedMarkdown, {
    async: false,
    gfm: true,
  }) as string;

  const safe = sanitizeHtml(rendered, {
    allowedTags: [
      "p", "br", "strong", "em", "del", "blockquote", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6", "a", "img", "pre", "code",
      "hr", "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "title", "width", "height"],
      code: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  return absolutizeHtmlUrls(safe, pageUrl);
}

export function absolutizeHtmlUrls(html: string, baseUrl: URL) {
  return html.replace(/\b(href|src)="([^"]+)"/g, (_match, attribute, value) => {
    if (value.startsWith("#") || value.startsWith("mailto:")) {
      return `${attribute}="${value}"`;
    }
    return `${attribute}="${new URL(value, baseUrl).href}"`;
  });
}
