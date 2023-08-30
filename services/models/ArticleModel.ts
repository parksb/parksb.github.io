import ArticleMetaInfoModel from './ArticleMetaInfoModel';

interface ArticleModel extends ArticleMetaInfoModel {
  content: string;

  summary: string;

  encodedTitle: string;

  encodedSubtitle?: string;

  encodedDate?: string;
}

export default ArticleModel;
