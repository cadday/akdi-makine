import dayjs from "dayjs";

import { GridFilterInputValueProps } from "@mui/x-data-grid-pro";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export default function DataGridDateTimeFilter(props: GridFilterInputValueProps) {
  const { item, applyValue, apiRef } = props;

  const handleChange = (newValue: unknown) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <DateTimePicker
      defaultValue={item.value ? dayjs(item.value) : null}
      onChange={handleChange}
      label={apiRef.current.getLocaleText("filterPanelInputLabel")}
      className="outlined edit-date mb-0"
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
        textField: { size: "small", variant: "standard" },
        desktopPaper: { className: "outlined" },
      }}
    />
  );
}
