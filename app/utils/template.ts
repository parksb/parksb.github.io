import { Document } from "@simpesys/core";
import vento from "vento";
import { BASE_URL, THUMBNAIL_BASE_URL } from "./consts.ts";
import { minify } from "@minify-html/deno";

const dirname = new URL(".", import.meta.url).pathname;

const ventoEnv = vento();

export enum Template {
  Index = "index",
  Article = "article",
  Work = "work",
}

export const mapTemplate = (document: Document): Template => {
  if (document.filename.startsWith("article/")) {
    return Template.Article;
  }

  if (document.filename.startsWith("work/")) {
    return Template.Work;
  }

  return Template[document.filename as keyof typeof Template] || Template.Index;
};

export const render = async (
  document: Document,
  template: Template,
  styles: string,
) => {
  const ventoTemplate = await ventoEnv.load(
    `${dirname}/../templates/${template}.vto`,
  );

  const result = await ventoTemplate({
    title: title(document),
    content: content(document),
    description: description(document),
    url: url(document),
    thumbnail: thumbnail(document),
    date: date(document),
    styles,
  });

  return new TextDecoder().decode(
    minify(new TextEncoder().encode(result.content), {
      minify_css: true,
      minify_js: true,
    }),
  );
};

const title = (document: Document) => {
  return document.title
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const content = (document: Document) => {
  const timeTag = document.createdAt
    ? (() => {
      const isoDate = document.createdAt.toZonedDateTimeISO("Asia/Seoul")
        .toPlainDate().toString();
      return `<time datetime="${isoDate}">${isoDate.replace(/-/g, ".")}</time>`;
    })()
    : "";

  let content = document.html
    .replace(/<!--\s*section:(\w+)\s*-->/g, '<section class="$1">')
    .replace(/<!--\s*\/section:\w+\s*-->/g, "</section>");

  const template = mapTemplate(document);
  if (
    timeTag && (template === Template.Article || template === Template.Work)
  ) {
    const hasH2 = /<h2[^>]*>/.test(content);
    if (hasH2) {
      content = content.replace(/(<\/h2>)/, ` ${timeTag}$1`);
    } else {
      content = content.replace(/(<\/h1>)/, ` ${timeTag}$1`);
    }
  }

  return content;
};

export const description = (document: Document) => {
  const bodyHtml = document.html
    .replace(/<h[12][^>]*>.*?<\/h[12]>/g, "")
    .replace(/<div class="table-of-contents">.*?<\/div>/gs, "");

  const plainText = bodyHtml.replace(/<[^>]*>/g, "").replace(/\s+/g, " ")
    .trim();

  return `${plainText.slice(0, 300)}...`;
};

const url = (document: Document) => {
  return document.filename === "index"
    ? `${BASE_URL}/`
    : `${BASE_URL}/${document.filename}.html`;
};

const date = (document: Document) => {
  return document.createdAt
    ?.toZonedDateTimeISO("Asia/Seoul")
    .toPlainDate()
    .toString();
};

const thumbnail = (document: Document) => {
  const h2Match = document.markdown.match(/^##\s+(.+)$/m);
  const subtitle = h2Match?.[1]?.trim();

  const encodedTitle = encodeURIComponent(title(document));
  const encodedSubtitle = subtitle ? encodeURIComponent(subtitle) : "";

  const dateISO = date(document);
  const encodedDate = dateISO ? encodeURIComponent(dateISO) : "";

  const template = mapTemplate(document);
  if (template === Template.Index) {
    return `${THUMBNAIL_BASE_URL}?title=%EB%B0%95%EC%84%B1%EB%B2%94%20Simon%20Park&subtitle=%E2%80%95%20parksb.github.io`;
  } else if (template === Template.Article || template === Template.Work) {
    return `${THUMBNAIL_BASE_URL}?title=${encodedTitle}&subtitle=${encodedSubtitle}&date=${encodedDate}`;
  }

  return "";
};
