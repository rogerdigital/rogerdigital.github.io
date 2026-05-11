export interface OSSContribution {
  title: string;
  url: string;
  description: string;
  date: string;
  project: string;
  projectUrl: string;
}

export const contributions: OSSContribution[] = [
  {
    title: "Telegram non-streaming media deduplication",
    url: "https://github.com/openclaw/openclaw/pull/78420",
    description:
      "Fixed duplicate MEDIA: attachment delivery in Telegram non-streaming mode by tracking block-sent media URLs, filtering final reply payloads, and covering the pure deduplication path with regression tests.",
    date: "2026-05-10",
    project: "OpenClaw",
    projectUrl: "https://github.com/openclaw/openclaw",
  },
  {
    title: "TUI streaming watchdog reconnect recovery",
    url: "https://github.com/openclaw/openclaw/pull/74224",
    description:
      "Resynced the TUI streaming watchdog after reconnects, kept active tool and lifecycle events as proof-of-life, and added regression coverage for stale reconnect runs.",
    date: "2026-04-29",
    project: "OpenClaw",
    projectUrl: "https://github.com/openclaw/openclaw",
  },
  {
    title: "WhatsApp DM voice-note transcription",
    url: "https://github.com/openclaw/openclaw/pull/64120",
    description:
      "Restored preflight speech-to-text for WhatsApp DM voice notes so agents receive spoken text instead of raw <media:audio> placeholders when transcription succeeds.",
    date: "2026-04-25",
    project: "OpenClaw",
    projectUrl: "https://github.com/openclaw/openclaw",
  },
  {
    title: "Heartbeat session key canonicalization",
    url: "https://github.com/openclaw/openclaw/pull/59606",
    description:
      "Prevented runaway :heartbeat suffix accumulation in isolated sessions, added stale-key cleanup, and covered the behavior with regression tests.",
    date: "2026-04-09",
    project: "OpenClaw",
    projectUrl: "https://github.com/openclaw/openclaw",
  },
  {
    title: "Browser launch blank-tab fix",
    url: "https://github.com/openclaw/openclaw/pull/52451",
    description:
      "Removed an unintended extra blank tab on browser launch by fixing launch arguments and locking the behavior with a regression test.",
    date: "2026-03-22",
    project: "OpenClaw",
    projectUrl: "https://github.com/openclaw/openclaw",
  },
  {
    title: "Compact overwriting concurrent writes fix",
    url: "https://github.com/Einsia/OpenChronicle/pull/25",
    description:
      "compact_file LLM rewrite could overwrite entries appended by concurrent reducers. Added compare-and-swap writeback: re-read the file under per-file lock before writing, skip compaction if changed, and refresh FTS rows atomically inside a SQLite savepoint.",
    date: "2026-04-20",
    project: "OpenChronicle",
    projectUrl: "https://github.com/Einsia/OpenChronicle",
  },
];

export function getByProject(project: string) {
  return contributions.filter((c) => c.project === project);
}

export function getProjects() {
  const seen = new Set<string>();
  const projects: { name: string; url: string }[] = [];
  for (const c of contributions) {
    if (!seen.has(c.project)) {
      seen.add(c.project);
      projects.push({ name: c.project, url: c.projectUrl });
    }
  }
  return projects;
}
