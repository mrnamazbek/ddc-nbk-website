# LinkedIn Content Workflow

## Purpose

The news archive is a curated, searchable publication index. It keeps the public
website fast while preserving a direct link to the original source for each item.

## Approved sources

- DDC company posts: `https://www.linkedin.com/company/bank-service-bureau/posts/?feedView=all`
- Leadership references: `https://www.linkedin.com/in/binur-zhalenov/`

Only material that is publicly available, supplied by the account owner, or
available through an authorized LinkedIn integration may be added.

## Do not bypass LinkedIn controls

Do not automate login, evade rate limits, scrape behind authentication, or
download third-party images without permission. For an ongoing automated feed,
use LinkedIn's approved API with the required permissions, or an account-owner
export delivered to the editorial team.

## Editorial intake

1. Confirm the original post URL and publication date.
2. Check the factual claim, source attribution, and category.
3. Confirm image rights and write descriptive alt text.
4. Add translations for Kazakh, Russian, and English where required.
5. Add the item to `lib/news/linkedin.ts` and retain the original post URL.
6. Review the card locally before release.

## Categories

- `aiData`: AI, data, research, and digital services
- `infrastructure`: platforms, payments, operations, and security
- `people`: careers, teams, events, and leadership
- `organization`: corporate updates, partnerships, and institutional news

## Scaling policy

The current client archive renders six cards per page with search and category
filters. For more than 100 publications, move the index to a CMS or database and
provide server-side filtering plus cursor pagination. Keep the page size small,
cache results, and revalidate on a predictable schedule. Do not ship a single
unbounded feed to the browser.

## Current limitation

The repository contains a curated initial set of DDC references and selected
leadership posts. A complete historical import of every leadership post requires
an authorized API feed or an account-owner export; this project does not bypass
LinkedIn access controls to obtain it.
