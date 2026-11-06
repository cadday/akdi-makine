import Cookies from "js-cookie";
import { COOKIE_KEYS, type LocaleOption } from "@/constants";
import i18n from "@/i18n/i18n";
export { getClientLocale } from "./locale-preference";

// Set client locale in cookie
export function setClientLocale(locale: LocaleOption) {
  i18n.changeLanguage(locale);
  Cookies.set(COOKIE_KEYS.locale, locale, { sameSite: "lax", expires: 365 });
}
