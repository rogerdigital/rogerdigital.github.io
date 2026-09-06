export interface Project {
  title: string;
  description: string;
  tags: string[];
  repoUrl: string;
  marketplaceUrl?: string;
}

export interface ProjectGroup {
  label: string;
  description?: string;
  projects: Project[];
}

export const projectGroups: ProjectGroup[] = [
  {
    label: 'Products',
    projects: [
      {
        title: 'QuantPilot',
        description:
          'Local-first quantitative research and execution console — strategy review, backtesting, simulated/paper/live execution, and basic risk controls.',
        tags: ['Python', 'Quant', 'Trading'],
        repoUrl: 'https://github.com/rogerdigital/quantpilot',
      },
      {
        title: 'Publio',
        description: 'Multi-platform publishing tool for writing once and distributing everywhere.',
        tags: ['TypeScript', 'Publishing'],
        repoUrl: 'https://github.com/rogerdigital/publio',
      },
      {
        title: 'RepoBrief',
        description:
          'Generate AI-ready project briefs for any codebase — agent context files, readiness checks, a GitHub Action that keeps them fresh, and an MCP server for querying repo context on demand.',
        tags: ['TypeScript', 'MCP', 'CLI'],
        repoUrl: 'https://github.com/rogerdigital/repo-brief',
      },
      {
        title: 'roger-skills',
        description:
          'A curated collection of reusable skills for AI coding agents — commit, debug, refactor, security-review, and more — following the agentskills.io standard.',
        tags: ['AI Agent', 'Skills'],
        repoUrl: 'https://github.com/rogerdigital/roger-skills',
      },
      {
        title: 'dsh-searxng',
        description:
          'SearXNG-backed search provider plugin for DeepSeek Harness — free, self-hosted, key-less web search for agents through the ctx.web capability seam.',
        tags: ['TypeScript', 'Agent', 'Search'],
        repoUrl: 'https://github.com/rogerdigital/dsh-searxng',
      },
      {
        title: 'dsh-vet',
        description:
          'Security vetting scanner for DeepSeek Harness (DSH) plugins — permission and supply-chain audits before install, with a machine-readable report standard, A–F grades, and a GitHub Action for continuous self-auditing.',
        tags: ['TypeScript', 'Agent', 'Security'],
        repoUrl: 'https://github.com/rogerdigital/dsh-vet',
      },
    ],
  },
  {
    label: 'Obsidian Plugins',
    description:
      'A small product line for Obsidian users, covering vault browsing, maintenance scanning, and document export. All three plugins are listed in the Obsidian Community Plugin marketplace under rogerdigital.',
    projects: [
      {
        title: 'Smart Explorer',
        description: 'Alternative file explorer with manual drag-and-drop ordering, custom sorting, grouping, filtering, and lightweight previews.',
        tags: ['TypeScript', 'Obsidian'],
        repoUrl: 'https://github.com/rogerdigital/smart-explorer',
        marketplaceUrl: 'https://community.obsidian.md/plugins/smart-explorer',
      },
      {
        title: 'Vault Inspector',
        description:
          'Local-first vault maintenance scanner for broken links, orphan attachments, duplicate files, empty notes, frontmatter inconsistencies, unused tags, and large files. Includes a read-only CLI and Agent Skill for automation.',
        tags: ['TypeScript', 'Obsidian'],
        repoUrl: 'https://github.com/rogerdigital/vault-inspector',
        marketplaceUrl: 'https://community.obsidian.md/plugins/vault-inspector',
      },
      {
        title: 'Document Exporter',
        description:
          'Document export tool for notes, folders, and selected files, supporting PDF, DOCX, Markdown bundles, and HTML exports.',
        tags: ['TypeScript', 'Obsidian'],
        repoUrl: 'https://github.com/rogerdigital/document-exporter',
        marketplaceUrl: 'https://community.obsidian.md/plugins/document-exporter',
      },
    ],
  },
];
