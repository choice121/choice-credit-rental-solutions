import { useState, useRef, useCallback } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { TEMPLATES, FORMATS } from "./templates/index";
import { useImageExport } from "./useImageExport";
import { Download, ImageIcon, RefreshCw } from "lucide-react";

// Scale the full-size template canvas down to fit the preview pane
const PREVIEW_WIDTH = 480;

function PreviewScaler({
  templateWidth,
  templateHeight,
  children,
}: {
  templateWidth: number;
  templateHeight: number;
  children: React.ReactNode;
}) {
  const scale = PREVIEW_WIDTH / templateWidth;
  const scaledHeight = Math.round(templateHeight * scale);

  return (
    <div
      style={{ width: PREVIEW_WIDTH, height: scaledHeight, overflow: "hidden", flexShrink: 0 }}
      className="rounded-lg shadow-2xl"
    >
      <div
        style={{
          width: templateWidth,
          height: templateHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function ImageGeneratorPage() {
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [formatId, setFormatId] = useState<"square" | "landscape">("square");

  const template = TEMPLATES.find((t) => t.id === templateId)!;
  const format = FORMATS.find((f) => f.id === formatId)!;

  const [fields, setFields] = useState(template.defaults);

  // When switching templates, reset fields to that template's defaults
  const handleTemplateChange = useCallback(
    (id: string) => {
      setTemplateId(id);
      const t = TEMPLATES.find((t) => t.id === id)!;
      setFields(t.defaults);
    },
    []
  );

  const { ref, download, exporting } = useImageExport();

  const slug = `choice-credit-${template.id}-${formatId}`;
  const TemplateComponent = template.component;

  const bulletsText = fields.bullets.join("\n");

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-foreground">Image Generator</h1>
        <p className="text-muted-foreground mt-1">
          Create social-ready marketing images — download as PNG or JPG.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* ── Left panel: controls ── */}
        <div className="w-full xl:w-80 flex-shrink-0 space-y-5">

          {/* Template picker */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              Template
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`text-left px-3 py-2.5 rounded-md border text-sm transition-colors ${
                    t.id === templateId
                      ? "border-primary bg-primary/8 text-foreground"
                      : "border-border hover:border-primary/50 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div className="font-medium text-foreground">{t.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Format picker */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              Format
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormatId(f.id as "square" | "landscape")}
                  className={`text-left px-3 py-2 rounded-md border text-sm transition-colors ${
                    f.id === formatId
                      ? "border-primary bg-primary/8 text-foreground"
                      : "border-border hover:border-primary/50 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div className="font-medium">{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.description}</div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Text fields */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Content
            </Label>

            <div className="space-y-1">
              <Label htmlFor="headline" className="text-sm">Headline</Label>
              <Textarea
                id="headline"
                value={fields.headline}
                onChange={(e) => setFields((f) => ({ ...f, headline: e.target.value }))}
                rows={3}
                className="resize-none text-sm"
                placeholder="Main headline text"
              />
              <p className="text-xs text-muted-foreground">Use line breaks for multi-line headlines</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="subtext" className="text-sm">Subtext</Label>
              <Textarea
                id="subtext"
                value={fields.subtext}
                onChange={(e) => setFields((f) => ({ ...f, subtext: e.target.value }))}
                rows={2}
                className="resize-none text-sm"
                placeholder="Supporting text below headline"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="bullets" className="text-sm">Bullet Points</Label>
              <Textarea
                id="bullets"
                value={bulletsText}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    bullets: e.target.value.split("\n").filter((l) => l.trim()),
                  }))
                }
                rows={4}
                className="resize-none text-sm"
                placeholder="One bullet per line"
              />
              <p className="text-xs text-muted-foreground">One item per line — leave blank to hide</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="badge" className="text-sm">Badge / Label</Label>
              <Input
                id="badge"
                value={fields.badge ?? ""}
                onChange={(e) => setFields((f) => ({ ...f, badge: e.target.value }))}
                placeholder="e.g. Credit Repair, FREE"
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="accent" className="text-sm">Accent Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="accent"
                  type="color"
                  value={fields.accentColor}
                  onChange={(e) => setFields((f) => ({ ...f, accentColor: e.target.value }))}
                  className="h-9 w-14 rounded border border-border cursor-pointer bg-background p-0.5"
                />
                <Input
                  value={fields.accentColor}
                  onChange={(e) => setFields((f) => ({ ...f, accentColor: e.target.value }))}
                  className="font-mono text-sm flex-1"
                  placeholder="#F59E0B"
                  maxLength={7}
                />
              </div>
              {/* Preset swatches */}
              <div className="flex gap-1.5 flex-wrap mt-1">
                {["#F59E0B", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#EC4899", "#FFFFFF"].map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setFields((f) => ({ ...f, accentColor: c }))}
                      title={c}
                      className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        background: c,
                        borderColor: c === fields.accentColor ? "#fff" : "transparent",
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Reset button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => setFields(template.defaults)}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Reset to defaults
            </Button>
          </div>
        </div>

        {/* ── Right panel: preview + download ── */}
        <div className="flex-1 min-w-0">
          {/* Download actions */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span>
                {format.width}×{format.height}px
              </span>
            </div>
            <div className="flex-1" />
            <Button
              onClick={() => download("png", slug)}
              disabled={exporting}
              size="sm"
              variant="outline"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {exporting ? "Exporting…" : "Download PNG"}
            </Button>
            <Button
              onClick={() => download("jpg", slug)}
              disabled={exporting}
              size="sm"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {exporting ? "Exporting…" : "Download JPG"}
            </Button>
          </div>

          {/* Preview wrapper — scales down the full-size template */}
          <PreviewScaler templateWidth={format.width} templateHeight={format.height}>
            {/* This div is what html-to-image captures at full resolution */}
            <div ref={ref} style={{ width: format.width, height: format.height }}>
              <TemplateComponent
                headline={fields.headline}
                subtext={fields.subtext}
                bullets={fields.bullets}
                accentColor={fields.accentColor}
                badge={fields.badge}
                width={format.width}
                height={format.height}
              />
            </div>
          </PreviewScaler>

          <p className="text-xs text-muted-foreground mt-3">
            Live preview — the downloaded image is full resolution ({format.width}×{format.height}px).
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
