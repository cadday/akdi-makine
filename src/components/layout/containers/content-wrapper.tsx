import { PropsWithChildren } from "react";

import { Box } from "@mui/material";

export default function ContentWrapper({ children }: PropsWithChildren) {
  return <Box className="min-h-[calc(100vh-2.5rem-3.75rem)] *:mb-2">{children}</Box>;
}
