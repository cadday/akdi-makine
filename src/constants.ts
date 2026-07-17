export const LOCALES = ["de", "en", "fr", "es", "ar"] as const;
export type LocaleOption = (typeof LOCALES)[number];

export const THEME_OPTIONS = {
  PURPLE: "theme-purple",
  BLUE: "theme-blue",
  GREEN: "theme-green",
  ORANGE: "theme-orange",
} as const;

export type ThemeVariant = (typeof THEME_OPTIONS)[keyof typeof THEME_OPTIONS];

export type ModeVariant = (typeof THEME_MODE_OPTIONS)[number];
export const THEME_MODE_OPTIONS = ["light", "dark", "system"] as const;

const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX || "";
export const COOKIE_KEYS = { locale: `${storagePrefix}-locale` };

export const LOCAL_STORAGE_KEYS = {
  themeColor: `${storagePrefix}-theme-color`,
  themeMode: `${storagePrefix}-theme-mode`,
  leftMenuType: `${storagePrefix}-left-menu-type`,
  contentType: `${storagePrefix}-content-type`,
};

export const LINKS = {
  figma:
    "https://www.figma.com/design/we8zcbO9TjdXbah8DNj0xd/prod-gogo-design-8.3.0?node-id=9242-145711&t=oVUL1I0Mj6Rgdlf9-4",
  purchase: "https://themeforest.net/cart/configure_before_adding/22544383?license=regular",
  purchase_extended: "https://themeforest.net/cart/configure_before_adding/22544383?license=extended",
  docs: "/docs/welcome/introduction",
  view: "/auth/sign-in",
  signup: "/auth/sign-up",
  login: "/auth/sign-in",
  components: "/ui",
  dashboard: "/dashboards/default",
} as const;
