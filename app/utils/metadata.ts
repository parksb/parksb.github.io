import { DocumentDict } from "@simpesys/core";
import { BASE_URL } from "./consts.ts";
import { description, mapTemplate, Template } from "./template.ts";

export const sitemap = (documents: DocumentDict) => {
  const urls = Object.values(documents).map((doc) => {
    const loc = mapTemplate(doc) === Template.Index
      ? `${BASE_URL}/`
      : `${BASE_URL}/${doc.filename}.html`;

    const lastmod = doc.updatedAt
      ?.toZonedDateTimeISO("Asia/Seoul")
      .toPlainDate()
      .toString();

    return `<url><loc>${escape(loc)}</loc>${
      lastmod ? `<lastmod>${lastmod}</lastmod>` : ""
    }</url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join("\n")}
</urlset>`;
};

export const feed = (documents: DocumentDict) => {
  const now = Temporal.Now.zonedDateTimeISO("UTC");

  const items = Object.values(documents)
    .filter((doc) => mapTemplate(doc) === Template.Article)
    .sort((a, b) => {
      const aTime = a.createdAt?.epochMilliseconds ?? 0;
      const bTime = b.createdAt?.epochMilliseconds ?? 0;
      return bTime - aTime;
    })
    .map((doc) => {
      const link = mapTemplate(doc) === Template.Index
        ? `${BASE_URL}/`
        : `${BASE_URL}/${doc.filename}.html`;

      const pubDate = toRFC822(
        doc.createdAt?.toZonedDateTimeISO("Asia/Seoul") ?? now,
      );

      return `<item>
<title>${escape(doc.title)}</title>
<link>${escape(link)}</link>
<guid>${escape(link)}</guid>
<description>${escape(description(doc))}</description>
<pubDate>${pubDate}</pubDate>
</item>`;
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>박성범 Simon Park</title>
<link>${BASE_URL}/</link>
<atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
<description>Recently published articles</description>
<language>ko-kr</language>
<lastBuildDate>${toRFC822(now)}</lastBuildDate>
${items.join("\n")}
</channel>
</rss>`;
};

const toRFC822 = (zdt: Temporal.ZonedDateTime): string => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${days[zdt.dayOfWeek - 1]}, ${pad(zdt.day)} ${
    months[zdt.month - 1]
  } ${zdt.year} ${pad(zdt.hour)}:${pad(zdt.minute)}:${pad(zdt.second)} GMT`;
};

const escape = (str: string): string =>
  str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
