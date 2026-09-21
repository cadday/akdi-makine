import { SnackbarProvider } from "notistack";
import { PropsWithChildren } from "react";

import { CheckCircle, CircleAlert, CircleX, Info } from "lucide-react";

const iconVariants = {
  success: <CheckCircle className="me-2" />,
  error: <CircleX className="me-2" />,
  warning: <CircleAlert className="me-2" />,
  info: <Info className="me-2" />,
};

export default function SnackbarWrapper({ children }: PropsWithChildren) {
  return (
    <SnackbarProvider maxSnack={4} iconVariant={iconVariants}>
      {children}
    </SnackbarProvider>
  );
}
