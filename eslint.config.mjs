import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Scraped reference material (Node crawler + crawled markdown/images) — not part
    // of the Next app build, and crawler.js legitimately uses CommonJS require().
    "extracted/**",
    // Local Claude Code agent worktrees and their build artifacts (gitignored).
    ".claude/**",
  ]),
  {
    // Next 16 / React 19's eslint-config-next promotes the React Compiler-era
    // react-hooks rules to errors. They flag idiomatic React Three Fiber code
    // (mutation inside useFrame, Math.random() particle seeding) and the GSAP
    // ref-collection pattern — patterns the compiler does not actually transform
    // here. Keep them visible as warnings instead of blocking CI. Tracked as
    // tech debt in CODE_REVIEW.md.
    rules: {
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
