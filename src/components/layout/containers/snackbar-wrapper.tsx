import { closeSnackbar, SnackbarProvider } from "notistack";
import { PropsWithChildren } from "react";

import { CheckCircle, CircleAlert, CircleX, Info, X } from "lucide-react";
import { Button } from "@mui/material";

const iconVariants = {
  success: <CheckCircle className='me-2' />,
  error: <CircleX className='me-2' />,
  warning: <CircleAlert className='me-2' />,
  info: <Info className='me-2' />,
};

export default function SnackbarWrapper({ children }: PropsWithChildren) {
  return (
    <SnackbarProvider
      maxSnack={4}
      iconVariant={iconVariants}
      action={(snackbarId) => (
        <Button className='icon-only' color='grey' variant='text' size='tiny' aria-label='close' onClick={() => closeSnackbar(snackbarId)}>
          <X size={12} className='text-text-primary' />
        </Button>
      )}
    >
      {children}
    </SnackbarProvider>
  );
}
