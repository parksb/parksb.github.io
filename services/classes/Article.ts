import ArticleModel from '../models/ArticleModel';
import ArticleMetaInfo from './ArticleMetaInfo';
import escapeHTML from '../utils/escapeHTML';

class Article extends ArticleMetaInfo {
  article: ArticleModel;

  constructor(
    id: number,
    title: string,
    subtitle: string,
    date: string,
    content: string,
    filename: string,
  ) {
    super();
    const SUMMARY_LENGTH = 180;
    this.article = {
      id,
      title,
      encodedTitle: encodeURI(title),
      subtitle,
      encodedSubtitle: subtitle ? encodeURI(subtitle) : undefined,
      encodedDate: encodeURI(date),
      date,
      filename,
      content,
      summary: `${escapeHTML(content).slice(0, SUMMARY_LENGTH)}...`,
    };
  }

  getArticle(): ArticleModel {
    return this.article;
  }

  getContent(): string {
    return this.article.content;
  }
}

export default Article;
