import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((argument) => {
    const [key, value = "true"] = argument.replace(/^--/, "").split("=");
    return [key, value];
  }),
);

const BASE_URL = args.baseUrl ?? "http://localhost:3000";
const OUTPUT_DIR = path.resolve(args.output ?? "output/performance/measurements");
const RUNS = Math.max(1, Number(args.runs ?? 1));
const SETTLE_MS = Math.max(500, Number(args.settleMs ?? 2500));
const TRACE = args.trace === "true";
const SCREENSHOTS = args.screenshots === "true";
const ASSERT_BUDGETS = args.assert === "true";

const budgets = {
  maxLcpMs: Number(args.maxLcpMs ?? 2500),
  maxCls: Number(args.maxCls ?? 0.1),
  minScrollFps: Number(args.minScrollFps ?? 45),
};

const profiles = {
  "mobile-constrained": {
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    cpuRate: 4,
    network: { latency: 150, download: 1_600_000 / 8, upload: 750_000 / 8, type: "cellular4g" },
  },
  "mobile-modern": {
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    cpuRate: 1,
    network: { latency: 60, download: 9_000_000 / 8, upload: 3_000_000 / 8, type: "cellular4g" },
  },
  "mobile-modern-cpu4": {
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    cpuRate: 4,
    network: { latency: 60, download: 9_000_000 / 8, upload: 3_000_000 / 8, type: "cellular4g" },
  },
  desktop: {
    viewport: { width: 1440, height: 900 },
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 1,
    cpuRate: 1,
    network: { latency: 20, download: 20_000_000 / 8, upload: 10_000_000 / 8, type: "ethernet" },
  },
  tablet: {
    viewport: { width: 768, height: 1024 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    cpuRate: 4,
    network: { latency: 60, download: 9_000_000 / 8, upload: 3_000_000 / 8, type: "cellular4g" },
  },
};

const routes = {
  core: ["/en", "/en/about", "/en/services", "/en/mission", "/en/careers", "/en/contact", "/en/news"],
  heavy: ["/en", "/en/about", "/en/services", "/en/mission"],
  all: [
    "/en", "/en/about", "/en/analytics", "/en/careers", "/en/contact", "/en/digital",
    "/en/ecommerce", "/en/faq", "/en/mission", "/en/news", "/en/security", "/en/services",
    "/en/test-mcp", "/en/ui-lab",
  ],
};

function median(values) {
  const sorted = values.filter(Number.isFinite).sort((left, right) => left - right);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function round(value, digits = 1) {
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

function toLabel(route) {
  return route === "/en" ? "home" : route.replace(/^\/en\//, "").replaceAll("/", "-");
}

function traceSummary(trace) {
  const events = Array.isArray(trace?.traceEvents) ? trace.traceEvents : [];
  const durationMs = (event) => (event.dur ?? 0) / 1000;
  const longTasks = events.filter((event) => event.name === "RunTask" && durationMs(event) > 50);
  const layouts = events.filter((event) => event.name === "Layout");
  const paints = events.filter((event) => event.name === "Paint");
  return {
    longTaskCount: longTasks.length,
    longestTaskMs: round(Math.max(0, ...longTasks.map(durationMs))),
    totalLongTaskMs: round(longTasks.reduce((sum, event) => sum + durationMs(event), 0)),
    layoutMs: round(layouts.reduce((sum, event) => sum + durationMs(event), 0)),
    paintMs: round(paints.reduce((sum, event) => sum + durationMs(event), 0)),
  };
}

async function captureTrace(session, filename, work) {
  const complete = new Promise((resolve) => session.once("Tracing.tracingComplete", resolve));
  await session.send("Tracing.start", {
    categories: "devtools.timeline,disabled-by-default-devtools.timeline,blink.user_timing,loading,rail,v8,cc",
    transferMode: "ReturnAsStream",
  });
  await work();
  await session.send("Tracing.end");
  const { stream } = await complete;
  let contents = "";
  let eof = false;
  while (!eof) {
    const chunk = await session.send("IO.read", { handle: stream });
    contents += chunk.data;
    eof = chunk.eof;
  }
  await session.send("IO.close", { handle: stream });
  await writeFile(filename, contents);
  return traceSummary(JSON.parse(contents));
}

async function sampleScrollFps(page) {
  return page.evaluate(async () => {
    const startingY = window.scrollY;
    const frames = [];
    const start = performance.now();
    let last = start;

    await new Promise((resolve) => {
      const frame = (now) => {
        frames.push(now - last);
        last = now;
        window.scrollBy(0, Math.max(1, Math.round(window.innerHeight * 0.09)));
        if (now - start < 1600) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });

    window.scrollTo({ top: startingY, behavior: "instant" });
    const averageFrameMs = frames.reduce((sum, value) => sum + value, 0) / frames.length;
    const jankyFrames = frames.filter((value) => value > 34).length;
    return {
      fps: Math.min(60, 1000 / averageFrameMs),
      frameCount: frames.length,
      jankyFrames,
      worstFrameMs: Math.max(...frames),
    };
  });
}

async function measureOne(browser, profileName, profile, route, cacheMode, run) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    deviceScaleFactor: profile.deviceScaleFactor,
    colorScheme: "dark",
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  const requestBytes = new Map();
  const requestUrls = new Map();
  const errors = [];

  await page.addInitScript(() => {
    window.__ddcPerf = { lcp: null, cls: 0, longTasks: [], events: [] };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__ddcPerf.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__ddcPerf.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__ddcPerf.longTasks.push(entry.duration);
    }).observe({ type: "longtask", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__ddcPerf.events.push(entry.duration);
    }).observe({ type: "event", buffered: true, durationThreshold: 16 });
  });

  page.on("pageerror", (error) => errors.push(error.message));
  await session.send("Network.enable");
  await session.send("Performance.enable");
  await session.send("Emulation.setCPUThrottlingRate", { rate: profile.cpuRate });
  await session.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: profile.network.latency,
    downloadThroughput: profile.network.download,
    uploadThroughput: profile.network.upload,
    connectionType: profile.network.type,
  });
  await session.send("Network.setCacheDisabled", { cacheDisabled: cacheMode === "cold" });
  session.on("Network.requestWillBeSent", ({ requestId, request }) => requestUrls.set(requestId, request.url));
  session.on("Network.loadingFinished", ({ requestId, encodedDataLength }) => requestBytes.set(requestId, encodedDataLength));

  const url = `${BASE_URL}${route}`;
  const navigate = async () => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(SETTLE_MS);
  };

  if (cacheMode === "warm") {
    await navigate();
    requestBytes.clear();
    requestUrls.clear();
    await page.reload({ waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(SETTLE_MS);
  }

  const tracePath = path.join(OUTPUT_DIR, `trace-${profileName}-${cacheMode}-${toLabel(route)}-${run}.json`);
  const trace = TRACE ? await captureTrace(session, tracePath, navigate) : null;
  if (!TRACE && cacheMode === "cold") await navigate();

  const [browserMetrics, vitals, scroll] = await Promise.all([
    session.send("Performance.getMetrics"),
    page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0];
      const fcp = performance.getEntriesByName("first-contentful-paint")[0];
      return {
        ...window.__ddcPerf,
        fcp: fcp?.startTime ?? null,
        ttfb: navigation?.responseStart ?? null,
        domContentLoaded: navigation?.domContentLoadedEventEnd ?? null,
        load: navigation?.loadEventEnd ?? null,
        domNodes: document.getElementsByTagName("*").length,
        resources: performance.getEntriesByType("resource").length,
      };
    }),
    sampleScrollFps(page),
  ]);

  const metric = (name) => browserMetrics.metrics.find((entry) => entry.name === name)?.value ?? null;
  const thirdPartyBytes = [...requestBytes.entries()].reduce((sum, [requestId, bytes]) => {
    const host = new URL(requestUrls.get(requestId) ?? BASE_URL).host;
    return host === new URL(BASE_URL).host ? sum : sum + bytes;
  }, 0);
  const result = {
    route,
    profile: profileName,
    cacheMode,
    run,
    timings: {
      ttfbMs: round(vitals.ttfb),
      fcpMs: round(vitals.fcp),
      lcpMs: round(vitals.lcp),
      cls: round(vitals.cls, 4),
      domContentLoadedMs: round(vitals.domContentLoaded),
      loadMs: round(vitals.load),
    },
    runtime: {
      browserLongTasks: vitals.longTasks.length,
      browserLongestTaskMs: round(Math.max(0, ...vitals.longTasks)),
      eventMaxMs: round(Math.max(0, ...vitals.events)),
      taskDurationMs: round(metric("TaskDuration") * 1000),
      scriptDurationMs: round(metric("ScriptDuration") * 1000),
      layoutDurationMs: round(metric("LayoutDuration") * 1000),
      recalcStyleDurationMs: round(metric("RecalcStyleDuration") * 1000),
      jsHeapUsedBytes: round(metric("JSHeapUsedSize"), 0),
      domNodes: vitals.domNodes,
      scroll: Object.fromEntries(Object.entries(scroll).map(([key, value]) => [key, round(value)])),
      trace,
    },
    network: {
      requests: requestBytes.size,
      transferredBytes: [...requestBytes.values()].reduce((sum, value) => sum + value, 0),
      thirdPartyBytes,
    },
    pageErrors: errors,
  };

  if (SCREENSHOTS) {
    await page.screenshot({ path: path.join(OUTPUT_DIR, `screen-${profileName}-${cacheMode}-${toLabel(route)}-${run}.png`), fullPage: false });
  }
  await context.close();
  return result;
}

function summarize(results) {
  const groups = new Map();
  for (const result of results) {
    const key = `${result.route}|${result.profile}|${result.cacheMode}`;
    groups.set(key, [...(groups.get(key) ?? []), result]);
  }
  return [...groups.entries()].map(([key, entries]) => ({
    key,
    samples: entries.length,
    timings: Object.fromEntries(Object.keys(entries[0].timings).map((metric) => [metric, median(entries.map((entry) => entry.timings[metric]))])),
    runtime: {
      taskDurationMs: median(entries.map((entry) => entry.runtime.taskDurationMs)),
      scriptDurationMs: median(entries.map((entry) => entry.runtime.scriptDurationMs)),
      browserLongTasks: median(entries.map((entry) => entry.runtime.browserLongTasks)),
      fps: median(entries.map((entry) => entry.runtime.scroll.fps)),
      jankyFrames: median(entries.map((entry) => entry.runtime.scroll.jankyFrames)),
      jsHeapUsedBytes: median(entries.map((entry) => entry.runtime.jsHeapUsedBytes)),
    },
    network: {
      requests: median(entries.map((entry) => entry.network.requests)),
      transferredBytes: median(entries.map((entry) => entry.network.transferredBytes)),
      thirdPartyBytes: median(entries.map((entry) => entry.network.thirdPartyBytes)),
    },
  }));
}

function findBudgetViolations(results) {
  return results.flatMap((result) => {
    const violations = [];
    if (result.pageErrors.length) violations.push(`page errors: ${result.pageErrors.join(" | ")}`);
    if (result.timings.lcpMs && result.timings.lcpMs > budgets.maxLcpMs) {
      violations.push(`LCP ${result.timings.lcpMs}ms > ${budgets.maxLcpMs}ms`);
    }
    if (result.timings.cls > budgets.maxCls) {
      violations.push(`CLS ${result.timings.cls} > ${budgets.maxCls}`);
    }
    if (result.runtime.scroll.fps < budgets.minScrollFps) {
      violations.push(`scroll FPS ${result.runtime.scroll.fps} < ${budgets.minScrollFps}`);
    }
    return violations.map((reason) => ({
      route: result.route,
      profile: result.profile,
      cacheMode: result.cacheMode,
      run: result.run,
      reason,
    }));
  });
}

const suite = routes[args.suite ?? "core"];
if (!suite) throw new Error(`Unknown suite: ${args.suite}`);
const selectedProfiles = (args.profiles ?? "mobile-constrained,desktop")
  .split(",")
  .map((name) => [name, profiles[name]])
  .filter(([, profile]) => profile);
const cacheModes = (args.cache ?? "cold,warm").split(",");

await mkdir(OUTPUT_DIR, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_EXECUTABLE || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

const results = [];
try {
  for (const [profileName, profile] of selectedProfiles) {
    for (const cacheMode of cacheModes) {
      for (const route of suite) {
        for (let run = 1; run <= RUNS; run += 1) {
          process.stdout.write(`Measuring ${profileName} ${cacheMode} ${route} (${run}/${RUNS})\n`);
          results.push(await measureOne(browser, profileName, profile, route, cacheMode, run));
        }
      }
    }
  }
} finally {
  await browser.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  runs: RUNS,
  settleMs: SETTLE_MS,
  suite: args.suite ?? "core",
  profiles: selectedProfiles.map(([name]) => name),
  cacheModes,
  budgets: ASSERT_BUDGETS ? budgets : null,
  results,
  summary: summarize(results),
};
report.violations = ASSERT_BUDGETS ? findBudgetViolations(results) : [];
const reportPath = path.join(OUTPUT_DIR, `report-${Date.now()}.json`);
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Wrote ${reportPath}`);

if (report.violations.length) {
  console.error(`Performance budgets failed: ${report.violations.length} violation(s).`);
  for (const violation of report.violations) console.error(`${violation.route} (${violation.profile}, ${violation.cacheMode}): ${violation.reason}`);
  process.exitCode = 1;
}
