import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import ArticleModel from './models/ArticleModel';
import WorkModel from './models/WorkModel';

class PagePublisher {
  public static publishPage(page?: 'index' | 'about') {
    switch (page) {
      case 'index':
        PagePublisher.publishIndex();
        break;
      case 'about':
        PagePublisher.publishAbout();
        break;
      default:
        PagePublisher.publishIndex();
        PagePublisher.publishAbout();
    }
  }

  public static publishIndex() {
    const TEMPLATE: Buffer = fs.readFileSync(path.resolve('app/templates/index.ejs'));
    const DIST_PATH: string = path.resolve('app/public/index.html');
    fs.writeFileSync(DIST_PATH, ejs.render(String(TEMPLATE)));
  }

  public static publishAbout() {
    const TEMPLATE: Buffer = fs.readFileSync(path.resolve('app/templates/about.ejs'));
    const DIST_PATH: string = path.resolve('app/public/about.html');
    fs.writeFileSync(DIST_PATH, ejs.render(String(TEMPLATE)));
  }

  public static publishArticles(articles: ArticleModel[]) {
    const TEMPLATE: Buffer = fs.readFileSync(path.resolve('app/templates/articles.ejs'));
    const DIST_PATH: string = path.resolve('app/public/articles.html');
    fs.writeFileSync(DIST_PATH, ejs.render(String(TEMPLATE), { articles }));
  }

  public static publishWorks(works: WorkModel[]) {
    const TEMPLATE: Buffer = fs.readFileSync(path.resolve('app/templates/works.ejs'));
    const DIST_PATH: string = path.resolve('app/public/works.html');
    fs.writeFileSync(DIST_PATH, ejs.render(String(TEMPLATE), { works }));
  }
}

export default PagePublisher;
