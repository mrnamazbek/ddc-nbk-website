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

function stableRatio(path: string) {
  let hash = 2166136261;
  for (let index = 0; index < path.length; index += 1) {
    hash ^= path.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 0xffffffff;
}

function recolorRgba(value: [number, number, number, number?], palette: ScenePalette, path: string) {
  const rgb: Rgb = [
    Math.round(value[0] * 255),
    Math.round(value[1] * 255),
    Math.round(value[2] * 255),
  ];
  const brightness = luminance(rgb);
  const colorSaturation = saturation(rgb);
  const colorHue = hue(rgb);
  const sourceIsWarm = colorHue >= 30 && colorHue <= 75 && colorSaturation > 0.22;
  const sourceIsLightNeutral = colorSaturation < 0.11 && brightness > 0.78;
  const isGoldAccent = stableRatio(path) < 0.22;

  let target: Rgb;

  if (brightness < 0.2 && colorSaturation < 0.16) {
    target = hexToRgb(palette.backgroundForest);
  } else if (sourceIsWarm) {
    // Existing yellow artwork is not automatically kept yellow: only a
    // controlled 22% becomes the official gold accent. The remaining colour
    // mass becomes brand green, so every object remains green-led.
    target = hexToRgb(isGoldAccent ? palette.particleAccent : palette.modelDarkBase);
  } else if (sourceIsLightNeutral) {
    // Keep paper and highlight shapes neutral; gold is reserved for the
    // deliberate colour accents above, not used as a substitute for contrast.
    target = hexToRgb(palette.keyLight);
  } else if (brightness > 0.62) {
    target = hexToRgb(palette.particlePrimary);
  } else {
    target = hexToRgb(palette.modelDarkBase);
  }

  return [target[0] / 255, target[1] / 255, target[2] / 255, value[3] ?? 1];
}

function recolorKeyframes(value: unknown, palette: ScenePalette, path: string): unknown {
  if (isRgba(value)) return recolorRgba(value, palette, path);

  if (Array.isArray(value)) {
    return value.map((entry, index) => recolorKeyframes(entry, palette, `${path}.${index}`));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        recolorKeyframes(entry, palette, `${path}.${key}`),
      ]),
    );
  }

  return value;
}

function recolorNode(value: unknown, palette: ScenePalette, path: string): unknown {
  if (Array.isArray(value)) {
    return value.map((entry, index) => recolorNode(entry, palette, `${path}.${index}`));
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
        return [key, { ...color, k: recolorKeyframes(color.k, palette, `${path}.c.k`) }];
      }

      return [key, recolorNode(entry, palette, `${path}.${key}`)];
    }),
  );
}

/**
 * Applies the active semantic scene palette at runtime. Source JSON remains
 * untouched, which keeps the original artwork reusable while every theme and
 * palette change stays coherent with the rest of the product.
 */
export function recolorBrandLottie(animation: unknown, palette: ScenePalette): LottieJson {
  return recolorNode(animation, palette, "root") as LottieJson;
}
