import { Document } from "@simpesys/core";
import { BASE_URL } from "./consts.ts";

interface Alternate {
  hreflang: string;
  href: string;
}

export const DEFAULT_LOCALE = "ko";
const LOCALES = ["ko", "en"] as const;
type Locale = (typeof LOCALES)[number];

const prefixOf = (locale: Locale) =>
  locale === DEFAULT_LOCALE ? "" : `${locale}/`;

export const localeOf = (key: string): Locale =>
  LOCALES.find((locale) =>
    prefixOf(locale) && key.startsWith(prefixOf(locale))
  ) ?? DEFAULT_LOCALE;

const baseKey = (key: string): string =>
  key.slice(prefixOf(localeOf(key)).length);

const localeKey = (base: string, locale: Locale): string =>
  `${prefixOf(locale)}${base}`;

const pathOf = (key: string): string =>
  key === "index" ? "/" : `/${key}.html`;

export const urlOf = (key: string): string => `${BASE_URL}${pathOf(key)}`;

export const homeHrefOf = (key: string): string =>
  pathOf(localeKey("index", localeOf(key)));

export const alternatesOf = (document: Document): Alternate[] => {
  const lang = localeOf(document.filename);
  const base = baseKey(document.filename);

  const linksTo = (key: string) =>
    new RegExp(`\\[\\[(\\.\\.\\/)*${key}\\]\\]`).test(document.markdown);

  const translated = LOCALES.filter((locale) =>
    locale === lang || linksTo(localeKey(base, locale))
  );

  return translated.length > 1
    ? [
      ...translated.map((locale) => ({
        hreflang: locale,
        href: urlOf(localeKey(base, locale)),
      })),
      { hreflang: "x-default", href: urlOf(localeKey(base, DEFAULT_LOCALE)) },
    ]
    : [];
};
