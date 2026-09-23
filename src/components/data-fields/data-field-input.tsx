import type { DataFieldDefinition, DynamicDataValue, UploadedImage } from "@/context/db-context";
import { Box, Checkbox, FormControl, FormHelperText, FormLabel, Input, InputAdornment, MenuItem, Select } from "@mui/material";
import { ChevronDown, Hexagon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import ImageDataFieldInput from "@/components/data-fields/image-data-field-input";

interface DataFieldInputProps {
  field: Pick<DataFieldDefinition, "type" | "name" | "unit" | "mandatory" | "icon" | "options" | "accept" | "multiple">;
  value: DynamicDataValue;
  onChange: (value: DynamicDataValue) => void;
  error?: string;
  pendingFiles?: File[];
  previewOnly?: boolean;
  onPendingFilesChange?: (files: File[]) => void;
}

function isUploadedImage(value: unknown): value is UploadedImage {
  return Boolean(value && typeof value === "object" && "id" in value && "name" in value && "type" in value && "size" in value);
}

export default function DataFieldInput({ field, value, onChange, error, pendingFiles, previewOnly, onPendingFilesChange }: DataFieldInputProps) {
  const fieldIcon = field.icon ? <DynamicIcon name={field.icon} className={cn(error && "text-error!")} /> : <Hexagon className={cn(error && "text-error!")} />;
  const label = field.name;
  const labelClassName = cn(error && "text-error!");

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
    case "Multi-Select": {
      const options = field.options ?? [];
      const selected = Array.isArray(value) && value.every((item) => typeof item === "string") ? (value as string[]) : [];
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
            <Checkbox className='self-start' checked={value === true} onChange={(event) => onChange(event.target.checked)} />
          </FormControl>
        </Box>
      );
    case "Image":
      return (
        <ImageDataFieldInput
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
