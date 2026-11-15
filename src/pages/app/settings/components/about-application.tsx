import { Box, Card, CardContent, Grid, Link as MuiLink, Typography } from "@mui/material";
import { Monitor, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Machine } from "@/icons/custom-lucide-icons/machine";
import packageJson from "../../../../../package.json";

function InformationRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <Box className='flex flex-row gap-2'>
      {icon}
      <Box className='flex flex-col gap-1'>
        <Typography variant='subtitle1'>{label}</Typography>
        <Typography component='div'>{children}</Typography>
      </Box>
    </Box>
  );
}

export default function AboutApplication() {
  const { t } = useTranslation();

  return (
    <Grid size={12}>
      <Typography variant='h6' component='h2' className='mb-3'>
        {t("settings-information-title")}
      </Typography>
      <Card>
        <CardContent className='flex flex-col gap-5'>
          <InformationRow icon={<Tag className='flex-none' />} label={t("settings-information-version")}>
            {packageJson.version}
          </InformationRow>
          <InformationRow icon={<Machine className='flex-none' />} label={t("settings-information-compatible-machines")}>
            20-34-20kN ∙ 20-34-50kN ∙ 20-34-100kN ∙ 20-34-200kN ∙ 20-34-250kN
          </InformationRow>
          <InformationRow icon={<Monitor className='flex-none' />} label={t("settings-information-contact")}>
            <MuiLink
              href='https://akdimakine.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-text-primary link-primary link-underline hover:text-primary'
            >
              akdimakine.com
            </MuiLink>
          </InformationRow>
        </CardContent>
      </Card>
    </Grid>
  );
}