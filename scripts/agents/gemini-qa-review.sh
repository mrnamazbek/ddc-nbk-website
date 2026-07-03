#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

TASK="${1:-Read AGENTS.md, design-system/ddcnb-website/MASTER.md, and docs/agents/AGENT_HANDOFF.md. Role: QA Engineer. Do not edit files. Review the DDCNB site for mobile, accessibility, visual consistency, and performance risks. Return concise findings with exact files or pages.}"

agy --print "$TASK"
