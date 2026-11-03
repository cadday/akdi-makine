import { useCallback, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import useAppNotifications from "@/hooks/use-app-notifications";

interface DeleteConfirmationOptions {
  title: string;
  message: ReactNode;
  errorMessage: string | ((error: unknown) => string);
  onConfirm: () => Promise<void>;
}

export default function useDeleteConfirmation() {
  const { t } = useTranslation();
  const { showError } = useAppNotifications();
  const [request, setRequest] = useState<DeleteConfirmationOptions | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDelete = useCallback(async (options: DeleteConfirmationOptions) => {
    setRequest(options);
  }, []);

  const closeDialog = useCallback(() => {
    if (!isDeleting) setRequest(null);
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (!request || isDeleting) return;

    setIsDeleting(true);
    try {
      await request.onConfirm();
      setRequest(null);
    } catch (error) {
      showError(typeof request.errorMessage === "function" ? request.errorMessage(error) : `${request.errorMessage} ${String(error)}`);
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, request, showError]);

  const dialog = (
    <Dialog key='delete-confirmation' open={Boolean(request)} onClose={closeDialog}>
      <DialogTitle>{request?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{request?.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} disabled={isDeleting} color='grey'>
          {t("cancel")}
        </Button>
        <Button onClick={() => void confirmDelete()} loading={isDeleting} color='error' variant='pastel'>
          {t("delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { requestDelete, dialog };
}