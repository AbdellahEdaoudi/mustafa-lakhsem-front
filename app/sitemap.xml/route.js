export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mustafa-lakhsem.vercel.app";
  const languages = ["ar", "en", "fr", "de", "nl", "es", "it"];
  const lastModified = "2026-09-06";

  const routes = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified,
    priority: lang === "ar" || lang === "en" || lang === "fr" ? "1.0" : "0.9",
    changeFreq: "weekly",
  }));

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFreq}</changefreq>
    <priority>${route.priority}</priority>
${languages
  .map(
    (lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}/${lang}" />`
  )
  .join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en" />
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xmlContent, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
