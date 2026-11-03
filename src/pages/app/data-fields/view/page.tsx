import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Box, Breadcrumbs, Button, Grid, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import DataFieldForm from "@/pages/app/data-fields/components/data-field-form";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition } from "@/context/db-context";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import useAppNotifications from "@/hooks/use-app-notifications";
import { Ellipsis, X } from "lucide-react";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";
import SaveRecordPdfMenuItem from "@/components/pdf/save-record-pdf-menu-item";
import usePrintReadiness from "@/hooks/use-print-readiness";
import { cn } from "@/lib/utils";

export default function Page({ printMode = false }: { printMode?: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getDataField, updateDataField, deleteDataField } = useDb();
  const [dataField, setDataField] = useState<DataFieldDefinition | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useAppNotifications();
  const { requestDelete, dialog } = useDeleteConfirmation();
  usePrintReadiness(printMode, isLoading, loadError);

  useEffect(() => {
    let cancelled = false;

    const loadDataField = async () => {
      setIsLoading(true);
      setLoadError(null);
      if (!id) {
        setDataField(null);
        setLoadError(t("view-data-field-not-found"));

        setIsLoading(false);
        return;
      }

      try {
        const record = await getDataField(id);
        if (cancelled) return;
        setDataField(record ?? null);
        if (!record) setLoadError(t("view-data-field-not-found"));
      } catch (error) {
        if (!cancelled) setLoadError(t("view-load-data-field-error", { error: String(error) }));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadDataField();
    return () => {
      cancelled = true;
    };
  }, [getDataField, id, t]);

  useEffect(() => {
    if (loadError) showError(loadError);
  }, [loadError, showError]);

  return (
    <>
      {isLoading ? (
        <LoadingFullScreen />
      ) : (
        <>
          <TitleWrapper>
            <Grid size={12} container spacing={2.5}>
              <Grid size={{ xs: 12, md: "grow" }}>
                <Typography variant='h1' component='h1' className='mb-0'>
                  {dataField?.name ?? t("data-field")}
                </Typography>
                <Breadcrumbs>
                  <Link color='inherit' to={LINKS.home}>
                    {t("menu-home")}
                  </Link>
                  <Link color='inherit' to='/data-fields'>
                    {t("data-fields")}
                  </Link>
                  {dataField && <Typography variant='body2'>{dataField.name}</Typography>}
                </Breadcrumbs>
              </Grid>
              <Grid size={{ xs: 12, md: "auto" }} className={cn("print:hidden")}>
                <PopupState variant='popover' popupId='data-field-actions-menu' >
                  {(popupState) => (
                    <>
                      <Tooltip title={t("view-actions")} placement='bottom'>
                        <Button className='icon-only surface-standard' color='grey' variant='surface' {...bindTrigger(popupState)}>
                          <Box className='w-6 h-6 flex items-center justify-center'>
                            <Ellipsis size={16} />
                          </Box>
                        </Button>
                      </Tooltip>
                      <Menu
                        {...bindMenu(popupState)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                      >
                        <SaveRecordPdfMenuItem type='data-field' id={id} name={dataField?.name ?? t("data-field")} closeMenu={popupState.close} />
                        <MenuItem
                          onClick={() => {
                            popupState.close();
                            if (!id) return;
                            requestDelete({
                              title: t("listing-delete-data-field-title"),
                              message: dataField?.name ? t("view-delete-confirm-named", { name: dataField.name }) : t("listing-delete-data-field-confirm"),
                              errorMessage: (error) => t("listing-delete-data-field-error", { error: String(error) }),
                              onConfirm: async () => {
                                await deleteDataField(id);
                                navigate("/data-fields");
                              },
                            });
                          }}
                          className='hover:bg-error-light/10 hover:text-error'
                        >
                          <ListItemIcon>
                            <X size={16} />
                          </ListItemIcon>
                          <ListItemText>{t("view-delete")}</ListItemText>
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </PopupState>
              </Grid>
            </Grid>
          </TitleWrapper>

          <ContentWrapper>
            {!loadError && dataField && id ? (
              <DataFieldForm
                key={dataField.id}
                dataField={dataField}
                saveLabel={t("view-update")}
                onSave={async (input) => {
                  await updateDataField(id, input);
                  navigate("/data-fields");
                }}
              />
            ) : null}
          </ContentWrapper>
        </>
      )}
      {dialog}
    </>
  );
}
