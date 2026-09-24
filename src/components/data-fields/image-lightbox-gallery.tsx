import "yet-another-react-lightbox/styles.css";

import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { Box, ButtonBase, Grid } from "@mui/material";
import { ChevronLeft, ChevronRight, TriangleAlert, X } from "lucide-react";
import type { UploadedImage } from "@/context/db-context";

interface ImageLightboxGalleryProps {
  images: UploadedImage[];
}

interface ImagePreview {
  id: string;
  name: string;
  src: string;
}

export default function ImageLightboxGallery({ images }: ImageLightboxGalleryProps) {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    const loadImages = async () => {
      const loaded = await Promise.all(
        images.map(async (image) => {
          try {
            const result = await window.electronAPI.readImage(image.id);
            if (!result) return null;

            const bytes = new Uint8Array(result.bytes).buffer;
            const src = URL.createObjectURL(new Blob([bytes], { type: image.type }));
            objectUrls.push(src);
            return { id: image.id, name: image.name, src };
          } catch {
            return null;
          }
        }),
      );

      if (cancelled) {
        objectUrls.forEach((url) => URL.revokeObjectURL(url));
        return;
      }
      setPreviews(loaded.filter((preview): preview is ImagePreview => preview !== null));
    };

    void loadImages();
    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  useEffect(() => {
    setIndex(-1);
  }, [images]);

  if (previews.length === 0) return null;

  return (
    <>
      <Grid container spacing={1}>
        {previews.map((preview, previewIndex) => (
          <Grid size='auto' key={preview.id}>
            <ButtonBase aria-label={`Open ${preview.name}`} className='h-24 w-32 overflow-hidden rounded-lg' onClick={() => setIndex(previewIndex)}>
              <img alt={preview.name} src={preview.src} className='h-full w-full object-cover' />
            </ButtonBase>
          </Grid>
        ))}
      </Grid>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={previews.map(({ name, src }) => ({ src, alt: name }))}
        controller={{ closeOnBackdropClick: true, disableSwipeNavigation: previews.length === 1 ? true : false }}
        className='rounded-lightbox'
        render={{
          ...(previews.length === 1
            ? {
                buttonPrev: () => undefined,
                buttonNext: () => undefined,
              }
            : {}),
          iconPrev: () => (
            <Box className='flex h-5 w-5 items-center justify-center'>
              <ChevronLeft size={14} />
            </Box>
          ),
          iconNext: () => (
            <Box className='flex h-5 w-5 items-center justify-center'>
              <ChevronRight size={14} />
            </Box>
          ),
          iconClose: () => (
            <Box className='flex h-5 w-5 items-center justify-center'>
              <X size={14} />
            </Box>
          ),
          iconError: () => <TriangleAlert className='text-text-contrast' />,
        }}
      />
    </>
  );
}
