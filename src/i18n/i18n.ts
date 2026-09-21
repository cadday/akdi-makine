import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { getClientLocale } from "@/i18n/locale";
import en from "@/i18n/messages/en.json";
import tr from "@/i18n/messages/tr.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: getClientLocale(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
