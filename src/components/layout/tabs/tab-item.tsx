import { cn } from "@/lib/utils";
import { Typography, Button, Box } from "@mui/material";
import { X } from "lucide-react";

export default function TabItem({ active, title, icon }: { active?: boolean; title?: string; icon?: React.ReactNode }) {
  return (
    <Box
      component='li'
      className={cn(
        "flex flex-row items-center gap-2 ps-4 pe-2 bg-grey-25 py-2 h-10 select-none rounded-lg max-w-50 relative transition-all text-text-secondary",
        active && "active",
        "outline-transparent -outline-offset-2 outline-2 hover:outline-primary-light/50 hover:text-text-primary",
        "[&.active]:outline-2 [&.active]:outline-primary-light/50 [&.active]:bg-background [&.active]:text-text-primary",
        "before:content-[''] before:block before:absolute before:h-12 before:w-full before:left-0",
      )}
    >
      {icon && <Box className='shrink-0'>{icon}</Box>}
      <Typography variant='subtitle2' className='hidden lg:flex truncate word'>
        {title}
      </Typography>
      <Button variant='text' size='tiny' color='grey' className='icon-only hover:bg-grey-300 cursor-default shrink-0'>
        <X size={12} />
      </Button>
    </Box>
  );
}
