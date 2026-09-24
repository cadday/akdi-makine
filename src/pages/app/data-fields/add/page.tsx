import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Breadcrumbs, Grid, Typography } from "@mui/material";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import DataFieldForm from "@/pages/app/data-fields/components/data-field-form";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition } from "@/context/db-context";

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { createDataField } = useDb();
  const initialDataField = (location.state as { initialDataField?: DataFieldDefinition } | null)?.initialDataField;

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>Add Data Field</Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>{t("menu-home")}</Link>
              <Link color='inherit' to='/data-fields'>{t("menu-data-fields")}</Link>
              <Typography variant='body2'>Add Data Field</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <DataFieldForm
          initialDataField={initialDataField}
          onSave={async (input) => {
            await createDataField(input);
            navigate("/data-fields");
          }}
        />
      </ContentWrapper>
    </>
  );
}