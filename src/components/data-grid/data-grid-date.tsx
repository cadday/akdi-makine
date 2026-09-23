import dayjs from "dayjs";

import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid-pro";
import { DatePicker } from "@mui/x-date-pickers";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { cn } from "@/lib/utils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function DataGridDate(props: GridRenderEditCellParams) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();
  function handleChange(newValue: any) {
    apiRef.current.setEditCellValue({ id, field, value: dayjs(newValue).toDate() });
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        defaultValue={value ? dayjs(value) : null}
        onChange={handleChange}
        className='outlined edit-date mb-0'
        slots={{
          openPickerIcon: (props) => {
            return <Calendar className={cn(props.className, "text-text-secondary")} />;
          },
          switchViewIcon: (props) => {
            return <ChevronDown size={16} className={cn(props.className, "text-text-secondary")} />;
          },
          leftArrowIcon: (props) => {
            return <ChevronLeft size={16} className={cn(props.className, "text-text-secondary")} />;
          },
          rightArrowIcon: (props) => {
            return <ChevronRight size={16} className={cn(props.className, "text-text-secondary")} />;
          },
        }}
        slotProps={{
          textField: { size: "small", variant: "standard" },
          desktopPaper: { className: "outlined" },
        }}
      />
    </LocalizationProvider>
  );
}
