/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import MarkdownIt from 'markdown-it';
import mdLazyImage from 'markdown-it-image-lazy-loading';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

import WorkMetaInfo from './classes/WorkMetaInfo';
import Work from './classes/Work';
import WorkModel from './models/WorkModel';
import PagePublisher from './PagePublisher';

class WorkPublisher {
  static WORK_ORIGIN_PATH: string = path.join(__dirname, '../_works');

  static WORK_DIST_PATH: string = path.join(__dirname, '../app/public/work');

  static WORK_TEMPLATE: Buffer = fs.readFileSync(path.join(__dirname, '../app/templates/work.ejs'));

  static md: MarkdownIt = new MarkdownIt({
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
  }).use(mdLazyImage, {
    decoding: true,
    image_size: true,
    base_path: path.join(__dirname, '../'),
  });

  private static extractContent(text: string): string {
    return text.replace(/(-{3})([\s\S]+?)(\1)/, '');
  }

  private static extractMetaInfo(text: string): WorkMetaInfo {
    const metaInfo: WorkMetaInfo = new WorkMetaInfo();
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

        metaInfo.setMetaInfoProp(key, value);
      }
    });

    return metaInfo;
  }

  public static getWorkByFilename(id: number, filename: string) {
    const mdContent: Buffer = fs.readFileSync(`${this.WORK_ORIGIN_PATH}/${filename}`);
    const htmlContent: string = this.md.render(this.extractContent(String(mdContent)));
    const metaInfo: WorkMetaInfo = this.extractMetaInfo(String(mdContent));

    return new Work({
      id,
      title: metaInfo.getTitle(),
      subtitle: metaInfo.getSubtitle(),
      thumbnail: metaInfo.getThumbnail(),
      content: htmlContent,
    });
  }

  public static getWorkMarkdownFiles() {
    return fs.readdirSync(this.WORK_ORIGIN_PATH);
  }

  public static publishAllWorks() {
    const workFiles: string[] = WorkPublisher.getWorkMarkdownFiles();

    const distWorks: WorkModel[] = workFiles.map((workFile: string, idx: number) => {
      const work = WorkPublisher.getWorkByFilename(idx, workFile).getWork();

      fs.writeFileSync(
        `${this.WORK_DIST_PATH}/${idx}.html`,
        ejs.render(String(this.WORK_TEMPLATE), work),
      );

      console.log(`* ${idx}: ${work.title}`);
      return work;
    });

    PagePublisher.publishWorks(distWorks);
  }
}

export default WorkPublisher;
