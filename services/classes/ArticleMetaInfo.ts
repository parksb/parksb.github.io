import ArticleMetaInfoModel from '../models/ArticleMetaInfoModel';

class ArticleMetaInfo implements ArticleMetaInfoModel {
  id: number;

  title: string;

  subtitle?: string;

  date: string;

  filename: string;

  hidden?: boolean;

  setProp(name: string, value: any) {
    switch (name) {
      case 'id':
        this.id = Number(value);
        break;

      case 'title':
      case 'subtitle':
      case 'date':
      case 'filename':
        this[name] = value;
        break;

      case 'hidden':
        this.hidden = Boolean(value);
        break;

      default:
        throw new Error(`Unkown property '${name}'.`);
    }
  }

  getId(): number {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getSubtitle(): string {
    return this.subtitle;
  }

  getDate(): string {
    return this.date;
  }

  getFilename(): string {
    return this.filename;
  }

  getHidden(): boolean {
    return this.hidden || false;
  }
}

export default ArticleMetaInfo;
