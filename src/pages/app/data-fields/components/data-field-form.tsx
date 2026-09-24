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
  ChevronDown,
  CopyCheck,
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
import DataFieldInput from "@/components/data-fields/data-field-input";
import type { DataFieldContainer, DataFieldDefinition, DataFieldType, DynamicDataValue } from "@/context/db-context";
import { DATA_FIELD_CONTAINERS, DATA_FIELD_TYPES } from "@/lib/db";
import { cn } from "@/lib/utils";
import useAppNotifications from "@/hooks/use-app-notifications";

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

export default function DataFieldForm({ dataField, initialDataField, onSave, saveLabel = "Save" }: DataFieldFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [previewValue, setPreviewValue] = useState<DynamicDataValue>(null);
  const isEditing = Boolean(dataField);
  const { showError } = useAppNotifications();

  const validationSchema = useMemo(
    () =>
      yup.object({
        type: yup.string().required("Type is required"),
        container: yup.string().required("Container is required"),
        name: yup.string().trim().required("Name is required"),
        description: yup.string(),
        mandatory: yup.boolean().nullable(),
        icon: yup.string().nullable(),
        options: yup.string().when("type", {
          is: (type: DataFieldType | "") => type === "Select",
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
        multipleSelection: yup.boolean(),
      }),
    [],
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
        showError(`Failed to save data field: ${String(error)}`);
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
            Schema
          </Typography>
          <Card>
            <CardContent className='-mb-4'>
              <Box className='flex flex-row gap-2'>
                <Signpost className={cn(hasFieldError("type") && submitted && "text-error!")} />
                <FormControl fullWidth size='small' variant='standard' className='outlined' required>
                  <FormLabel component='label' className={cn(hasFieldError("type") && submitted && "text-error!")}>
                    Type
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
                    disabled={isEditing}
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
            <CardContent className='-mb-4'>
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
                        placeholder='Search for icons'
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
              Type Related Options
            </Typography>
            <Card>
              <CardContent className='-mb-4'>
                {formik.values.type === "Select" && (
                  <>
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
                          placeholder='One option per line'
                          className='MuiInputBase-root MuiInput-root MuiInputBase-formControl outlined autosize w-full'
                        />
                      </FormControl>
                    </Box>
                    <Box className='flex flex-row gap-2'>
                      <CopyCheck />
                      <FormGroup className='flex flex-col'>
                        <FormLabel component='label'>Multiple Choices</FormLabel>
                        <FormControlLabel
                          label='Allow'
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
                              <FormControlLabel control={<Checkbox checked={formik.values.accept.split(",").includes(type)} />} label={capitalize(type.replace("image/", ""))} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box className='flex flex-row gap-2'>
                      <Images />
                      <FormGroup className='flex flex-col'>
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
          {submitted && !formik.isValid && (
            <Alert severity='error' icon={<XSquare />} className='neutral rounded-3xl! bg-transparent! mb-2 mt-2 p-5'>
              <AlertTitle variant='subtitle2' className='pt-0.5'>
                The following inputs have errors!
              </AlertTitle>
              {Object.entries(formik.errors).map(([key, value]) => (
                <Box className='flex flex-row gap-0.5' key={key}>
                  <Typography className='text-error'>{capitalize(key)}:</Typography>
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
            {saveLabel}
          </Button>
        </Grid>
      </Grid>

      <Grid size={{ lg: 4, xs: 12 }} container>
        <Grid size={12}>
          <Typography variant='h6' component='h6' className='mb-3'>
            Preview
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
                    <Typography>Fill the required fields(*) to see the preview!</Typography>
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
