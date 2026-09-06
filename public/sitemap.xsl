<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - Mustafa Lakhsem</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #060913;
            color: #f8fafc;
            padding: 40px 20px;
            margin: 0;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: #0d1629;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(212, 175, 55, 0.25);
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          h1 {
            color: #d4af37;
            margin: 0;
            font-size: 24px;
            font-weight: 800;
          }
          p.subtitle {
            color: #94a3b8;
            font-size: 14px;
            margin: 4px 0 0 0;
          }
          .badge {
            background: rgba(212, 175, 55, 0.15);
            color: #fbbf24;
            border: 1px solid rgba(212, 175, 55, 0.4);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          th {
            background-color: #060913;
            color: #d4af37;
            text-align: left;
            padding: 12px 16px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          td {
            padding: 14px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 14px;
          }
          tr:hover td {
            background-color: rgba(255, 255, 255, 0.03);
          }
          a {
            color: #60a5fa;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
            color: #93c5fd;
          }
          .priority {
            font-weight: bold;
            color: #34d399;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>XML Sitemap</h1>
              <p class="subtitle">Generated automatically for search engines &amp; human view</p>
            </div>
            <div class="badge">
              Total Links: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th width="50%">URL</th>
                <th width="20%">Priority</th>
                <th width="15%">Change Freq</th>
                <th width="15%">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="priority"><xsl:value-of select="sitemap:priority"/></span>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
