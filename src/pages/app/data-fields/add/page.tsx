import { Link, useNavigate } from "react-router";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import DataFieldInput from "@/components/data-fields/data-field-input";
import type { DataFieldContainer, DataFieldDefinition, DataFieldType, DynamicDataValue } from "@/context/db-context";
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
  Checkbox,
  createFilterOptions,
  FormControl,
  FormControlLabel,
  FormGroup,
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
import {
  ChevronDown,
  File,
  Image,
  Images,
  ListTree,
  Package2,
  Ruler,
  Save,
  Scroll,
  Signpost,
  SquaresSubtract,
  Tag,
  TriangleAlert,
  X,
  XSquare,
} from "lucide-react";
import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDb } from "@/context/db-context";
import { cn } from "@/lib/utils";

type DataFieldFormValues = Pick<DataFieldDefinition, "name"> &
  Required<Pick<DataFieldDefinition, "description" | "unit" | "accept" | "multiple">> & {
    options: string;
    type: DataFieldDefinition["type"] | "";
    mandatory: NonNullable<DataFieldDefinition["mandatory"]> | null;
    icon: NonNullable<DataFieldDefinition["icon"]> | null;
    container: DataFieldDefinition["container"] | "";
  };
type DataFieldIcon = NonNullable<DataFieldDefinition["icon"]>;
const IMAGE_ACCEPT_OPTIONS = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"];
function formikOptionLines(value: string) {
  return [
    ...new Set(
      value
        .split(/\r?\n/)
        .map((option) => option.trim())
        .filter(Boolean),
    ),
  ];
}

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createDataField } = useDb();
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [previewValue, setPreviewValue] = useState<DynamicDataValue>(null);

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
        ...((values.type === "Text" || values.type === "Number") && values.unit.trim() && { unit: values.unit.trim() }),
        ...((values.type === "Select" || values.type === "Multi-Select") && { options: formikOptionLines(values.options) }),
        ...(values.type === "Image" && { accept: values.accept, multiple: values.multiple }),
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
      container: "",
      name: "",
      unit: "",
      description: "",
      options: "",
      accept: IMAGE_ACCEPT_OPTIONS.join(","),
      multiple: false,
      mandatory: null,
      icon: null,
    },
    validationSchema: yup.object({
      type: yup.string().required("Type is required"),
      container: yup.string().required("Container is required"),
      name: yup.string().trim().required("Name is required"),
      description: yup.string(),
      mandatory: yup.boolean().nullable(),
      icon: yup.string().nullable(),
      options: yup.string().when("type", {
        is: (type: DataFieldType | "") => type === "Select" || type === "Multi-Select",
        then: (schema) => schema.test("has-options", "Add at least one option", (value) => formikOptionLines(value ?? "").length > 0),
      }),
      accept: yup.string().when("type", {
        is: (type: DataFieldType | "") => type === "Image",
        then: (schema) =>
          schema
            .required("Choose at least one image type")
            .test("accepted-image-types", "Choose at least one image type", (value) => Boolean(value?.split(",").some((type) => type.trim()))),
      }),
      multiple: yup.boolean(),
    }),
    onSubmit: handleSave,
    validateOnBlur: false,
    validateOnMount: false,
  });
  const hasFieldError = (field: keyof DataFieldFormValues) => Boolean(formik.errors[field]);

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
            noValidate
            onSubmit={(event) => {
              setSubmitted(true);
              formik.handleSubmit(event);
            }}
          >
            <Grid size={12}>
              <Typography variant='h6' component='h6' className='mb-3'>
                Schema
              </Typography>
              <Card>
                <CardContent className='-mb-2'>
                  <Box className='flex flex-row gap-2'>
                    <Signpost className={cn(hasFieldError("type") && "text-error!")} />
                    <FormControl fullWidth size='small' variant='standard' className='outlined' required>
                      <FormLabel component='label' className={cn(hasFieldError("type") && "text-error!")}>
                        Type
                      </FormLabel>
                      <Select<DataFieldType | "">
                        value={formik.values.type}
                        onChange={(event) => {
                          void formik.setFieldValue("type", event.target.value);
                          if (event.target.value !== "Text" && event.target.value !== "Number") {
                            void formik.setFieldValue("unit", "");
                          }
                          setPreviewValue(null);
                        }}
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
                    <Package2 className={cn(hasFieldError("container") && submitted && "text-error!")} />
                    <FormControl fullWidth size='small' variant='standard' className='outlined' required>
                      <FormLabel component='label' className={cn(hasFieldError("container") && submitted && "text-error!")}>
                        Container
                      </FormLabel>
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
              <Typography variant='h6' component='h6' className='mb-3'>
                Definition
              </Typography>
              <Card>
                <CardContent className='-mb-2'>
                  <Box className='flex flex-row gap-2'>
                    <Tag className={cn(hasFieldError("name") && submitted && "text-error!")} />
                    <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                      <FormLabel component='label' className={cn(hasFieldError("name") && submitted && "text-error!")}>
                        Name
                      </FormLabel>
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
                    <FormControl fullWidth>
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
            {(formik.values.type === "Select" ||
              formik.values.type === "Multi-Select" ||
              formik.values.type === "Image" ||
              formik.values.type === "Text" ||
              formik.values.type === "Number") && (
              <Grid size={12}>
                <Typography variant='h6' component='h6' className='mb-3'>
                  Type Related Options
                </Typography>
                <Card>
                  <CardContent className='-mb-2'>
                    {(formik.values.type === "Select" || formik.values.type === "Multi-Select") && (
                      <Box className='flex flex-row gap-2'>
                        <ListTree className={cn(hasFieldError("options") && submitted && "text-error!")} />
                        <FormControl className='MuiTextField-root outlined' fullWidth required>
                          <FormLabel component='label' className={cn(hasFieldError("options") && submitted && "text-error!")}>
                            Options
                          </FormLabel>
                          <TextareaAutosize
                            name='options'
                            value={formik.values.options}
                            onChange={formik.handleChange}
                            minRows={3}
                            maxRows={6}
                            placeholder={"One option per line"}
                            className='MuiInputBase-root MuiInput-root MuiInputBase-formControl outlined autosize w-full'
                          />
                        </FormControl>
                      </Box>
                    )}

                    {formik.values.type === "Image" && (
                      <>
                        <Box className='flex flex-row gap-2'>
                          <Image />
                          <FormControl fullWidth size='small' variant='standard' className='outlined'>
                            <FormLabel component='label'>Accepted image types</FormLabel>
                            <Select<string[]>
                              multiple
                              value={formik.values.accept.split(",").filter(Boolean)}
                              onChange={(event) => {
                                const selected = typeof event.target.value === "string" ? event.target.value.split(",") : event.target.value;
                                void formik.setFieldValue("accept", selected.join(","));
                              }}
                              IconComponent={ChevronDown}
                              renderValue={(selected) => selected.map((type) => capitalize(type.replace("image/", ""))).join(", ")}
                              MenuProps={{ className: "outlined" }}
                            >
                              {IMAGE_ACCEPT_OPTIONS.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {capitalize(type.replace("image/", ""))}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Box className='flex flex-row gap-2'>
                          <Images />
                          <FormGroup className='flex flex-col gap-1'>
                            <FormLabel component='label'>Multiple Images</FormLabel>
                            <FormControlLabel
                              label='Allow'
                              control={
                                <Checkbox checked={formik.values.multiple} onChange={(event) => void formik.setFieldValue("multiple", event.target.checked)} />
                              }
                            />
                          </FormGroup>
                        </Box>
                      </>
                    )}

                    {(formik.values.type === "Text" || formik.values.type === "Number") && (
                      <Box className='flex flex-row gap-2'>
                        <Ruler />
                        <FormControl className='outlined' variant='standard' size='small' fullWidth>
                          <FormLabel component='label'>Unit</FormLabel>
                          <Input name='unit' value={formik.values.unit} onChange={formik.handleChange} />
                        </FormControl>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid size={12}>
              {saveError && (
                <Alert severity='error' className='mb-2'>
                  {saveError}
                </Alert>
              )}
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
              <Button
                loading={formik.isSubmitting}
                loadingPosition='start'
                size='large'
                className='surface-standard'
                color='text-primary'
                variant='surface'
                type='submit'
                startIcon={<Save />}
              >
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
                <CardContent className='flex flex-col gap-5'>
                  {formik.values.type && formik.values.name.trim() ? (
                    <DataFieldInput
                      field={{
                        type: formik.values.type,
                        name: formik.values.name.trim(),
                        unit: formik.values.type === "Text" || formik.values.type === "Number" ? formik.values.unit.trim() || undefined : undefined,
                        mandatory: formik.values.mandatory ?? undefined,
                        icon: formik.values.icon ?? undefined,
                        options: formikOptionLines(formik.values.options),
                        accept: formik.values.accept,
                        multiple: formik.values.multiple,
                      }}
                      value={previewValue}
                      onChange={setPreviewValue}
                      previewOnly={formik.values.type === "Image"}
                    />
                  ) : (
                    <Box className='flex flex-col items-center gap-4'>
                      <Box className='flex flex-col gap-2 items-center'>
                        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
                          <File className='text-text-secondary' />
                        </Box>
                        <Typography>Fill the required fields(*) to see the preview!</Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}
