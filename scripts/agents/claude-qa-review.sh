#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

TASK="${1:-Run a read-only QA review for the DDCNB website. Do not edit files. Focus on mobile, accessibility, console errors, performance risks, and visual consistency.}"

claude \
  --agents "$(cat .claude/agents.ddc.json)" \
  --agent ddc-qa-engineer \
  --effort high \
  --print "$TASK"
