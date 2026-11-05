import { Box } from "@mui/material";
import { DraftingCompass, FlaskConical, SlidersVertical, Network, Presentation, Cog } from "lucide-react";
import TabItem from "./tab-item";

export default function Tabs() {
  return (
    <Box component='ul' className='no-drag flex flex-1 flex-row px-4 gap-1 h-full items-center me-auto'>
      <TabItem active={true} title='Preset with a Very Long Name that Exceeds the Limit' icon={<FlaskConical />} />
      <TabItem title='Specimen Tab' icon={<DraftingCompass />} />
      <TabItem title='Preset Tab' icon={<SlidersVertical />} />
      <TabItem title='Data Fields Tab' icon={<Network />} />
      <TabItem title='Overview Tab' icon={<Presentation />} />
      <TabItem title='Settings Tab' icon={<Cog />} />
    </Box>
  );
}
