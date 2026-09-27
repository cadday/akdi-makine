import { createElement, Fragment, useCallback } from "react";
import { Button } from "@mui/material";
import { FolderOpen, X } from "lucide-react";
import { useSnackbar } from "notistack";

export default function useAppNotifications() {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

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
    (message: string, action?: { label: string; onClick: () => void }) => {
      enqueueSnackbar(message, {
        variant: "success",
        persist: false,
        autoHideDuration: action ? 10000 : 6000,
        action: action
          ? (snackbarId) =>
              createElement(
                Fragment,
                null,
                createElement(
                  Button,
                  { "aria-label": action.label, className: "icon-only", color: "grey", variant: "text", size: "tiny", onClick: action.onClick },
                  createElement(FolderOpen, { className: "text-text-primary!", size: 18 }),
                ),
                createElement(
                  Button,
                  {
                    "aria-label": "close",
                    className: "icon-only",
                    color: "grey",
                    variant: "text",
                    size: "tiny",
                    onClick: () => closeSnackbar(snackbarId),
                  },
                  createElement(X, { className: "text-text-primary", size: 12 }),
                ),
              )
          : undefined,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
    [closeSnackbar, enqueueSnackbar],
  );

  const showPdfSaved = useCallback(
    (filePath: string) => {
      showSuccess("PDF saved successfully", {
        label: "Open folder",
        onClick: () => {
          void window.electronAPI.showPdfInFolder(filePath).catch((error: unknown) => showError(`Failed to open folder: ${String(error)}`));
        },
      });
    },
    [showError, showSuccess],
  );

  return { showError, showSuccess, showPdfSaved };
}