import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { FileDown } from "lucide-react";
import useAppNotifications from "@/hooks/use-app-notifications";

interface SaveRecordPdfMenuItemProps {
  type: "test" | "specimen" | "preset" | "data-field";
  id?: string;
  name: string;
  closeMenu: () => void;
}

export default function SaveRecordPdfMenuItem({ type, id, name, closeMenu }: SaveRecordPdfMenuItemProps) {
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
          .saveRecordPdf({ type, id, name })
          .then((result) => {
            if (!result.canceled && result.filePath) showPdfSaved(result.filePath);
          })
          .catch((error: unknown) => showError(`Failed to save PDF: ${String(error)}`))
          .finally(() => {
            removePdfCreatingListener();
            hidePdfCreating?.();
          });
      }}
    >
      <ListItemIcon>
        <FileDown size={16} />
      </ListItemIcon>
      <ListItemText>Save as PDF</ListItemText>
    </MenuItem>
  );
}
