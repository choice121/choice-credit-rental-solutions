import { useRef, useCallback, useState } from "react";
import { toPng, toJpeg } from "html-to-image";

export type ExportFormat = "png" | "jpg";

export function useImageExport() {
  const ref = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const download = useCallback(
    async (format: ExportFormat, filename: string) => {
      if (!ref.current) return;
      setExporting(true);
      try {
        const opts = { quality: 0.95, pixelRatio: 1 };
        const dataUrl =
          format === "png"
            ? await toPng(ref.current, opts)
            : await toJpeg(ref.current, opts);
        const link = document.createElement("a");
        link.download = `${filename}.${format}`;
        link.href = dataUrl;
        link.click();
      } finally {
        setExporting(false);
      }
    },
    []
  );

  return { ref, download, exporting };
}
