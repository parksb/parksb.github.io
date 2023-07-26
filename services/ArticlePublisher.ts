/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

import MarkdownIt from 'markdown-it';
import * as katex from 'katex';
import highlightJs from 'highlight.js';
import mdFootnote from 'markdown-it-footnote';
import mdTex from 'markdown-it-texmath';
import mdAnchor from 'markdown-it-anchor';
import mdTableOfContents from 'markdown-it-table-of-contents';
import mdContainer from 'markdown-it-container';
import mdInlineComment from 'markdown-it-inline-comments';
import mdLazyImage from 'markdown-it-image-lazy-loading';
import mdMermaid from 'markdown-it-mermaid';

import PagePublisher from './PagePublisher';
import ArticleMetaInfo from './classes/ArticleMetaInfo';
import Article from './classes/Article';
import ArticleModel from './models/ArticleModel';

class ArticlePublisher {
  static ARTICLE_ORIGIN_PATH: string = path.join(__dirname, '../_articles');

  static ARTICLE_DIST_PATH: string = path.join(__dirname, '../app/public/article');

  static ARTICLE_TEMPLATE: Buffer = fs.readFileSync(path.join(__dirname, '../app/templates/article.ejs'));

  static INDEX_DIST_PATH: string = path.join(__dirname, '../app/public');

  static INDEX_TEMPLATE: Buffer = fs.readFileSync(path.join(__dirname, '../app/templates/index.ejs'));

  static IGNORED_FILES: string[] = ['.DS_Store'];

  static md: MarkdownIt = new MarkdownIt({
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
    highlight: (str, language) => {
      if (language && highlightJs.getLanguage(language)) {
        return `<pre class="hljs"><code>${highlightJs.highlight(str, { language }).value}</code></pre>`;
      }
      return `<pre class="hljs"><code>${ArticlePublisher.md.utils.escapeHtml(str)}</code></pre>`;
    },
  }).use(mdFootnote)
    .use(mdInlineComment)
    .use(mdMermaid)
    .use(mdTex.use(katex), {
      delimiters: 'dollars',
    })
    .use(mdAnchor)
    .use(mdTableOfContents, {
      includeLevel: [1, 2, 3],
    })
    .use(mdContainer, 'toggle', {
      validate(params) {
        return params.trim().match(/^toggle\((.*)\)$/);
      },
      render(tokens, idx) {
        const content = tokens[idx].info.trim().match(/^toggle\((.*)\)$/);
        if (tokens[idx].nesting === 1) {
          return `<details><summary>${ArticlePublisher.md.utils.escapeHtml(content[1])}</summary>\n`;
        }
        return '</details>\n';
      },
    })
    .use(mdLazyImage, {
      decoding: true,
      image_size: true,
      base_path: path.join(__dirname, '../'),
    });

  private static extractContent(text: string): string {
    return text.replace(/(-{3})([\s\S]+?)(\1)/, '');
  }

  public static getArticleByFilename(filename: string) {
    const mdContent: Buffer = fs.readFileSync(`${this.ARTICLE_ORIGIN_PATH}/${filename}`);
    const mdContentWithToc = `::: toggle(Table of Contents)\n[[toc]]\n:::\n${mdContent}`;
    const htmlContent: string = this.md.render(this.extractContent(mdContentWithToc));
    const metaInfo: ArticleMetaInfo = this.extractMetaInfo(String(mdContent));

    return new Article(
      metaInfo.getId(),
      metaInfo.getTitle(),
      metaInfo.getSubtitle(),
      metaInfo.getDate(),
      htmlContent,
      filename,
    );
  }

  public static extractMetaInfo(text: string): ArticleMetaInfo {
    const metaInfo: ArticleMetaInfo = new ArticleMetaInfo();
    const metaInfoLines: string[] = text.match(/(-{3})([\s\S]+?)(\1)/)[2]
      .match(/[^\r\n]+/g);

    if (!metaInfoLines) {
      return null;
    }

    metaInfoLines.forEach((metaInfoLine: string) => {
      const kvp: string[] = metaInfoLine.match(/(.+?):(.+)/);

      if (kvp) {
        const key: string = kvp[1].replace(/\s/g, '');
        const value: string = kvp[2].replace(/['"]/g, '').trim();

        metaInfo.setProp(key, value);
      }
    });

    return metaInfo;
  }

  public static getArticleMarkdownFiles() {
    return fs.readdirSync(this.ARTICLE_ORIGIN_PATH)
      .filter((file) => !this.IGNORED_FILES.includes(file));
  }

  public static publishArticles(id?: number) {
    const articleFiles: string[] = ArticlePublisher.getArticleMarkdownFiles();

    const distArticles: ArticleModel[] = articleFiles.map((articleFile: string, index: number) => {
      const article = ArticlePublisher.getArticleByFilename(articleFile).getArticle();
      const nextArticle = articleFiles[index + 1]
        && ArticlePublisher.getArticleByFilename(articleFiles[index + 1]).getArticle();
      const prevArticle = articleFiles[index - 1]
          && ArticlePublisher.getArticleByFilename(articleFiles[index - 1]).getArticle();

      if (id) {
        if (article.id === id) {
          console.log(`* ${article.id}: ${article.title}`);
          fs.writeFileSync(
            `${this.ARTICLE_DIST_PATH}/${article.id}.html`,
            ejs.render(String(this.ARTICLE_TEMPLATE), {
              article,
              nextArticle,
              prevArticle,
            }),
          );
        }

        return article;
      }

      fs.writeFileSync(
        `${this.ARTICLE_DIST_PATH}/${article.id}.html`,
        ejs.render(String(this.ARTICLE_TEMPLATE), {
          article,
          nextArticle,
          prevArticle,
        }),
      );

      console.log(`* ${article.id}: ${article.title}`);
      return article;
    });

    PagePublisher.publishArticles(distArticles);
  }
}

export default ArticlePublisher;
