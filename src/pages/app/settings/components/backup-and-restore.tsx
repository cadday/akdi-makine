import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { Download, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LINKS } from '@/constants';
import useAppNotifications from '@/hooks/use-app-notifications';
import {
  createDatabaseBackup,
  prepareDatabaseBackup,
  replaceDatabaseFromBackup,
  type PreparedDatabaseBackup,
} from '@/lib/backup';

type BackupOperation = 'export' | 'inspect' | 'restore' | null;

export default function BackupAndRestore() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showError, showSavedFile, showSuccess } = useAppNotifications();
  const [operation, setOperation] = useState<BackupOperation>(null);
  const [restoreCandidate, setRestoreCandidate] = useState<PreparedDatabaseBackup | null>(null);

  const exportBackup = async () => {
    setOperation('export');
    try {
      const archive = await createDatabaseBackup();
      const result = await window.electronAPI.saveBackupArchive(archive);
      if (result.canceled === false) showSavedFile(t('backup-export-success'), result.filePath);
    } catch (error) {
      showError(`${t('backup-export-error')} ${String(error)}`);
    } finally {
      setOperation(null);
    }
  };

  const selectBackup = async () => {
    setOperation('inspect');
    try {
      const result = await window.electronAPI.openBackupArchive();
      if (result.canceled === true) return;
      setRestoreCandidate(prepareDatabaseBackup(result.bytes));
    } catch (error) {
      showError(`${t('backup-import-error')} ${String(error)}`);
    } finally {
      setOperation(null);
    }
  };

  const restoreBackup = async () => {
    if (!restoreCandidate || operation === 'restore') return;
    setOperation('restore');
    try {
      await replaceDatabaseFromBackup(restoreCandidate);
      showSuccess(t('backup-import-success'));
      setRestoreCandidate(null);
      navigate(LINKS.home, { replace: true });
    } catch (error) {
      showError(`${t('backup-import-error')} ${String(error)}`);
      setOperation(null);
    }
  };

  return (
    <>
      <Grid size={12}>
        <Typography variant="h6" component="h2" className="mb-3">
          Backup and Restore
        </Typography>
        <Card>
          <CardContent className="flex flex-col gap-6">
            <Box className="flex flex-col gap-2">
              <Typography variant="subtitle1">Backup</Typography>
              <Box className="flex flex-col gap-1">
                <Typography>
                  Export your database to a ZIP file containing all the Tests, Specimens, Presets and Data Fields.
                </Typography>
              </Box>
              <Box className="flex flex-wrap gap-2">
                <Button
                  color="grey"
                  variant="pastel"
                  startIcon={
                    operation === 'export' ? <CircularProgress size={16} color="inherit" /> : <Download size={16} />
                  }
                  disabled={operation !== null}
                  onClick={() => void exportBackup()}
                >
                  Download
                </Button>
              </Box>
            </Box>
            <Box className="flex flex-col gap-2">
              <Typography variant="subtitle1">Restore</Typography>
              <Box className="flex flex-col gap-1">
                <Typography>Select a backup ZIP file to restore your database and images.</Typography>
              </Box>
              <Box className="flex flex-wrap gap-2">
                <Button
                  color="grey"
                  variant="pastel"
                  startIcon={
                    operation === 'inspect' ? <CircularProgress size={16} color="inherit" /> : <Upload size={16} />
                  }
                  disabled={operation !== null}
                  onClick={() => void selectBackup()}
                >
                  Restore
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Dialog
        open={Boolean(restoreCandidate)}
        onClose={() => operation !== 'restore' && setRestoreCandidate(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Replace Current Database and Images?</DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-3">
            This permanently replaces all current Specimens, Tests, Presets and Data Fields with the contents of the
            selected backup.
          </DialogContentText>
          {restoreCandidate && (
            <Typography color="textSecondary">
              {t('backup-record-summary', {
                ...restoreCandidate.manifest.counts,
                images: restoreCandidate.manifest.images.length,
              })}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="grey" disabled={operation === 'restore'} onClick={() => setRestoreCandidate(null)}>
            Cancel
          </Button>
          <Button color="error" variant="pastel" loading={operation === 'restore'} onClick={() => void restoreBackup()}>
            Restore
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
