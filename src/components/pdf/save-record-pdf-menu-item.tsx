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
  const { showError, showSuccess } = useAppNotifications();

  return (
    <MenuItem
      onClick={() => {
        closeMenu();
        if (!id) return;
        void window.electronAPI
          .saveRecordPdf({ type, id, name })
          .then((result) => {
            if (!result.canceled) showSuccess("PDF saved successfully");
          })
          .catch((error: unknown) => showError(`Failed to save PDF: ${String(error)}`));
      }}
    >
      <ListItemIcon>
        <FileDown size={16} />
      </ListItemIcon>
      <ListItemText>Save as PDF</ListItemText>
    </MenuItem>
  );
}
