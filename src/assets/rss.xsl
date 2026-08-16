<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="rss/channel/title" /> — RSS</title>
        <style>
          :root { color-scheme: light dark; font-family: ui-sans-serif, system-ui, sans-serif; }
          body { max-width: 46rem; margin: 0 auto; padding: 3rem 1.25rem 5rem; line-height: 1.55; }
          header { margin-bottom: 3rem; }
          h1 { margin: 0 0 .5rem; font-size: clamp(2rem, 6vw, 4rem); letter-spacing: -.04em; }
          p { color: color-mix(in srgb, CanvasText 70%, transparent); }
          ol { padding: 0; list-style: none; }
          li { padding: 1.25rem 0; border-top: 1px solid color-mix(in srgb, CanvasText 16%, transparent); }
          a { color: inherit; }
          h2 { margin: 0 0 .35rem; font-size: 1.15rem; }
          time { font: .75rem ui-monospace, monospace; opacity: .6; }
          .subscribe { display: inline-block; margin-top: 1rem; }
        </style>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="rss/channel/title" /></h1>
          <p><xsl:value-of select="rss/channel/description" /></p>
          <p class="subscribe">This is an RSS feed. Copy this page’s URL into your feed reader to subscribe.</p>
        </header>
        <ol>
          <xsl:for-each select="rss/channel/item">
            <li>
              <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
              <time><xsl:value-of select="pubDate" /></time>
              <p><xsl:value-of select="description" /></p>
            </li>
          </xsl:for-each>
        </ol>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
