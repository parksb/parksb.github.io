import fs from 'fs';
import path from 'path';
import juice from 'juice';

const DIST: string = path.resolve('dist');

function inline(htmlFilename: string, cssFilename: string) {
  const html = fs.readFileSync(`${DIST}/${htmlFilename}.html`).toString();
  const css = fs.readFileSync(`${DIST}/styles/${cssFilename}.css`).toString();
  fs.writeFileSync(`${DIST}/${htmlFilename}.html`, juice.inlineContent(html, css, { inlinePseudoElements: true }));
}

['index', 'about', 'articles', 'works'].forEach((html) => {
  let css = html;
  if (html === 'about') css = 'index';
  inline(html, css);
});

['article', 'work'].forEach((x) => {
  fs.readdirSync(`${DIST}/${x}`).forEach((filename) => {
    inline(`${x}/${filename.replace(/\.html$/, '')}`, x);
  });
});
