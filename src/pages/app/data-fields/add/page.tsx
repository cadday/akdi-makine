import { Link, useNavigate } from "react-router";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import type { DataFieldContainer, DataFieldDefinition, DataFieldType } from "@/context/db-context";
import { DATA_FIELD_CONTAINERS, DATA_FIELD_TYPES } from "@/lib/db";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  capitalize,
  Card,
  CardContent,
  createFilterOptions,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ChevronDown, ListTree, Save, Scroll, Signpost, SquaresSubtract, Tag, TriangleAlert, X, XSquare } from "lucide-react";
import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDb } from "@/context/db-context";

type DataFieldFormValues = Pick<DataFieldDefinition, "name"> &
  Required<Pick<DataFieldDefinition, "description">> & {
    type: DataFieldDefinition["type"] | "";
    mandatory: NonNullable<DataFieldDefinition["mandatory"]> | null;
    icon: NonNullable<DataFieldDefinition["icon"]> | null;
    container: DataFieldDefinition["container"] | "";
  };
type DataFieldIcon = NonNullable<DataFieldDefinition["icon"]>;

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createDataField } = useDb();
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (values: DataFieldFormValues) => {
    if (!values.type || !values.name.trim() || !values.container) {
      return;
    }
    setSaveError(null);

    try {
      await createDataField({
        type: values.type,
        name: values.name.trim(),
        description: values.description.trim(),
        container: values.container,
        ...(values.mandatory !== null && { mandatory: values.mandatory }),
        ...(values.icon && { icon: values.icon }),
      });
      navigate("/data-fields");
    } catch (error) {
      setSaveError(`Failed to save data field: ${String(error)}`);
    }
  };

  const formik = useFormik<DataFieldFormValues>({
    initialValues: {
      type: "",
      name: "",
      description: "",
      mandatory: null,
      icon: null,
      container: "",
    },
    validationSchema: yup.object({
      type: yup.string().required("Type is required"),
      name: yup.string().trim().required("Name is required"),
      description: yup.string(),
      mandatory: yup.boolean().nullable(),
      icon: yup.string().nullable(),
      container: yup.string().required("Container is required"),
    }),
    onSubmit: handleSave,
    validateOnBlur: false,
    validateOnMount: false,
  });

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              Add Data Field
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Link color='inherit' to='/data-fields'>
                {t("menu-data-fields")}
              </Link>
              <Typography variant='body2'>Add Data Field</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid container size={12} className='items-start w-full' spacing={5}>
          <Grid
            container
            size={{ lg: 8, xs: 12 }}
            spacing={5}
            component='form'
            onSubmit={(event) => {
              setSubmitted(true);
              formik.handleSubmit(event);
            }}
          >
            <Grid size={12}>
              <Typography variant='h6' component='h6' className='mb-3'>
                Field Definition
              </Typography>
              <Card>
                <CardContent>
                  <Box className='flex flex-row gap-2'>
                    <Signpost />
                    <FormControl fullWidth size='small' variant='standard' className='outlined'>
                      <FormLabel component='label'>Type *</FormLabel>
                      <Select<DataFieldType | "">
                        value={formik.values.type}
                        onChange={(event) => void formik.setFieldValue("type", event.target.value)}
                        IconComponent={ChevronDown}
                        MenuProps={{ className: "outlined" }}
                      >
                        {DATA_FIELD_TYPES.map((fieldType) => (
                          <MenuItem key={fieldType} value={fieldType}>
                            {fieldType}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box className='flex flex-row gap-2'>
                    <Tag />
                    <FormControl className='outlined' variant='standard' size='small' fullWidth>
                      <FormLabel component='label'>Name *</FormLabel>
                      <Input name='name' value={formik.values.name} onChange={formik.handleChange} />
                    </FormControl>
                  </Box>

                  <Box className='flex flex-row gap-2'>
                    <Scroll />
                    <FormControl className='MuiTextField-root outlined' fullWidth>
                      <FormLabel component='label'>Description</FormLabel>
                      <TextareaAutosize
                        name='description'
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        minRows={2}
                        maxRows={2}
                        className='MuiInputBase-root MuiInput-root MuiInputBase-formControl outlined autosize w-full'
                      />
                    </FormControl>
                  </Box>

                  <Box className='flex flex-row gap-2'>
                    <TriangleAlert />
                    <FormControl fullWidth size='small' variant='standard' className='outlined'>
                      <FormLabel component='label'>Mandatory</FormLabel>
                      <Select<string>
                        value={formik.values.mandatory === null ? "" : String(formik.values.mandatory)}
                        onChange={(event) => void formik.setFieldValue("mandatory", event.target.value === "" ? null : event.target.value === "true")}
                        IconComponent={ChevronDown}
                        MenuProps={{ className: "outlined" }}
                      >
                        <MenuItem value='false'>No</MenuItem>
                        <MenuItem value='true'>Yes</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box className='flex flex-row gap-2'>
                    <SquaresSubtract />
                    <FormControl fullWidth className='mb-0'>
                      <FormLabel component='label'>Icon</FormLabel>
                      <Autocomplete<DataFieldIcon, false, false, false>
                        size='small'
                        options={iconNames}
                        value={formik.values.icon}
                        onChange={(_, selectedIcon) => void formik.setFieldValue("icon", selectedIcon)}
                        popupIcon={<ChevronDown />}
                        clearIcon={<X />}
                        autoHighlight
                        filterOptions={createFilterOptions<DataFieldIcon>({ limit: 10 })}
                        getOptionLabel={(name) => name}
                        slotProps={{
                          popper: { className: "outlined" },
                          chip: {
                            variant: "filled",
                            size: "small",
                          },
                        }}
                        renderOption={(props, name) => (
                          <li {...props} key={name}>
                            <DynamicIcon name={name} className='me-2' />
                            <span>{name}</span>
                          </li>
                        )}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              variant='standard'
                              className='outlined'
                              placeholder='Search for icons'
                              slotProps={{
                                htmlInput: {
                                  ...params.slotProps.htmlInput,
                                  autoComplete: "new-password",
                                },
                                input: {
                                  ...params.slotProps.input,
                                  startAdornment: (
                                    <>
                                      {formik.values.icon && (
                                        <InputAdornment position='start'>
                                          <DynamicIcon name={formik.values.icon} className='me-2' />
                                        </InputAdornment>
                                      )}
                                      {params.slotProps.input.startAdornment}
                                    </>
                                  ),
                                },
                              }}
                            />
                          );
                        }}
                      />
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={12}>
              <Typography variant='h6' component='h6' className='mb-3'>
                Configuration
              </Typography>
              <Card>
                <CardContent>
                  <Box className='flex flex-row gap-2'>
                    <ListTree />
                    <FormControl fullWidth size='small' variant='standard' className='outlined mb-0'>
                      <FormLabel component='label'>Container *</FormLabel>
                      <Select<DataFieldContainer | "">
                        value={formik.values.container}
                        onChange={(event) => void formik.setFieldValue("container", event.target.value)}
                        IconComponent={ChevronDown}
                        MenuProps={{ className: "outlined" }}
                      >
                        {DATA_FIELD_CONTAINERS.map((fieldContainer) => (
                          <MenuItem key={fieldContainer} value={fieldContainer}>
                            {fieldContainer}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={12}>
              {saveError && <Alert severity='error' className='mb-2'>{saveError}</Alert>}
              {/* All Form Errors */}
              {submitted && !formik.isValid && (
                <Alert severity='error' icon={<XSquare />} className='neutral rounded-3xl! bg-transparent! mb-2 mt-2 p-5'>
                  <AlertTitle variant='subtitle2' className='pt-0.5'>
                    The following inputs have errors!
                  </AlertTitle>
                  {Object.entries(formik.errors).map(([key, value]) => {
                    return (
                      <Box className='flex flex-row gap-0.5' key={key}>
                        <Typography className='text-error'>{capitalize(key)}:</Typography>
                        <Typography className='text-text-primary'>{typeof value === "string" ? value : JSON.stringify(value)}</Typography>
                      </Box>
                    );
                  })}
                </Alert>
              )}
              <Button loading={formik.isSubmitting} loadingPosition="start" size='large' className='surface-standard' color='text-primary' variant='surface' type='submit' startIcon={<Save />}>
                Save
              </Button>
            </Grid>
          </Grid>
          <Grid size={{ lg: 4, xs: 12 }} container>
            <Grid size={12}>
              <Typography variant='h6' component='h6' className='mb-3'>
                Preview
              </Typography>
              <Card>
                <CardContent className='flex flex-col gap-5'></CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}
