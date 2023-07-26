/* eslint-disable no-console */

import ArticlePublisher from '../services/ArticlePublisher';
import WorkPublisher from '../services/WorkPublisher';
import PagePublisher from '../services/PagePublisher';
import StaticPublisher from '../services/StaticPublisher';

const args: string[] = process.argv.slice(2);
const target: string = args[0];
const mode: string = args[1];

export function publishArticle(article: string) {
  console.log('\x1b[36m%s\x1b[0m', 'Run ArticlePublisher...');
  if (!article || article === 'all') {
    console.log('Publish all articles: ArticlePublisher.publishArticles()');
    ArticlePublisher.publishArticles();

    console.log('Publish sitemap: StaticPublisher.publishSitemap()');
    StaticPublisher.publishSitemap();

    console.log('Publish rss: StaticPublisher.publishRSS()');
    StaticPublisher.publishRSS();

    console.log('\x1b[36m%s\x1b[0m', 'Done!');
  } else if (!Number.isNaN(Number(article))) {
    const id = Number(article);
    console.log(`Publish article #${id}: ArticlePublisher.publishArticles(${id})`);
    ArticlePublisher.publishArticles(id);

    console.log('Publish sitemap: StaticPublisher.publishSitemap()');
    StaticPublisher.publishSitemap();

    console.log('Publish rss: StaticPublisher.publishRSS()');
    StaticPublisher.publishRSS();

    console.log('\x1b[36m%s\x1b[0m', 'Done!');
  } else {
    console.log('\x1b[31m%s\x1b[0m', `ERR! Unknown article '${article}'.`);
  }
}

switch (target) {
  case 'article':
    publishArticle(mode);
    break;

  case 'work':
    console.log('\x1b[36m%s\x1b[0m', 'Run WorkPublisher...');

    if (!mode || mode === 'all') {
      console.log('Publish all works: WorkPublisher.publishAllWorks()');
      WorkPublisher.publishAllWorks();

      console.log('Publish sitemap: StaticPublisher.publishSitemap()');
      StaticPublisher.publishSitemap();

      console.log('\x1b[36m%s\x1b[0m', 'Done!');
    } else {
      console.log('\x1b[31m%s\x1b[0m', `ERR! Unknown mode '${mode}'.`);
    }
    break;

  case 'page':
    console.log('\x1b[36m%s\x1b[0m', 'Run PagePublisher...');

    console.log('Publish all pages: PagePublisher.publishAbout()');
    PagePublisher.publishIndex();
    PagePublisher.publishAbout();
    break;

  default:
    console.log('\x1b[31m%s\x1b[0m', `ERR! Unknown target '${target}'.`);
}

console.log('');
