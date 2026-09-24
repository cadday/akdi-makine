import { useEffect, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { Alert, Box, Button, FormControl, FormLabel, Typography } from "@mui/material";
import { ImagePlus, Trash2 } from "lucide-react";
import type { UploadedImage } from "@/context/db-context";
import { cn } from "@/lib/utils";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const EMPTY_IMAGES: UploadedImage[] = [];
const EMPTY_FILES: File[] = [];

interface ImagePreview {
  key: string;
  name: string;
  url: string | null;
  image?: UploadedImage;
}

interface StoredImagePreviewsProps {
  images: UploadedImage[];
  onRemove?: (image: UploadedImage) => void;
  imageClassName?: string;
}

export function StoredImagePreviews({ images, onRemove, imageClassName }: StoredImagePreviewsProps) {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    const loadPreviews = async () => {
      const loaded = await Promise.all(
        images.map(async (image) => {
          try {
            const result = await window.electronAPI.readImage(image.id);
            if (!result) return { key: image.id, name: image.name, url: null, image };
            const bytes = new Uint8Array(result.bytes).buffer;
            const url = URL.createObjectURL(new Blob([bytes], { type: image.type }));
            objectUrls.push(url);
            return { key: image.id, name: image.name, url, image };
          } catch {
            return { key: image.id, name: image.name, url: null, image };
          }
        }),
      );

      if (cancelled) {
        objectUrls.forEach((url) => URL.revokeObjectURL(url));
        return;
      }
      setPreviews(loaded);
    };

    void loadPreviews();
    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  if (previews.length === 0) return null;

  return (
    <Box className='flex items-center gap-1 h-full'>
      {previews.map((preview) => (
        <Box key={preview.key}>
          {preview.url ? (
            <img alt={preview.name} src={preview.url} className={cn("h-full w-full object-cover rounded-xs", imageClassName)} />
          ) : (
            <Typography variant='caption' className='px-1 text-center'>
              {preview.name}
            </Typography>
          )}
          {onRemove && preview.image && (
            <Button
              type='button'
              aria-label={`Remove ${preview.name}`}
              className='icon-only absolute right-0.5 top-0.5 flex-none bg-white/90'
              size='tiny'
              color='grey'
              variant='pastel'
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onRemove(preview.image!);
              }}
            >
              <Trash2 size={14} />
            </Button>
          )}
        </Box>
      ))}
    </Box>
  );
}

interface ImageDataFieldInputProps {
  name: string;
  accept?: string;
  multiple?: boolean;
  mandatory?: boolean;
  error?: string;
  value: UploadedImage[] | null;
  pendingFiles?: File[];
  previewOnly?: boolean;
  onChange: (images: UploadedImage[]) => void;
  onPendingFilesChange?: (files: File[]) => void;
}

function parseAccept(value?: string): Accept {
  const tokens = (value || "image/*")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
  return tokens.reduce<Accept>((accept, token) => {
    const mimeType = token.includes("/") ? token : "image/*";
    accept[mimeType] = [...(accept[mimeType] ?? []), ...(token.startsWith(".") ? [token] : [])];
    return accept;
  }, {});
}

export default function ImageDataFieldInput({
  name,
  accept,
  multiple = false,
  mandatory,
  error,
  value,
  pendingFiles = EMPTY_FILES,
  previewOnly = false,
  onChange,
  onPendingFilesChange,
}: ImageDataFieldInputProps) {
  const [dropError, setDropError] = useState<string | null>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const canSelectFiles = Boolean(onPendingFilesChange || previewOnly);
  const activePendingFiles = onPendingFilesChange ? pendingFiles : previewFiles;
  const images = value ?? EMPTY_IMAGES;
  const [pendingPreviews, setPendingPreviews] = useState<Array<{ key: string; file: File; url: string }>>([]);

  useEffect(() => {
    const previews = activePendingFiles.map((file, index) => ({
      key: `${file.name}-${file.lastModified}-${file.size}-${index}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setPendingPreviews(previews);
    return () => previews.forEach(({ url }) => URL.revokeObjectURL(url));
  }, [activePendingFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: parseAccept(accept),
    multiple,
    maxFiles: multiple ? 0 : 1,
    maxSize: MAX_IMAGE_BYTES,
    disabled: !canSelectFiles,
    onDrop: (acceptedFiles, rejectedFiles) => {
      setDropError(rejectedFiles.length ? rejectedFiles[0].errors.map((item) => item.message).join(" ") : null);
      if (acceptedFiles.length) {
        const nextFiles = multiple ? [...activePendingFiles, ...acceptedFiles] : acceptedFiles;
        if (onPendingFilesChange) onPendingFilesChange(nextFiles);
        else if (previewOnly) setPreviewFiles(nextFiles);
      }
    },
  });

  return (
    <Box className='flex flex-row gap-2'>
      <ImagePlus className={error ? "text-error!" : undefined} />
      <FormControl className='outlined' variant='standard' size='small' fullWidth required={mandatory}>
        <FormLabel component='label' className={error ? "text-error!" : undefined}>
          {name}
        </FormLabel>
        {canSelectFiles ? (
          <Box
            {...getRootProps({ className: "dropzone" })}
            className={`border-grey-200 hover:border-grey-500 flex min-h-22.5 flex-row flex-wrap items-center gap-2.5 rounded-md border p-4 transition-colors ${isDragActive ? "border-primary" : ""} ${!canSelectFiles ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          >
            <input {...getInputProps()} />
            <StoredImagePreviews
              images={!multiple && activePendingFiles.length > 0 ? EMPTY_IMAGES : images}
              onRemove={onPendingFilesChange ? (image) => onChange(images.filter((item) => item.id !== image.id)) : undefined}
            />
            {pendingPreviews.map(({ key, file, url }) => (
              <Box key={key} className='bg-grey-20 flex w-full items-center gap-2 rounded-sm p-1'>
                <img alt={file.name} src={url} className='h-12 w-16 rounded-xs object-cover' />
                <Box className='flex min-w-0 flex-1 items-center justify-between gap-1 pe-2'>
                  <Box className='min-w-0'>
                    <Typography variant='body2' className='truncate'>
                      {file.name}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      {Math.round(file.size / 1000)} KB
                    </Typography>
                  </Box>
                  <Button
                    aria-label={`Remove ${file.name}`}
                    className='icon-only flex-none'
                    size='tiny'
                    color='grey'
                    variant='pastel'
                    onClick={(event) => {
                      event.stopPropagation();
                      const nextFiles = activePendingFiles.filter(
                        (_, index) =>
                          `${activePendingFiles[index].name}-${activePendingFiles[index].lastModified}-${activePendingFiles[index].size}-${index}` !== key,
                      );
                      if (onPendingFilesChange) onPendingFilesChange(nextFiles);
                      else if (previewOnly) setPreviewFiles(nextFiles);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </Box>
              </Box>
            ))}
            <Box className='flex min-h-12 flex-1 items-center justify-center gap-2 px-3'>
              <ImagePlus size={18} />
              <Typography variant='body2'>{isDragActive ? "Drop images here" : "Add or drop images"}</Typography>
            </Box>
          </Box>
        ) : (
          <Alert severity='info'>Image upload is available when entering a specimen value.</Alert>
        )}
        {dropError && (
          <Alert severity='error' className='mt-2'>
            {dropError}
          </Alert>
        )}
      </FormControl>
    </Box>
  );
}
