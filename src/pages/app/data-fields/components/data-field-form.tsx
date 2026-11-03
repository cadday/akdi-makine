import { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
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
import {
  Bookmark,
  ChevronDown,
  CopyCheck,
  File,
  Image,
  Images,
  ListTree,
  Package2,
  PencilRuler,
  Ruler,
  Save,
  Scroll,
  SquaresSubtract,
  TriangleAlert,
  X,
  XSquare,
} from "lucide-react";
import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import DataFieldInput from "@/components/data-fields/data-field-input";
import type { DataFieldContainer, DataFieldDefinition, DataFieldType, DynamicDataValue } from "@/context/db-context";
import { DATA_FIELD_CONTAINERS, DATA_FIELD_TYPES } from "@/lib/db";
import { cn } from "@/lib/utils";
import useAppNotifications from "@/hooks/use-app-notifications";
import { useTranslation } from "react-i18next";

type DataFieldFormValues = Pick<DataFieldDefinition, "name"> &
  Required<Pick<DataFieldDefinition, "description" | "unit" | "accept" | "multiple" | "multipleSelection">> & {
    options: string;
    type: DataFieldType | "";
    mandatory: NonNullable<DataFieldDefinition["mandatory"]> | null;
    icon: NonNullable<DataFieldDefinition["icon"]> | null;
    container: DataFieldContainer | "";
  };

type DataFieldSaveInput = Omit<DataFieldDefinition, "id" | "createdAt" | "updatedAt">;
type DataFieldIcon = NonNullable<DataFieldDefinition["icon"]>;

const IMAGE_ACCEPT_OPTIONS = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"];

interface DataFieldFormProps {
  dataField?: DataFieldDefinition;
  initialDataField?: DataFieldDefinition;
  onSave: (input: DataFieldSaveInput) => Promise<void>;
  saveLabel?: string;
}

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

function getInitialValues(dataField?: DataFieldDefinition): DataFieldFormValues {
  return {
    type: dataField?.type ?? "",
    container: dataField?.container ?? "",
    name: dataField?.name ?? "",
    unit: dataField?.unit ?? "",
    description: dataField?.description ?? "",
    options: dataField?.options?.join("\n") ?? "",
    multipleSelection: dataField?.multipleSelection ?? false,
    accept: dataField?.accept ?? IMAGE_ACCEPT_OPTIONS.join(","),
    multiple: dataField?.multiple ?? false,
    mandatory: dataField?.mandatory ?? null,
    icon: dataField?.icon ?? null,
  };
}

function toSaveInput(values: DataFieldFormValues): DataFieldSaveInput | null {
  if (!values.type || !values.name.trim() || !values.container) return null;

  return {
    type: values.type,
    name: values.name.trim(),
    description: values.description.trim(),
    container: values.container,
    ...((values.type === "Text" || values.type === "Number") && values.unit.trim() && { unit: values.unit.trim() }),
    ...(values.type === "Select" && { options: formikOptionLines(values.options), multipleSelection: values.multipleSelection }),
    ...(values.type === "Image" && { accept: values.accept, multiple: values.multiple }),
    ...(values.mandatory !== null && { mandatory: values.mandatory }),
    ...(values.icon && { icon: values.icon }),
  };
}

export default function DataFieldForm({ dataField, initialDataField, onSave, saveLabel }: DataFieldFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [previewValue, setPreviewValue] = useState<DynamicDataValue>(null);
  const isEditing = Boolean(dataField);
  const { showError } = useAppNotifications();
  const { t } = useTranslation();

  const validationSchema = useMemo(
    () =>
      yup.object({
        type: yup.string().required(t("add-form-type-required")),
        container: yup.string().required(t("add-form-container-required")),
        name: yup.string().trim().required(t("add-form-data-field-name-required")),
        description: yup.string(),
        mandatory: yup.boolean().nullable(),
        icon: yup.string().nullable(),
        options: yup.string().when("type", {
          is: (type: DataFieldType | "") => type === "Select",
          then: (schema) => schema.test("has-options", t("add-form-option-required"), (value) => formikOptionLines(value ?? "").length > 0),
        }),
        accept: yup.string().when("type", {
          is: (type: DataFieldType | "") => type === "Image",
          then: (schema) =>
            schema
              .required(t("add-form-image-type-required"))
              .test("accepted-image-types", t("add-form-image-type-required"), (value) => Boolean(value?.split(",").some((type) => type.trim()))),
        }),
        multiple: yup.boolean(),
        multipleSelection: yup.boolean(),
      }),
    [t],
  );

  const formik = useFormik<DataFieldFormValues>({
    initialValues: getInitialValues(dataField ?? initialDataField),
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const input = toSaveInput(values);
      if (!input) return;
      try {
        await onSave(input);
      } catch (error) {
        showError(t("add-form-save-data-field-error", { error: String(error) }));
      }
    },
    validateOnBlur: false,
    validateOnMount: false,
  });

  const hasFieldError = (field: keyof DataFieldFormValues) => Boolean(formik.errors[field]);

  return (
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
            {t("add-schema")}
          </Typography>
          <Card>
            <CardContent className='-mb-4'>
              <Box className='flex flex-row gap-2'>
                <PencilRuler className={cn("flex-none", hasFieldError("type") && submitted && "text-error!")} />
                <FormControl fullWidth size='small' variant='standard' className='outlined' required>
                  <FormLabel component='label' className={cn(hasFieldError("type") && submitted && "text-error!")}>
                    {t("add-type")}
                  </FormLabel>
                  <Select<DataFieldType | "">
                    value={formik.values.type}
                    disabled={isEditing}
                    onChange={(event) => {
                      const type = event.target.value as DataFieldType | "";
                      void formik.setValues((values) => ({
                        ...values,
                        type,
                        unit: type === "Text" || type === "Number" ? values.unit : "",
                        multipleSelection: type === "Select" ? values.multipleSelection : false,
                      }));
                      setPreviewValue(null);
                    }}
                    IconComponent={ChevronDown}
                    MenuProps={{ className: "outlined" }}
                  >
                    {DATA_FIELD_TYPES.map((fieldType) => (
                      <MenuItem key={fieldType} value={fieldType}>
                        {t(`listing-data-field-${fieldType.toLowerCase()}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box className='flex flex-row gap-2'>
                <Package2 className={cn("flex-none", hasFieldError("container") && submitted && "text-error!")} />
                <FormControl fullWidth size='small' variant='standard' className='outlined' required>
                  <FormLabel component='label' className={cn(hasFieldError("container") && submitted && "text-error!")}>
                    {t("add-container")}
                  </FormLabel>
                  <Select<DataFieldContainer | "">
                    value={formik.values.container}
                    disabled={isEditing}
                    onChange={(event) => void formik.setFieldValue("container", event.target.value)}
                    IconComponent={ChevronDown}
                    MenuProps={{ className: "outlined" }}
                  >
                    {DATA_FIELD_CONTAINERS.map((fieldContainer) => (
                      <MenuItem key={fieldContainer} value={fieldContainer}>
                        {t(fieldContainer === "Specimen" ? "specimen" : "test")}
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
            {t("add-definition")}
          </Typography>
          <Card>
            <CardContent className='-mb-4'>
              <Box className='flex flex-row gap-2'>
                <Bookmark className={cn("flex-none", hasFieldError("name") && submitted && "text-error!")} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={cn(hasFieldError("name") && submitted && "text-error!")}>
                    {t("add-name")}
                  </FormLabel>
                  <Input name='name' value={formik.values.name} onChange={formik.handleChange} />
                </FormControl>
              </Box>

              <Box className='flex flex-row gap-2'>
                <Scroll className='flex-none' />
                <FormControl className='MuiTextField-root outlined' fullWidth>
                  <FormLabel component='label'>{t("add-description")}</FormLabel>
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
                <TriangleAlert className='flex-none' />
                <FormControl fullWidth size='small' variant='standard' className='outlined'>
                  <FormLabel component='label'>{t("add-mandatory")}</FormLabel>
                  <Select<string>
                    value={formik.values.mandatory === null ? "" : String(formik.values.mandatory)}
                    onChange={(event) => void formik.setFieldValue("mandatory", event.target.value === "" ? null : event.target.value === "true")}
                    IconComponent={ChevronDown}
                    MenuProps={{ className: "outlined" }}
                  >
                    <MenuItem value='false'>{t("add-no")}</MenuItem>
                    <MenuItem value='true'>{t("add-yes")}</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box className='flex flex-row gap-2'>
                <SquaresSubtract className='flex-none' />
                <FormControl fullWidth>
                  <FormLabel component='label'>{t("add-icon")}</FormLabel>
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
                    slotProps={{ popper: { className: "outlined" }, chip: { variant: "filled", size: "small" } }}
                    renderOption={(props, name) => (
                      <li {...props} key={name}>
                        <DynamicIcon name={name} className='me-2' />
                        <span>{name}</span>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='standard'
                        className='outlined'
                        placeholder={t("add-search-icons")}
                        slotProps={{
                          htmlInput: { ...params.slotProps.htmlInput, autoComplete: "new-password" },
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
                    )}
                  />
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {(formik.values.type === "Select" || formik.values.type === "Image" || formik.values.type === "Text" || formik.values.type === "Number") && (
          <Grid size={12}>
            <Typography variant='h6' component='h6' className='mb-3'>
              {t("add-type-options")}
            </Typography>
            <Card>
              <CardContent className='-mb-4'>
                {formik.values.type === "Select" && (
                  <>
                    <Box className='flex flex-row gap-2'>
                      <ListTree className={cn("flex-none", hasFieldError("options") && submitted && "text-error!")} />
                      <FormControl className='MuiTextField-root outlined' fullWidth required>
                        <FormLabel component='label' className={cn(hasFieldError("options") && submitted && "text-error!")}>
                          {t("add-options")}
                        </FormLabel>
                        <TextareaAutosize
                          name='options'
                          value={formik.values.options}
                          onChange={formik.handleChange}
                          minRows={3}
                          maxRows={6}
                          placeholder={t("add-one-option-per-line")}
                          className='MuiInputBase-root MuiInput-root MuiInputBase-formControl outlined autosize w-full'
                        />
                      </FormControl>
                    </Box>
                    <Box className='flex flex-row gap-2'>
                      <CopyCheck className='flex-none' />
                      <FormGroup className='flex flex-col'>
                        <FormLabel component='label'>{t("add-multiple-choices")}</FormLabel>
                        <FormControlLabel
                          label={t("add-allow")}
                          control={
                            <Checkbox
                              checked={formik.values.multipleSelection}
                              onChange={(event) => void formik.setFieldValue("multipleSelection", event.target.checked)}
                            />
                          }
                        />
                      </FormGroup>
                    </Box>
                  </>
                )}

                {formik.values.type === "Image" && (
                  <>
                    <Box className='flex flex-row gap-2'>
                      <Image className='flex-none' />
                      <FormControl fullWidth size='small' variant='standard' className='outlined'>
                        <FormLabel component='label'>{t("add-accepted-image-types")}</FormLabel>
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
                              <FormControlLabel
                                control={<Checkbox checked={formik.values.accept.split(",").includes(type)} />}
                                label={capitalize(type.replace("image/", ""))}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box className='flex flex-row gap-2'>
                      <Images className='flex-none' />
                      <FormGroup className='flex flex-col'>
                        <FormLabel component='label'>{t("add-multiple-images")}</FormLabel>
                        <FormControlLabel
                          label={t("add-allow")}
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
                    <Ruler className='flex-none' />
                    <FormControl className='outlined' variant='standard' size='small' fullWidth>
                      <FormLabel component='label'>{t("add-unit")}</FormLabel>
                      <Input name='unit' value={formik.values.unit} onChange={formik.handleChange} />
                    </FormControl>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid size={12}>
          {submitted && !formik.isValid && (
            <Alert severity='error' icon={<XSquare />} className='neutral rounded-3xl! bg-transparent! mb-2 mt-2 p-5'>
              <AlertTitle variant='subtitle1' className='pt-0.5'>
                {t("add-validation-summary")}
              </AlertTitle>
              {Object.entries(formik.errors).map(([key, value]) => (
                <Box className='flex flex-row gap-0.5' key={key}>
                  <Typography className='text-error'>
                    {(key === "type"
                      ? t("add-type")
                      : key === "container"
                        ? t("add-container")
                        : key === "name"
                          ? t("add-name")
                          : key === "description"
                            ? t("add-description")
                            : key === "options"
                              ? t("add-options")
                              : key === "accept"
                                ? t("add-accepted-image-types")
                                : capitalize(key)) + ":"}
                  </Typography>
                  <Typography className='text-text-primary'>{typeof value === "string" ? value : JSON.stringify(value)}</Typography>
                </Box>
              ))}
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
            {saveLabel ?? t("save")}
          </Button>
        </Grid>
      </Grid>

      <Grid size={{ lg: 4, xs: 12 }} container>
        <Grid size={12}>
          <Typography variant='h6' component='h6' className='mb-3'>
            {t("add-preview")}
          </Typography>
          <Card>
            <CardContent className='flex flex-col gap-5 -mb-4'>
              {formik.values.type && formik.values.name.trim() ? (
                <DataFieldInput
                  field={{
                    type: formik.values.type,
                    name: formik.values.name.trim(),
                    unit: formik.values.type === "Text" || formik.values.type === "Number" ? formik.values.unit.trim() || undefined : undefined,
                    mandatory: formik.values.mandatory ?? undefined,
                    icon: formik.values.icon ?? undefined,
                    options: formikOptionLines(formik.values.options),
                    multipleSelection: formik.values.multipleSelection,
                    accept: formik.values.accept,
                    multiple: formik.values.multiple,
                  }}
                  value={previewValue}
                  onChange={setPreviewValue}
                  previewOnly={formik.values.type === "Image"}
                />
              ) : (
                <Box className='flex flex-col items-center gap-4 mb-4'>
                  <Box className='flex flex-col gap-2 items-center'>
                    <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
                      <File className='text-text-secondary' />
                    </Box>
                    <Typography>{t("add-preview-required-fields")}</Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
