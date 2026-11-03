import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import useAppNotifications from "@/hooks/use-app-notifications";

interface SaveRecordPdfMenuItemProps {
  type: "test" | "specimen" | "preset" | "data-field";
  id?: string;
  name: string;
  closeMenu: () => void;
}

export default function SaveRecordPdfMenuItem({ type, id, name, closeMenu }: SaveRecordPdfMenuItemProps) {
  const { t } = useTranslation();
  const { showError, showPdfCreating, showPdfSaved } = useAppNotifications();

  return (
    <MenuItem
      onClick={() => {
        closeMenu();
        if (!id) return;
        let hidePdfCreating: (() => void) | undefined;
        const removePdfCreatingListener = window.electronAPI.onPdfCreating(() => {
          hidePdfCreating = showPdfCreating();
        });
        void window.electronAPI
          .saveRecordPdf({ type, id, name, dialogLabels: { title: t("pdf-dialog-save-record-title"), filterName: "PDF" } })
          .then((result) => {
            if (!result.canceled && result.filePath) showPdfSaved(result.filePath);
          })
          .catch((error: unknown) => showError(t("view-save-pdf-error", { error: String(error) })))
          .finally(() => {
            removePdfCreatingListener();
            hidePdfCreating?.();
          });
      }}
    >
      <ListItemIcon>
        <FileDown size={16} />
      </ListItemIcon>
      <ListItemText>{t("view-save-as-pdf")}</ListItemText>
    </MenuItem>
  );
}
