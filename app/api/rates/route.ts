import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Официальные курсы валют НБК РК.
 *
 * Источник — публичный RSS Нацбанка (rates_all.xml): по одному item на
 * валюту с полями title (код), description (курс в KZT), pubDate (дата
 * установления), change (абсолютное изменение в KZT), index (UP/DOWN).
 * Курсы дневные, поэтому кэшируем на час (revalidate) и отдаём
 * stale-while-revalidate — при недоступности источника посетитель видит
 * последние известные данные, а не пустоту.
 */
const NBK_RATES_URL = "https://nationalbank.kz/rss/rates_all.xml";
const FETCH_TIMEOUT_MS = 8_000;
const REVALIDATE_SECONDS = 3600;
const DISPLAY_CODES = ["USD", "EUR", "RUB"] as const;

interface NbkRate {
  code: string;
  value: number;
  change: number;
  trend: "up" | "down";
}

function parseFeed(xml: string): { asOf: string | null; rates: NbkRate[] } {
  const rates: NbkRate[] = [];
  let asOf: string | null = null;

  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  for (const item of items) {
    const pick = (tag: string) =>
      item.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1]?.trim() ?? "";

    const code = pick("title");
    if (!(DISPLAY_CODES as readonly string[]).includes(code)) continue;

    const value = Number.parseFloat(pick("description"));
    const change = Number.parseFloat(pick("change").replace("+", ""));
    if (!Number.isFinite(value)) continue;

    if (!asOf) asOf = pick("pubDate") || null;
    rates.push({
      code,
      value,
      change: Number.isFinite(change) ? change : 0,
      trend: pick("index") === "DOWN" ? "down" : "up",
    });
  }

  // Сохраняем порядок USD, EUR, RUB независимо от порядка в фиде.
  rates.sort(
    (a, b) =>
      (DISPLAY_CODES as readonly string[]).indexOf(a.code) -
      (DISPLAY_CODES as readonly string[]).indexOf(b.code),
  );
  return { asOf, rates };
}

export async function GET() {
  try {
    const response = await fetch(NBK_RATES_URL, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) throw new Error(`NBK feed responded ${response.status}`);

    const { asOf, rates } = parseFeed(await response.text());
    if (rates.length === 0) throw new Error("NBK feed returned no display currencies");

    return NextResponse.json(
      { asOf, rates, source: "nationalbank.kz" },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      },
    );
  } catch (error) {
    console.error("NBK rates fetch failed:", error);
    return NextResponse.json(
      { error: "rates_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
