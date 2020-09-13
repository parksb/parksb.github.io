interface ArticleMetaInfoModel {
  id: number;

  title: string;

  subtitle?: string;

  date: string;

  tags: string | string[];

  filename: string;
}

export default ArticleMetaInfoModel;
