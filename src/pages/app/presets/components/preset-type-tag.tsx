import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { PresetType } from "@/context/db-context";

export default function PresetTypeTag({ type }: { type: PresetType }) {
  const { t } = useTranslation();

  return (
    <Button
      component='span'
      className='pointer-events-none self-center py-0.75 rounded-2xs'
      size='tiny'
      color={type === "Tensile" ? "primary" : "accent-5"}
      variant='outlined'
    >
      {type === "Tensile" ? t("listing-tensile") : t("listing-compression")}
    </Button>
  );
}