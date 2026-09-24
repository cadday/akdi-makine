import type { DataFieldDefinition, DynamicDataValue, UploadedImage } from "@/context/db-context";
import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, Input, InputAdornment, MenuItem, Select, TextareaAutosize } from "@mui/material";
import { ChevronDown, Hexagon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import ImageDataFieldInput, { ImageDataFieldInputEdit } from "@/components/data-fields/image-data-field-input";

interface DataFieldInputProps {
  field: Pick<DataFieldDefinition, "type" | "name" | "unit" | "mandatory" | "icon" | "options" | "multipleSelection" | "accept" | "multiple">;
  value: DynamicDataValue;
  onChange: (value: DynamicDataValue) => void;
  error?: string;
  pendingFiles?: File[];
  previewOnly?: boolean;
  editableImages?: boolean;
  onPendingFilesChange?: (files: File[]) => void;
}

function isUploadedImage(value: unknown): value is UploadedImage {
  return Boolean(value && typeof value === "object" && "id" in value && "name" in value && "type" in value && "size" in value);
}

export default function DataFieldInput({ field, value, onChange, error, pendingFiles, previewOnly, editableImages, onPendingFilesChange }: DataFieldInputProps) {
  const fieldIcon = field.icon ? <DynamicIcon name={field.icon} className={cn(error && "text-error!")} /> : <Hexagon className={cn(error && "text-error!")} />;
  const label = field.name;
  const labelClassName = cn(error && "text-error!");
  const ImageInput = editableImages ? ImageDataFieldInputEdit : ImageDataFieldInput;

  switch (field.type) {
    case "Text":
      return (
        <Box className='flex flex-row gap-2'>
          {fieldIcon}
          <FormControl className='outlined' variant='standard' size='small' fullWidth required={field.mandatory}>
            <FormLabel component='label' className={labelClassName}>{label}</FormLabel>
            <Input
              value={typeof value === "string" ? value : ""}
              onChange={(event) => onChange(event.target.value)}
              endAdornment={field.unit ? <InputAdornment position='end'>{field.unit}</InputAdornment> : undefined}
            />
          </FormControl>
        </Box>
      );
    case "Textarea":
      return (
        <Box className='flex flex-row gap-2'>
          {fieldIcon}
          <FormControl className='MuiTextField-root outlined' fullWidth required={field.mandatory}>
            <FormLabel component='label' className={labelClassName}>{label}</FormLabel>
            <TextareaAutosize
              value={typeof value === "string" ? value : ""}
              onChange={(event) => onChange(event.target.value)}
              minRows={3}
              maxRows={6}
              className='MuiInputBase-root MuiInput-root MuiInputBase-formControl outlined autosize w-full'
            />
          </FormControl>
        </Box>
      );
    case "Number":
      return (
        <Box className='flex flex-row gap-2'>
          {fieldIcon}
          <FormControl className='outlined' variant='standard' size='small' fullWidth required={field.mandatory}>
            <FormLabel component='label' className={labelClassName}>{label}</FormLabel>
            <Input
              type='number'
              value={typeof value === "number" ? value : ""}
              onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
              endAdornment={field.unit ? <InputAdornment position='end'>{field.unit}</InputAdornment> : undefined}
            />
          </FormControl>
        </Box>
      );
    case "Select": {
      const options = field.options ?? [];
      const selected = Array.isArray(value) && value.every((item) => typeof item === "string") ? (value as string[]) : [];
      if (field.multipleSelection) {
        return (
          <Box className='flex flex-row gap-2'>
            {fieldIcon}
            <FormControl
              className='outlined'
              variant='standard'
              size='small'
              fullWidth
              required={field.mandatory}
              disabled={options.length === 0}
            >
              <FormLabel component='label' className={labelClassName}>{label}</FormLabel>
              <Select<string[]>
                multiple
                value={selected}
                IconComponent={ChevronDown}
                displayEmpty
                onChange={(event) => onChange(typeof event.target.value === "string" ? event.target.value.split(",") : event.target.value)}
                renderValue={(selectedOptions) => selectedOptions.join(", ")}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    <FormControlLabel control={<Checkbox checked={selected.includes(option)} />} label={option} />
                  </MenuItem>
                ))}
              </Select>
              {options.length === 0 && <FormHelperText>No options are configured.</FormHelperText>}
            </FormControl>
          </Box>
        );
      }
      return (
        <Box className='flex flex-row gap-2'>
          {fieldIcon}
          <FormControl
            className='outlined'
            variant='standard'
            size='small'
            fullWidth
            required={field.mandatory}
            disabled={options.length === 0}
          >
            <FormLabel component='label' className={labelClassName}>{label}</FormLabel>
            <Select<string>
              value={typeof value === "string" ? value : ""}
              displayEmpty
              onChange={(event) => onChange(event.target.value)}
              IconComponent={ChevronDown}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {options.length === 0 && <FormHelperText>No options are configured.</FormHelperText>}
          </FormControl>
        </Box>
      );
    }
    case "Boolean":
      return (
        <Box className='flex flex-row gap-2'>
          {fieldIcon}
          <FormControl className='outlined' variant='standard' size='small' fullWidth required={field.mandatory}>
            <FormLabel component='label' className={labelClassName}>{label}</FormLabel>
            <Select<string>
              value={typeof value === "boolean" ? String(value) : ""}
              displayEmpty
              IconComponent={ChevronDown}
              onChange={(event) => onChange(event.target.value === "" ? null : event.target.value === "true")}
            >
              <MenuItem value='true'>True</MenuItem>
              <MenuItem value='false'>False</MenuItem>
            </Select>
          </FormControl>
        </Box>
      );
    case "Image":
      return (
        <ImageInput
          name={label}
          accept={field.accept}
          multiple={field.multiple}
          mandatory={field.mandatory}
          error={error}
          value={Array.isArray(value) && value.every(isUploadedImage) ? (value as UploadedImage[]) : null}
          pendingFiles={pendingFiles}
          previewOnly={previewOnly}
          onChange={(images) => onChange(images)}
          onPendingFilesChange={onPendingFilesChange}
        />
      );
  }
}
