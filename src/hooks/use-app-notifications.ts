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
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
    },
    [enqueueSnackbar],
  );

  return { showError };
}