import { Link } from "react-router";
import { useState } from "react";
import { Alert, Box, Breadcrumbs, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from "@mui/material";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useTranslation } from "react-i18next";
import { DatabaseBackup, Download, Upload } from "lucide-react";
import useAppNotifications from "@/hooks/use-app-notifications";
import { createDatabaseBackup, prepareDatabaseBackup, replaceDatabaseFromBackup, type PreparedDatabaseBackup } from "@/lib/backup";

type BackupOperation = "export" | "inspect" | "restore" | null;

export default function Page() {
  const { t } = useTranslation();
  const { showError, showSuccess } = useAppNotifications();
  const [operation, setOperation] = useState<BackupOperation>(null);
  const [restoreCandidate, setRestoreCandidate] = useState<PreparedDatabaseBackup | null>(null);

  const exportBackup = async () => {
    setOperation("export");
    try {
      const archive = await createDatabaseBackup();
      const result = await window.electronAPI.saveBackupArchive(archive);
      if (!result.canceled) showSuccess(t("backup-export-success"));
    } catch (error) {
      showError(`${t("backup-export-error")} ${String(error)}`);
    } finally {
      setOperation(null);
    }
  };

  const selectBackup = async () => {
    setOperation("inspect");
    try {
      const result = await window.electronAPI.openBackupArchive();
      if (result.canceled === true) return;
      setRestoreCandidate(prepareDatabaseBackup(result.bytes));
    } catch (error) {
      showError(`${t("backup-import-error")} ${String(error)}`);
    } finally {
      setOperation(null);
    }
  };

  const restoreBackup = async () => {
    if (!restoreCandidate || operation === "restore") return;
    setOperation("restore");
    try {
      await replaceDatabaseFromBackup(restoreCandidate);
      showSuccess(t("backup-import-success"));
      setRestoreCandidate(null);
      window.location.reload();
    } catch (error) {
      showError(`${t("backup-import-error")} ${String(error)}`);
      setOperation(null);
    }
  };

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {t("menu-settings")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Typography variant='body2'>{t("menu-settings")}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container spacing={5} className='w-full'>
          <Grid size={12}>
            <Typography variant='h6' component='h2' className='mb-3'>
              {t("backup-title")}
            </Typography>
            <Card>
              <CardContent className='flex flex-col gap-5'>
                <Box className='flex flex-col gap-1'>
                  <Typography variant='subtitle1'>{t("backup-database-title")}</Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {t("backup-description")}
                  </Typography>
                </Box>
                <Alert severity='info' icon={<DatabaseBackup size={20} />}>
                  {t("backup-scope")}
                </Alert>
                <Box className='flex flex-wrap gap-2'>
                  <Button
                    color='primary'
                    variant='pastel'
                    startIcon={operation === "export" ? <CircularProgress size={16} color='inherit' /> : <Download size={16} />}
                    disabled={operation !== null}
                    onClick={() => void exportBackup()}
                  >
                    {t("backup-export")}
                  </Button>
                  <Button
                    color='grey'
                    variant='outlined'
                    startIcon={operation === "inspect" ? <CircularProgress size={16} color='inherit' /> : <Upload size={16} />}
                    disabled={operation !== null}
                    onClick={() => void selectBackup()}
                  >
                    {t("backup-import")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ContentWrapper>
      <Dialog open={Boolean(restoreCandidate)} onClose={() => operation !== "restore" && setRestoreCandidate(null)} maxWidth='sm' fullWidth>
        <DialogTitle>{t("backup-restore-confirm-title")}</DialogTitle>
        <DialogContent>
          <DialogContentText className='mb-3'>
            {t("backup-restore-confirm-message")}
          </DialogContentText>
          {restoreCandidate && (
            <Typography variant='body2' color='textSecondary'>
              {t("backup-record-summary", { ...restoreCandidate.manifest.counts, images: restoreCandidate.manifest.images.length })}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button color='grey' disabled={operation === "restore"} onClick={() => setRestoreCandidate(null)}>
            {t("cancel")}
          </Button>
          <Button color='error' variant='pastel' loading={operation === "restore"} onClick={() => void restoreBackup()}>
            {t("backup-restore-confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
