import "yet-another-react-lightbox/styles.css";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";

import { Box, Card, CardContent, Grid } from "@mui/material";
import { ChevronLeft, ChevronRight, TriangleAlert, X } from "lucide-react";

const largeImages = [
  {
    src: "https://picsum.photos/seed/picsum-1/800/600",
  },
  {
    src: "https://picsum.photos/seed/picsum-2/800/600",
  },
  {
    src: "https://picsum.photos/seed/picsum-3/800/600",
  },
  {
    src: "https://picsum.photos/seed/picsum-4/800/600",
  },
];
const smallImages = [
  "https://picsum.photos/seed/picsum-1/400/300",
  "https://picsum.photos/seed/picsum-2/400/300",
  "https://picsum.photos/seed/picsum-3/400/300",
  "https://picsum.photos/seed/picsum-4/400/300",
];

export default function LightboxGallery() {
  const [index, setIndex] = useState(-1);

  return (
    <Card>
      <CardContent>
        <Grid size={12} container spacing={1}>
          {smallImages.map((image, index) => {
            return (
              <Grid size={"auto"} key={index}>
                <img alt='lightbox image' src={image} className='w-32 h-24 cursor-pointer rounded-lg' onClick={() => setIndex(index)} />
              </Grid>
            );
          })}
        </Grid>

        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={largeImages}
          controller={{
            closeOnBackdropClick: true,
          }}
          className='rounded-lightbox'
          render={{
            iconPrev: () => (
              <Box className='w-5 h-5 flex items-center justify-center'>
                <ChevronLeft size={16} />
              </Box>
            ),
            iconNext: () => (
              <Box className='w-5 h-5 flex items-center justify-center'>
                <ChevronRight size={16} />
              </Box>
            ),
            iconClose: () => (
              <Box className='w-5 h-5 flex items-center justify-center'>
                <X size={16} />
              </Box>
            ),
            iconError: () => <TriangleAlert className='text-text-contrast' />,
          }}
        />
      </CardContent>
    </Card>
  );
}
