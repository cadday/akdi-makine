import { useEffect, useRef } from "react";

export default function usePrintReadiness(enabled: boolean, isLoading: boolean, error: string | null) {
  const hasSignaled = useRef(false);

  useEffect(() => {
    if (!enabled || isLoading || hasSignaled.current) return;
    let cancelled = false;
    let observer: MutationObserver | undefined;

    const waitForImages = async () => {
      await Promise.race([
        new Promise<void>((resolve) => {
          const checkAssets = () => {
            if (document.querySelector('[data-print-assets-loading="true"]')) return;
            observer?.disconnect();
            resolve();
          };
          observer = new MutationObserver(checkAssets);
          observer.observe(document.body, { attributes: true, childList: true, subtree: true });
          checkAssets();
        }),
        new Promise<void>((resolve) => window.setTimeout(resolve, 10_000)),
      ]);
      observer?.disconnect();
      await Promise.race([
        Promise.all(Array.from(document.images, (image) => image.decode().catch(() => undefined))),
        new Promise<void>((resolve) => window.setTimeout(resolve, 10_000)),
      ]);
    };

    const signalReady = async () => {
      if (!error) {
        await Promise.race([document.fonts.ready, new Promise<void>((resolve) => window.setTimeout(resolve, 10_000))]);
        await waitForImages();
        await new Promise<void>((resolve) => window.setTimeout(resolve, 100));
      }
      if (cancelled || hasSignaled.current) return;
      hasSignaled.current = true;
      await window.electronAPI.notifyPdfReady(error ?? undefined).catch(() => undefined);
    };

    void signalReady().catch(async (readinessError: unknown) => {
      if (cancelled || hasSignaled.current) return;
      hasSignaled.current = true;
      await window.electronAPI.notifyPdfReady(String(readinessError)).catch(() => undefined);
    });
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [enabled, error, isLoading]);
}