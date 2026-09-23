import type { DataFieldDefinition, DynamicDataValue } from "@/context/db-context";
import { Alert, Box, Checkbox, FormControl, FormHelperText, FormLabel, Input, InputAdornment, MenuItem, Select } from "@mui/material";
import { ChevronDown, Hexagon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

interface DataFieldInputProps {
  field: Pick<DataFieldDefinition, "type" | "name" | "unit" | "mandatory" | "icon" | "options" | "accept" | "multiple">;
  value: DynamicDataValue;
  onChange: (value: DynamicDataValue) => void;
  error?: string;
}

export default function DataFieldInput({ field, value, onChange, error }: DataFieldInputProps) {
  const fieldIcon = field.icon ? <DynamicIcon name={field.icon} /> : <Hexagon />;
  const label = field.name;

  switch (field.type) {
    case "Text":
      return (
        <Box className='flex flex-row gap-2'>
          {fieldIcon}
          <FormControl className='outlined' variant='standard' size='small' fullWidth required={field.mandatory} error={Boolean(error)}>
            <FormLabel component='label'>{label}</FormLabel>
            <Input
              value={typeof value === "string" ? value : ""}
              onChange={(event) => onChange(event.target.value)}
              endAdornment={field.unit ? <InputAdornment position='end'>{field.unit}</InputAdornment> : undefined}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        </Box>
      );
    case "Number":
      return (
        <Box className='flex flex-row gap-2'>
          {fieldIcon}
          <FormControl className='outlined' variant='standard' size='small' fullWidth required={field.mandatory} error={Boolean(error)}>
            <FormLabel component='label'>{label}</FormLabel>
            <Input
              type='number'
              value={typeof value === "number" ? value : ""}
              onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
              endAdornment={field.unit ? <InputAdornment position='end'>{field.unit}</InputAdornment> : undefined}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
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
            error={Boolean(error)}
            disabled={options.length === 0}
          >
            <FormLabel component='label'>{label}</FormLabel>
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
            {error ? <FormHelperText>{error}</FormHelperText> : options.length === 0 ? <FormHelperText>No options are configured.</FormHelperText> : null}
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
            error={Boolean(error)}
            disabled={options.length === 0}
          >
            <FormLabel component='label'>{label}</FormLabel>
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
            {error ? <FormHelperText>{error}</FormHelperText> : options.length === 0 ? <FormHelperText>No options are configured.</FormHelperText> : null}
          </FormControl>
        </Box>
      );
    }
    case "Boolean":
      return (
        <Box className='flex flex-row gap-2'>
          {fieldIcon}
          <FormControl className='outlined' variant='standard' size='small' fullWidth required={field.mandatory} error={Boolean(error)}>
            <FormLabel component='label'>{label}</FormLabel>
            <Checkbox className='self-start' checked={value === true} onChange={(event) => onChange(event.target.checked)} />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        </Box>
      );
    case "Image":
      return (
        <Box className='flex flex-row gap-2'>
          {fieldIcon}
          <FormControl className='outlined' variant='standard' size='small' fullWidth>
            <FormLabel component='label'>{label}</FormLabel>
            <Alert severity='info'>Image fields are not supported in this form yet.</Alert>
          </FormControl>
        </Box>
      );
  }
}
