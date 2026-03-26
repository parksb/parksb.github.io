import { type Document, type DocumentDict, Simpesys } from "@simpesys/core";
import mdLazyImage from "markdown-it-image-lazy-loading";
import * as sass from "sass";
import { feed, sitemap } from "./utils/metadata.ts";
import { mapTemplate, render, Template } from "./utils/template.ts";
import { logger } from "./utils/logger.ts";

const dirname = new URL(".", import.meta.url).pathname;

logger.info("init system...");
const initStartTime = performance.now();
const simpesys = await new Simpesys({
  docs: {
    backlinksSectionTitle: null,
    subdocumentsSectionTitle: ["ARTICLES", "PROJECTS"],
    toc: {
      levels: [3, 4],
      marker: {
        default: null,
        pattern: /^::: TOC :::$/im,
      },
    },
  },
  hooks: {
    manipulateMarkdown: (markdown) => {
      return markdown.replace(
        /^# (.+?)\s*--\s*(.+)$/gm,
        (_, title, subtitle) => `# ${title.trim()} <span>-- ${subtitle}</span>`,
      );
    },
    configureMarkdownConverter: (md) => {
      md.use(mdLazyImage, {
        decoding: true,
        image_size: true,
        base_path: `${dirname}/../`,
        exclude_extensions: [".mp4"],
        skip_count: 1,
        max_width: 800,
      });
    },
    renderInternalLink: (key: string, label?: string) =>
      `<a href="/${key}.html">${label ?? key}</a>`,
  },
}).init({ syncMetadata: true });
logger.success(
  `loaded ${Object.keys(simpesys.getDocuments()).length} documents in ${
    (
      performance.now() - initStartTime
    ).toFixed(2)
  }ms`,
);

const compileStyles = (template: Template): string =>
  sass.compile(`${dirname}/styles/${template}.scss`).css;

const renderTemplate = async (document: Document, template: Template) => {
  const styles = compileStyles(template);
  const content = await render(document, template, styles);

  await Deno.mkdir(`${dirname}/../build`, { recursive: true });
  await Deno.mkdir(`${dirname}/../build/article`, { recursive: true });
  await Deno.mkdir(`${dirname}/../build/work`, { recursive: true });
  await Deno.writeTextFile(
    `${dirname}/../build/${document.filename}.html`,
    content,
  );
};

const buildSitemap = async (documents: DocumentDict) => {
  // if (Deno.env.get("ENV") !== "production") return;
  const content = sitemap(documents);
  await Deno.writeTextFile(`${dirname}/../build/sitemap.xml`, content);
};

const buildFeed = async (documents: DocumentDict) => {
  // if (Deno.env.get("ENV") !== "production") return;
  const content = feed(documents);
  await Deno.writeTextFile(`${dirname}/../build/feed.xml`, content);
};

const copyImages = async () => {
  await Deno.mkdir(`${dirname}/../build/images`, { recursive: true });
  for await (const entry of Deno.readDir(`${dirname}/../images`)) {
    if (entry.isFile) {
      await Deno.copyFile(
        `${dirname}/../images/${entry.name}`,
        `${dirname}/../build/images/${entry.name}`,
      );
    }
  }
};

const copyStaticFiles = async (
  srcDir = `${dirname}/../static`,
  destDir = `${dirname}/../build`,
) => {
  await Deno.mkdir(destDir, { recursive: true });
  for await (const entry of Deno.readDir(srcDir)) {
    const srcPath = `${srcDir}/${entry.name}`;
    const destPath = `${destDir}/${entry.name}`;

    if (entry.isFile) {
      await Deno.copyFile(srcPath, destPath);
    } else if (entry.isDirectory) {
      await copyStaticFiles(srcPath, destPath);
    }
  }
};

const main = async () => {
  const documents = simpesys.getDocuments();

  await Promise.all([
    copyStaticFiles(),
    buildSitemap(documents),
    buildFeed(documents),
    copyImages(),
    ...(Object.values(documents) as Document[]).map((document) =>
      renderTemplate(document, mapTemplate(document)).then(() =>
        logger.info(
          `rendered ${document.filename}.md for ${
            document.title.replace(/<.*>/g, "")
          }`,
        )
      )
    ),
  ]);
};

logger.info("building...");
const buildStartTime = performance.now();
await main();
logger.success(
  `build completed in ${(performance.now() - buildStartTime).toFixed(2)}ms`,
);
