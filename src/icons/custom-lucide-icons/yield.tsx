import { Icon, type LucideIconNode } from "lucide-react";

const customTensileNode: LucideIconNode[] = [
  [
    "path",
    {
      d: "M17.2008 2H6.80078C5.69621 2 4.80078 2.89543 4.80078 4V20C4.80078 21.1046 5.69621 22 6.80078 22H17.2008C18.3053 22 19.2008 21.1046 19.2008 20V4C19.2008 2.89543 18.3053 2 17.2008 2Z",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
  ],
  [
    "path",
    {
      d: "M12 18.1992L12 5.79922",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
  ],
  [
    "path",
    {
      d: "M14.4004 8.19922L12.0004 5.79922L9.60039 8.19922",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
  ],
];

export const Yeild = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return <Icon iconNode={customTensileNode} {...props} />;
};
