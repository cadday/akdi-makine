import { MenuItem } from "@/types/types";

export const leftMenuItems: MenuItem[] = [
  {
    id: "overview",
    icon: "presentation",
    label: "menu-overview",
    color: "text-primary",
    href: "/dashboards/default",
  },
  {
    id: "tests",
    icon: "flask-conical",
    label: "menu-tests",
    color: "text-primary",
    href: "/tests",
  },
  {
    id: "specimens",
    icon: "drafting-compass",
    label: "menu-specimens",
    color: "text-primary",
    href: "/specimens",
  },
  {
    id: "presets",
    icon: "sliders-vertical",
    label: "menu-presets",
    color: "text-primary",
    href: "/presets",
  },
  
];

export const leftMenuBottomItems: MenuItem[] = [
  {
    id: "data-fields",
    label: "menu-data-fields",
    href: "/docs",
    icon: "network",
    color: "text-primary",
    children: [
      {
        id: "docs-welcome",
        label: "menu-welcome",
        href: "/docs/welcome",
        hideInMenu: true,
        children: [
          {
            id: "docs-introduction",
            label: "docs-introduction",
            href: "/docs/welcome/introduction",
          },
          {
            id: "docs-faq",
            label: "docs-faq",
            href: "/docs/welcome/faq",
          },
          {
            id: "docs-changelog",
            label: "docs-changelog",
            href: "/docs/welcome/changelog",
          },
        ],
      },
      {
        id: "docs-getting-started",
        label: "docs-getting-started",
        href: "/docs/getting-started",
        hideInMenu: true,
        children: [
          {
            id: "docs-installation",
            label: "docs-installation",
            href: "/docs/getting-started/installation",
          },
          {
            id: "docs-file-structure",
            label: "docs-file-structure",
            href: "/docs/getting-started/file-structure",
          },
          {
            id: "docs-routing-and-menu",
            label: "docs-routing-and-menu",
            href: "/docs/getting-started/routing-and-menu",
          },
          {
            id: "docs-multi-language",
            label: "docs-multi-language",
            href: "/docs/getting-started/multi-language",
          },
        ],
      },
      {
        id: "docs-theme",
        label: "menu-theme",
        href: "/docs/theme",
        hideInMenu: true,
        children: [
          {
            id: "docs-settings",
            label: "docs-settings",
            href: "/docs/theme/settings",
          },
          {
            id: "docs-theme-provider",
            label: "docs-theme-provider",
            href: "/docs/theme/theme-provider",
          },
          {
            id: "docs-styling",
            label: "docs-styling",
            href: "/docs/theme/styling",
          },
        ],
      },
    ],
  },
  { id: "settings", label: "menu-settings", href: "/settings", icon: "settings" },
];
