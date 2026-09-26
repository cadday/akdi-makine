import { useCallback } from "react";
import { useSnackbar } from "notistack";

export default function useAppNotifications() {
  const { enqueueSnackbar } = useSnackbar();

  const showError = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "error",
        persist: false,
        autoHideDuration: 6000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
    [enqueueSnackbar],
  );

  const showSuccess = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "success",
        persist: false,
        autoHideDuration: 6000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
    [enqueueSnackbar],
  );

  return { showError, showSuccess };
}