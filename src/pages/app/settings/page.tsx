import { Link } from 'react-router';
import { Breadcrumbs, Grid, Typography } from '@mui/material';
import ContentWrapper from '@/components/layout/containers/content-wrapper';
import TitleWrapper from '@/components/layout/containers/title-wrapper';
import { LINKS } from '@/constants';
import { useTranslation } from 'react-i18next';
import Adjustments from '@/pages/app/settings/components/adjustments';
import BackupAndRestore from '@/pages/app/settings/components/backup-and-restore';
import Limits from '@/pages/app/settings/components/limits';

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: 'grow' }}>
            <Typography variant="h1" component="h1" className="mb-0">
              {t('menu-settings')}
            </Typography>
            <Breadcrumbs>
              <Link color="inherit" to={LINKS.home}>
                {t('menu-home')}
              </Link>
              <Typography variant="body2">{t('menu-settings')}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container spacing={5} className="w-full">
          <Adjustments />
          <Limits />
          <BackupAndRestore />
        </Grid>
      </ContentWrapper>
    </>
  );
}
