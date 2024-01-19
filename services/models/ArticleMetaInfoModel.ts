interface ArticleMetaInfoModel {
  id: number;

  title: string;

  subtitle?: string;

  date: string;

  filename: string;

  hidden?: boolean;
}

export default ArticleMetaInfoModel;
