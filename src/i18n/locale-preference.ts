import Cookies from "js-cookie";
import { COOKIE_KEYS, type LocaleOption } from "@/constants";

export function getClientLocale(): LocaleOption {
  const savedLocale = Cookies.get(COOKIE_KEYS.locale);
  if (savedLocale) return savedLocale as LocaleOption;

  const preferredLocales = typeof navigator === "undefined" ? [] : [...navigator.languages, navigator.language];
  return preferredLocales.some((locale) => locale.toLowerCase().startsWith("tr")) ? "tr" : "en";
}