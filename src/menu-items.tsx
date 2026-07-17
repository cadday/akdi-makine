import { MenuItem } from "@/types/types";

export const leftMenuItems: MenuItem[] = [
  {
    id: "dashboards",
    icon: "NiHome",
    label: "menu-dashboards",
    description: "menu-dashboards-description",
    color: "text-primary",
    href: "/dashboards",
    children: [
      {
        id: "default",
        icon: "NiChartPie",
        label: "menu-default",
        href: "/dashboards/default",
        description: "menu-default-description",
      },
      {
        id: "default-titles-inside",
        icon: "NiChartPie",
        label: "menu-default-titles-inside",
        href: "/dashboards/default/default-titles-inside",
        description: "menu-default-description",
        hideInMenu: true,
      },
      {
        id: "analytics",
        icon: "NiPresentation",
        label: "menu-analytics",
        href: "/dashboards/analytics",
        description: "menu-analytics-description",
      },
      {
        id: "analytics-titles-inside",
        icon: "NiPresentation",
        label: "menu-analytics-titles-inside",
        href: "/dashboards/analytics/analytics-titles-inside",
        description: "menu-analytics-description",
        hideInMenu: true,
      },
      {
        id: "visual",
        icon: "NiTextarea",
        label: "menu-visual",
        href: "/dashboards/visual",
        description: "menu-visual-description",
      },
      {
        id: "visual-titles-inside",
        icon: "NiTextarea",
        label: "menu-visual-titles-inside",
        href: "/dashboards/visual/visual-titles-inside",
        description: "menu-visual-description",
        hideInMenu: true,
      },
      {
        id: "commerce",
        icon: "NiBag",
        label: "menu-commerce",
        href: "/dashboards/commerce",
        description: "menu-commerce-description",
      },
      {
        id: "commerce-titles-inside",
        icon: "NiBag",
        label: "menu-commerce-titles-inside",
        href: "/dashboards/commerce/commerce-titles-inside",
        description: "menu-commerce-description",
        hideInMenu: true,
      },
      {
        id: "learning",
        icon: "NiGraduation",
        label: "menu-learning",
        href: "/dashboards/learning",
        description: "menu-learning-description",
      },
      {
        id: "learning-titles-inside",
        icon: "NiGraduation",
        label: "menu-learning-titles-inside",
        href: "/dashboards/learning/learning-titles-inside",
        description: "menu-learning-description",
        hideInMenu: true,
      },
      {
        id: "health",
        icon: "NiHeartRate",
        label: "menu-health",
        href: "/dashboards/health",
        description: "menu-health-description",
      },
      {
        id: "health-titles-inside",
        icon: "NiHeartRate",
        label: "menu-health-titles-inside",
        href: "/dashboards/health/health-titles-inside",
        description: "menu-health-description",
        hideInMenu: true,
      },
      {
        id: "booking",
        icon: "NiSigns",
        label: "menu-booking",
        href: "/dashboards/booking",
        description: "menu-booking-description",
      },
      {
        id: "booking-titles-inside",
        icon: "NiSigns",
        label: "menu-booking-titles-inside",
        href: "/dashboards/booking/booking-titles-inside",
        description: "menu-booking-description",
        hideInMenu: true,
      },
    ],
  },
  {
    id: "external-link",
    icon: "NiArrowUpRightSquare",
    label: "menu-external-link",
    color: "text-primary",
    href: "https://themeforest.net/item/gogo-vite/22544383",
    isExternalLink: true,
  },
  {
    id: "multi-level",
    label: "menu-multi-level",
    icon: "NiDirectory",
    color: "text-primary",
    href: "/menu-levels",
    children: [
      { id: "level-two", label: "menu-level-two", icon: "NiStar", href: "/menu-levels/level-two" },
      {
        id: "level-two-subs",
        label: "menu-level-two-subs",
        href: "/menu-levels/level-two-subs",
        icon: "NiStars",
        children: [
          { id: "level-three", label: "menu-level-three", href: "/menu-levels/level-two-subs/level-three" },
          {
            id: "level-three-subs",
            label: "menu-level-three-subs",
            href: "/menu-levels/level-two-subs/level-three-subs",
            children: [
              {
                id: "level-four",
                label: "menu-level-four",
                href: "/menu-levels/level-two-subs/level-three-subs/level-four",
              },
              {
                id: "level-four-subs",
                label: "menu-level-four-subs",
                href: "/menu-levels/level-two-subs/level-three-subs/level-four-subs",
                children: [
                  {
                    id: "level-five",
                    label: "menu-level-five",
                    href: "/menu-levels/level-two-subs/level-three-subs/level-four-subs/level-five",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const leftMenuBottomItems: MenuItem[] = [
  {
    id: "docs",
    label: "menu-documentation",
    href: "/docs",
    icon: "NiDocumentCode",
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
  { id: "settings", label: "menu-settings", href: "/settings", icon: "NiSettings" },
];
