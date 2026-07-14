import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("contact workflow keeps visitor data out of browser logs", () => {
  const source = read("app/[locale]/(marketing)/contact/page.tsx");
  assert.match(source, /createMailtoDraft/);
  assert.doesNotMatch(source, /console\.log\(\"Form Submitted/);
  assert.doesNotMatch(source, /successfully registered/i);
});

test("baseline browser security headers remain configured", () => {
  const config = read("next.config.ts");
  for (const directive of ["Content-Security-Policy", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy"]) {
    assert.match(config, new RegExp(directive));
  }
});

test("services error boundary never forces a browser reload", () => {
  const source = read("app/[locale]/(marketing)/services/error.tsx");
  assert.doesNotMatch(source, /location\.reload/);
  assert.doesNotMatch(source, /ddc_services_disable_3d/);
  assert.match(source, /onClick=\{reset\}/);
});

test("contact intake keeps its browser abuse controls in the server boundary", () => {
  const source = read("app/api/contact/route.ts");
  assert.match(source, /MAX_CONTACT_BODY_BYTES/);
  assert.match(source, /isSameOrigin/);
  assert.match(source, /acceptsJson/);
  assert.match(source, /AbortSignal\.timeout/);
  assert.doesNotMatch(source, /console\.error\("Contact delivery failed", error\)/);
});
