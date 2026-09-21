import dayjs from "dayjs";
import { ComponentProps } from "react";

import { capitalize, Input } from "@mui/material";
import { GridFilterInputValueProps } from "@mui/x-data-grid-pro";
import { DatePicker } from "@mui/x-date-pickers";

import { cn } from "@/lib/utils";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface DataGridDateFilterProps extends GridFilterInputValueProps {
  editorProps?: ComponentProps<typeof Input>["inputProps"];
  isHeaderFilter?: boolean;
}

export default function DataGridDateFilter(props: DataGridDateFilterProps) {
  const { item, applyValue, apiRef, isHeaderFilter } = props;

  const handleChange = (newValue: unknown) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <DatePicker
      defaultValue={item.value ? dayjs(item.value) : null}
      onChange={handleChange}
      label={isHeaderFilter ? capitalize(item.operator) : apiRef.current.getLocaleText("filterPanelInputLabel")}
      className='outlined edit-date mb-0'
      slots={{
        openPickerIcon: (props) => {
          return <Calendar {...props} className={cn(props.className, "text-text-secondary")} />;
        },
        switchViewIcon: (props) => {
          return <ChevronDown size={16} {...props} className={cn(props.className, "text-text-secondary")} />;
        },
        leftArrowIcon: (props) => {
          return <ChevronLeft size={16} {...props} className={cn(props.className, "text-text-secondary")} />;
        },
        rightArrowIcon: (props) => {
          return <ChevronRight size={16} {...props} className={cn(props.className, "text-text-secondary")} />;
        },
      }}
      slotProps={{
        textField: { size: "small", variant: "outlined" },
        desktopPaper: { className: "outlined" },
      }}
    />
  );
}
