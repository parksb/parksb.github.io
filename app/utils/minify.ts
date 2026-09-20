import { minify } from "@minify-html/wasm";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const minifyHtml = (html: string): string =>
  decoder.decode(
    minify(encoder.encode(html), {
      minify_css: true,
      minify_js: true,
    }),
  );
