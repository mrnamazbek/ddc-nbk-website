#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

TASK="${1:-Review the current DDCNB frontend state for design-system consistency, agent handoff safety, and production risks. Do not edit files.}"

claude \
  --agents "$(cat .claude/agents.ddc.json)" \
  --agent ddc-architect-review \
  --effort high \
  --print "$TASK"
