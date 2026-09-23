import { app, BrowserWindow, ipcMain } from "electron";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"]);
const IMAGE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getImagesDirectory() {
  return path.join(app.getPath("userData"), "images");
}

function getImagePath(id: unknown) {
  if (typeof id !== "string" || !IMAGE_ID_PATTERN.test(id)) {
    throw new Error("Invalid image ID");
  }
  return path.join(getImagesDirectory(), id);
}

function matchesImageSignature(type: string, bytes: Uint8Array) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.subarray(0, 8).join(",") === "137,80,78,71,13,10,26,10";
  if (type === "image/gif") return new TextDecoder().decode(bytes.subarray(0, 3)) === "GIF";
  if (type === "image/webp") return new TextDecoder().decode(bytes.subarray(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.subarray(8, 12)) === "WEBP";
  if (type === "image/bmp") return new TextDecoder().decode(bytes.subarray(0, 2)) === "BM";
  return false;
}

export function registerImageStorage(getWindow: () => BrowserWindow | null) {
  const assertTrustedImageRequest = (sender: Electron.WebContents) => {
    const window = getWindow();
    if (!window || window.isDestroyed() || sender !== window.webContents) {
      throw new Error("Unauthorized image request");
    }
  };

  ipcMain.handle("images:save", async (event, input: unknown) => {
    assertTrustedImageRequest(event.sender);
    if (!input || typeof input !== "object") throw new Error("Invalid image upload");

    const candidate = input as { name?: unknown; type?: unknown; bytes?: unknown };
    if (typeof candidate.name !== "string" || typeof candidate.type !== "string" || !(candidate.bytes instanceof Uint8Array)) {
      throw new Error("Invalid image upload");
    }

    const bytes = candidate.bytes;
    const name = path.basename(candidate.name).slice(0, 255);
    const type = candidate.type.toLowerCase();
    if (!name || !IMAGE_TYPES.has(type) || bytes.byteLength === 0 || bytes.byteLength > IMAGE_MAX_BYTES || !matchesImageSignature(type, bytes)) {
      throw new Error("Image must be a supported raster image no larger than 10 MB");
    }

    const id = randomUUID();
    await mkdir(getImagesDirectory(), { recursive: true });
    await writeFile(getImagePath(id), Buffer.from(bytes));
    return { id, name, type, size: bytes.byteLength };
  });

  ipcMain.handle("images:read", async (event, id: unknown) => {
    assertTrustedImageRequest(event.sender);
    try {
      const bytes = await readFile(getImagePath(id));
      return { bytes: new Uint8Array(bytes) };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  });

  ipcMain.handle("images:delete", async (event, id: unknown) => {
    assertTrustedImageRequest(event.sender);
    await rm(getImagePath(id), { force: true });
  });
}