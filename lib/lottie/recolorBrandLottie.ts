import type { ScenePalette } from "@/components/theme/useScenePalette";

type LottieJson = Record<string, unknown>;

type Rgb = readonly [number, number, number];

function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace("#", "").trim();
  const value = normalized.length === 3
    ? normalized.split("").map((part) => part + part).join("")
    : normalized;

  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function luminance([red, green, blue]: Rgb) {
  return (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
}

function saturation([red, green, blue]: Rgb) {
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  return maximum === 0 ? 0 : (maximum - minimum) / maximum;
}

function hue([red, green, blue]: Rgb) {
  const maximum = Math.max(red, green, blue) / 255;
  const minimum = Math.min(red, green, blue) / 255;
  const delta = maximum - minimum;

  if (delta === 0) return 0;

  let result = 0;
  if (maximum === red / 255) result = ((green - blue) / 255) / delta;
  if (maximum === green / 255) result = (blue - red) / 255 / delta + 2;
  if (maximum === blue / 255) result = (red - green) / 255 / delta + 4;

  return (result * 60 + 360) % 360;
}

function isRgba(value: unknown): value is [number, number, number, number?] {
  return Array.isArray(value)
    && value.length >= 3
    && value.slice(0, 3).every((entry) => typeof entry === "number")
    && value.slice(0, 3).every((entry) => entry >= 0 && entry <= 1);
}

function targetBrandColor(rgb: Rgb, palette: ScenePalette): Rgb {
  const brightness = luminance(rgb);
  const colorSaturation = saturation(rgb);
  const colorHue = hue(rgb);
  const sourceIsGold = colorHue >= 30 && colorHue <= 75 && colorSaturation >= 0.2;
  const sourceIsLightNeutral = colorSaturation < 0.13 && brightness >= 0.72;
  const sourceIsGreen = colorHue >= 75 && colorHue <= 185 && colorSaturation >= 0.15;
  const structuralGreen = palette.isLight ? palette.modelLightBase : palette.modelDarkBase;

  // Preserve the role of every original artwork color. The JSON assets use
  // forest greens for structure, golds for accents, and white for contrast.
  // Mapping by source role keeps the original composition intact instead of
  // randomly redistributing yellow across unrelated layers.
  if (brightness <= 0.22) {
    return hexToRgb(palette.backgroundForest);
  } else if (sourceIsGold) {
    return hexToRgb(palette.modelDarkAccent);
  } else if (sourceIsLightNeutral) {
    return hexToRgb(palette.keyLight);
  } else if (sourceIsGreen) {
    return hexToRgb(brightness >= 0.58 ? palette.fillLight : structuralGreen);
  } else if (colorSaturation < 0.13) {
    return hexToRgb(brightness > 0.48 ? palette.keyLight : structuralGreen);
  }

  return hexToRgb(brightness >= 0.62 ? palette.fillLight : structuralGreen);
}

function recolorRgba(value: [number, number, number, number?], palette: ScenePalette) {
  const target = targetBrandColor([
    Math.round(value[0] * 255),
    Math.round(value[1] * 255),
    Math.round(value[2] * 255),
  ], palette);

  return [target[0] / 255, target[1] / 255, target[2] / 255, value[3] ?? 1];
}

function recolorStroke(value: string, palette: ScenePalette) {
  const match = value.match(/^#?([0-9a-f]{6})$/i);
  if (!match) return value;

  const hex = match[1];
  const target = targetBrandColor([
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ], palette);

  return `#${target.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function recolorKeyframes(value: unknown, palette: ScenePalette): unknown {
  if (isRgba(value)) return recolorRgba(value, palette);

  if (Array.isArray(value)) {
    return value.map((entry) => recolorKeyframes(entry, palette));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        recolorKeyframes(entry, palette),
      ]),
    );
  }

  return value;
}

function recolorGradientStops(value: unknown, pointCount: number, palette: ScenePalette): unknown {
  if (Array.isArray(value)) {
    const isNumericStopList = value.length >= pointCount * 4
      && value.every((entry) => typeof entry === "number");

    if (isNumericStopList) {
      const recolored = [...value] as number[];

      for (let index = 0; index < pointCount; index += 1) {
        const colorOffset = index * 4 + 1;
        const source: [number, number, number, number] = [
          recolored[colorOffset],
          recolored[colorOffset + 1],
          recolored[colorOffset + 2],
          1,
        ];
        const target = recolorRgba(source, palette);
        recolored[colorOffset] = target[0];
        recolored[colorOffset + 1] = target[1];
        recolored[colorOffset + 2] = target[2];
      }

      return recolored;
    }

    return value.map((entry) => recolorGradientStops(entry, pointCount, palette));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        recolorGradientStops(entry, pointCount, palette),
      ]),
    );
  }

  return value;
}

function recolorNode(value: unknown, palette: ScenePalette): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => recolorNode(entry, palette));
  }

  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => {
      if (
        key === "c"
        && entry
        && typeof entry === "object"
        && "k" in entry
      ) {
        const color = entry as { k: unknown };
        return [key, { ...color, k: recolorKeyframes(color.k, palette) }];
      }

      if (key === "sc" && typeof entry === "string") {
        return [key, recolorStroke(entry, palette)];
      }

      if (
        key === "g"
        && entry
        && typeof entry === "object"
        && "p" in entry
        && "k" in entry
      ) {
        const gradient = entry as { p: unknown; k: unknown };
        const pointCount = typeof gradient.p === "number" ? gradient.p : 0;

        if (pointCount > 0) {
          return [key, {
            ...gradient,
            k: recolorGradientStops(gradient.k, pointCount, palette),
          }];
        }
      }

      return [key, recolorNode(entry, palette)];
    }),
  );
}

/**
 * Applies the active semantic scene palette at runtime. Source JSON remains
 * untouched, which keeps the original artwork reusable while every theme and
 * palette change stays coherent with the rest of the product.
 */
export function recolorBrandLottie(animation: unknown, palette: ScenePalette): LottieJson {
  return recolorNode(animation, palette) as LottieJson;
}
