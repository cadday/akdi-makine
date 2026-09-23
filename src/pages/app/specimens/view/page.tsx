import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useDb, type SpecimenRecord } from "@/context/db-context";
import { Breadcrumbs, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { getSpecimen } = useDb();
  const [specimen, setSpecimen] = useState<SpecimenRecord | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadSpecimen = async () => {
      if (!id) {
        setTitle("Specimen not found");
        return;
      }

      setSpecimen(null);
      setTitle("");

      try {
        const record = await getSpecimen(id);
        if (cancelled) return;

        setSpecimen(record ?? null);
        setTitle(record?.name ?? "Specimen not found");
      } catch {
        if (!cancelled) setTitle("Failed to load specimen");
      }
    };

    void loadSpecimen();
    return () => {
      cancelled = true;
    };
  }, [getSpecimen, id]);

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {specimen?.name ?? title}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Link color='inherit' to='/specimens'>
                {t("menu-specimens")}
              </Link>
              {specimen && <Typography variant='body2'>{specimen.name}</Typography>}
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container spacing={5} className='w-full'></Grid>
      </ContentWrapper>
    </>
  );
}
