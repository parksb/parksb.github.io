import ArticleMetaInfoModel from './ArticleMetaInfoModel';

interface ArticleModel extends ArticleMetaInfoModel {
  content: string;

  summary: string;

  encodedTitle: string;

  encodedSubtitle?: string;

  encodedDescription?: string;
}

export default ArticleModel;
