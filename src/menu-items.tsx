import { MenuItem } from "@/types/types";

export const leftMenuItems: MenuItem[] = [
  {
    id: "overview",
    icon: "presentation",
    label: "menu-overview",
    href: "/overview",
  },
  {
    id: "tests",
    icon: "flask-conical",
    label: "menu-tests",
    href: "/tests",
  },
  {
    id: "specimens",
    icon: "drafting-compass",
    label: "menu-specimens",
    href: "/specimens",
  },
  {
    id: "presets",
    icon: "sliders-vertical",
    label: "menu-presets",
    href: "/presets",
  },
];

export const leftMenuBottomItems: MenuItem[] = [
  {
    id: "data-fields",
    label: "menu-data-fields",
    href: "/data-fields",
    icon: "network",
  },
  { id: "settings", label: "menu-settings", href: "/settings", icon: "settings" },
];
