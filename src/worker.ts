import { handle } from "@astrojs/cloudflare/handler";
import signalConfig from "../signal.config.json";
import { guardSecureSignal } from "./lib/security";

type SignalWorkerEnvironment = {
  ASSETS: Fetcher;
  SIGNAL_PASSWORDS?: string;
  SIGNAL_SESSION_SECRET?: string;
};

const standaloneSlugs = new Set<string>([
  ...(signalConfig.publicHtml ?? []),
  ...(signalConfig.secureHtml ?? []),
]);
const secureSlugs = new Set<string>(signalConfig.secureHtml ?? []);

export default {
  async fetch(request, env, context) {
    const guardedResponse = await guardSecureSignal(request, env, secureSlugs);
    if (guardedResponse) return guardedResponse;

    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length === 1 && standaloneSlugs.has(parts[0]) && url.pathname.endsWith("/")) {
      url.pathname = `${url.pathname}index.html`;
      request = new Request(url, request) as unknown as typeof request;
    }

    const slug = url.pathname.split("/").filter(Boolean)[0];
    const assetResponse = await env.ASSETS.fetch(request);
    const response = assetResponse.status === 404
      ? await handle(request, env, context)
      : assetResponse;

    if (slug && secureSlugs.has(slug)) {
      const privateResponse = new Response(response.body, response);
      privateResponse.headers.set("cache-control", "private, no-store");
      privateResponse.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
      return privateResponse;
    }

    return response;
  },
} satisfies ExportedHandler<SignalWorkerEnvironment>;
