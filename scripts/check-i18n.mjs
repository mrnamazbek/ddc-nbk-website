#!/usr/bin/env node
/**
 * Localization guard. Run with `npm run check:i18n` (and in CI).
 *
 * Catches the two classes of bug that shipped Russian text to English and
 * Kazakh visitors:
 *
 *   1. Key drift — a namespace exists in one catalogue but not another, so
 *      next-intl renders the raw key (or throws) in the missing locale.
 *   2. Hardcoded display strings — Cyrillic string literals living in .tsx
 *      instead of messages/*.json, which render identically in every locale.
 *
 * A line that legitimately needs Cyrillic in code (a per-locale lookup table, a
 * matcher against a Russian-only upstream API, a brand name) opts out with a
 * trailing `i18n-exempt` comment. Whole files opt out via EXEMPT_FILES below.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const LOCALES = ["en", "ru", "kz"];
const SCAN_DIRS = ["app", "components"];

/** Files whose Cyrillic is data or matcher input, never rendered display text. */
const EXEMPT_FILES = new Set([
  "app/not-found.tsx",                                  // self-contained per-locale map
  "app/[locale]/(marketing)/test-mcp/page.tsx",         // unlinked internal probe page
  "app/[locale]/(marketing)/careers/page.tsx",          // matchers against HH's Russian API
  "components/layout/NavPreview.tsx",                   // per-locale label map
  "components/layout/Header.tsx",                       // native language names in the switcher
  "components/sections/Leadership.tsx",                 // per-locale names/titles map
  "components/three/LogoParticleReveal.tsx",            // regex over localized copy
]);

const CYRILLIC = /[Ѐ-ӿ]/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === "node_modules" || entry === ".next") continue;
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) out.push(full);
  }
  return out;
}

function flatten(obj, prefix = "", out = new Set()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out.add(key);
  }
  return out;
}

const problems = [];

// ---- 1. key parity -------------------------------------------------------
const keysets = {};
for (const loc of LOCALES) {
  const json = JSON.parse(readFileSync(join(ROOT, `messages/${loc}.json`), "utf8"));
  keysets[loc] = flatten(json);
}
const union = new Set(LOCALES.flatMap((l) => [...keysets[l]]));
for (const loc of LOCALES) {
  for (const key of union) {
    if (!keysets[loc].has(key)) problems.push(`missing key  ${loc}.json  ${key}`);
  }
}

// ---- 2. hardcoded Cyrillic display strings -------------------------------
// Drops block and line comments, including trailing ones. Block comments are
// replaced by their own newlines so line numbers stay aligned with the source.
// The negative lookbehind keeps `https://…` from looking like a comment.
const stripComments = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ""))
    .replace(/(?<!:)\/\/.*$/gm, "");

for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    if (EXEMPT_FILES.has(rel)) continue;
    const raw = readFileSync(file, "utf8").split("\n");
    // Cyrillic is judged on the comment-stripped line (so Russian code comments
    // are ignored), but the opt-out marker is read from the original line —
    // otherwise stripping would remove the very marker we look for.
    const stripped = stripComments(readFileSync(file, "utf8")).split("\n");
    stripped.forEach((line, i) => {
      if (!CYRILLIC.test(line)) return;
      if (/i18n-exempt/.test(raw[i] ?? "")) return;
      problems.push(`hardcoded    ${rel}:${i + 1}  ${line.trim().slice(0, 70)}`);
    });
  }
}

if (problems.length) {
  console.error(`\n✗ i18n check failed — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error("  " + p);
  console.error(
    "\nMove display text into messages/*.json, or mark a data/matcher line " +
      "with a trailing `i18n-exempt` comment.\n"
  );
  process.exit(1);
}

console.log(`✓ i18n check passed — ${union.size} keys x ${LOCALES.length} locales, no hardcoded strings`);
