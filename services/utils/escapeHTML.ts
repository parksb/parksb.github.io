export default function escapeHTML(html: string) {
  return html.replace(/^<details><summary>Table\sof\sContents<\/summary>(.|\n)*<\/details>/, '')
    .replace(/<[^>]*>?|\n/gm, '')
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}
