import Cookies from "js-cookie";

import { COOKIE_KEYS, LocaleOption } from "@/constants";
import i18n from "@/i18n/i18n";

// Prefer the saved locale, then the browser preference.
export function getClientLocale(): LocaleOption {
  const savedLocale = Cookies.get(COOKIE_KEYS.locale);
  if (savedLocale) return savedLocale as LocaleOption;

  const preferredLocales = typeof navigator === "undefined" ? [] : [...navigator.languages, navigator.language];
  return preferredLocales.some((locale) => locale.toLowerCase().startsWith("tr")) ? "tr" : "en";
}

// Set client locale in cookie
export function setClientLocale(locale: LocaleOption) {
  i18n.changeLanguage(locale);
  Cookies.set(COOKIE_KEYS.locale, locale, { sameSite: "lax", expires: 365 });
}
