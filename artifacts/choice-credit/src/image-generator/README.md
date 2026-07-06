# Image Generator

A self-contained marketing image generator built into the admin dashboard.
Generates social-media-ready PNGs or JPEGs directly in the browser — no external API needed.

## How to use

1. Log in as admin → navigate to **Admin → Image Generator** (`/admin/image-generator`).
2. Pick a **template** (Credit Repair, Rental Approval, Eviction Recovery, or Consultation CTA).
3. Pick a **format** (Square 1080×1080 for Instagram/Facebook, or Landscape 1200×628 for LinkedIn).
4. Edit the **headline**, **subtext**, **bullet points**, **accent color**, and **badge text** in the panel.
5. Click **Download PNG** or **Download JPG** to save the image.

The live preview updates in real-time as you type.

---

## File structure

```
image-generator/
  templates/
    index.ts                    ← Template registry — add new templates here
    CreditRepairTemplate.tsx    ← Score-dial layout
    RentalApprovalTemplate.tsx  ← Split-panel APPROVED layout
    EvictionRecoveryTemplate.tsx ← Bold statement layout
    ConsultationTemplate.tsx    ← Centered CTA layout
  useImageExport.ts             ← html-to-image download hook
  ImageGeneratorPage.tsx        ← Dashboard page component
  README.md                     ← This file
```

---

## How to add a new template

1. Create `templates/MyNewTemplate.tsx`. The component receives these props:

```tsx
interface TemplateProps {
  headline: string;
  subtext: string;
  bullets: string[];
  accentColor: string;  // hex color string
  badge?: string;
  width: number;        // pixel width (e.g. 1080)
  height: number;       // pixel height (e.g. 1080)
}
```

   **Use inline styles only** — CSS variables and Tailwind classes are stripped by
   `html-to-image` at export time. Keep all styles as `style={{ ... }}` objects.

2. Register it in `templates/index.ts`:

```ts
import MyNewTemplate from "./MyNewTemplate";

export const TEMPLATES: TemplateDefinition[] = [
  // ...existing templates
  {
    id: "my-new-template",
    label: "My New Template",
    description: "Short description shown in the picker",
    component: MyNewTemplate,
    defaults: {
      headline: "Default Headline",
      subtext: "Default subtext goes here.",
      bullets: ["Bullet one", "Bullet two"],
      accentColor: "#F59E0B",
      badge: "Optional Badge",
    },
  },
];
```

That's it — the template will appear automatically in the dashboard picker.

---

## How to add a new format

In `templates/index.ts`, add to the `FORMATS` array:

```ts
export const FORMATS: TemplateFormat[] = [
  // ...existing
  {
    id: "story",
    label: "Story",
    width: 1080,
    height: 1920,
    description: "1080×1920 — Instagram/Facebook Stories",
  },
];
```

---

## Export quality notes

- Images export at 1× pixel ratio (no upscaling). The output is always exactly `width × height` pixels.
- PNG is lossless — better for text-heavy images.
- JPG at 95% quality — smaller file size, fine for photos/gradients.
- Fonts: templates use `Georgia` (serif) and `system-ui` (sans-serif) — both are available in every browser with no network request, which avoids font-loading issues during export.

---

## Tech

- [`html-to-image`](https://github.com/bubkoo/html-to-image) — captures a DOM node as PNG/JPEG
- All templates use inline styles for cross-environment rendering consistency
- No server calls — fully client-side
