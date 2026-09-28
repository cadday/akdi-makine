import { Icon, type LucideIconNode } from "lucide-react";

const node: LucideIconNode[] = [
  [
    "path",
    {
      d: "M2.4 2.51367L2.4 7.31367",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      key: "machine-1",
    },
  ],
  [
    "path",
    {
      d: "M2.4 4.79981L9.6 4.79981",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      key: "machine-2",
    },
  ],
  [
    "path",
    {
      d: "M12 13.8002L12 7.2002",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      key: "machine-3",
    },
  ],
  [
    "path",
    {
      d: "M21.6 2.51367L21.6 7.31367",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      key: "machine-4",
    },
  ],
  [
    "path",
    {
      d: "M21.6 4.79981L14.4 4.79981",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      key: "machine-5",
    },
  ],
  [
    "rect",
    {
      x: "9.6",
      y: "2.40039",
      width: "4.8",
      height: "4.8",
      rx: "1",
      key: "machine-6",
    },
  ],
  [
    "path",
    {
      d: "M8.58564 21.6004L7.33398 19.4324C7.24621 19.2804 7.2 19.108 7.2 18.9324L7.2 15.4004C7.2 14.8481 7.64772 14.4004 8.2 14.4004L15.8 14.4004C16.3523 14.4004 16.8 14.8481 16.8 15.4004L16.8 18.9643C16.8 19.1196 16.7639 19.2727 16.6944 19.4115L15.6 21.6004",
      strokeLinecap: "round",
      key: "machine-7",
    },
  ],
];

export const Machine = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return <Icon iconNode={node} {...props} />;
};
