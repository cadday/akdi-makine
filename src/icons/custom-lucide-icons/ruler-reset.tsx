import { Icon, type LucideIconNode } from "lucide-react";

const node: LucideIconNode[] = [
  ["path", { d: "M10 15V12", key: "path1" }],
  ["path", { d: "M2 8V4", key: "path2" }],
  ["path", { d: "M22 6H2", key: "path3" }],
  ["path", { d: "M22 8V4", key: "path4" }],
  ["path", { d: "M6 15V12", key: "path5" }],
  ["path", { d: "M22 14C22 12.8954 21.1046 12 20 12H4C2.89543 12 2 12.8954 2 14V18C2 19.1046 2.89543 20 4 20H10.8008", key: "path6" }],
  ["path", { d: "M15 17L20 22", key: "path7" }],
  ["path", { d: "M20 17L15 22", key: "path8" }],
];

export const RulerReset = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return <Icon iconNode={node} {...props} />;
};
