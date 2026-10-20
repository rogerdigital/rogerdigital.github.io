export interface UsesTool {
  name: string;
  /** Slug on cdn.simpleicons.org */
  icon?: string;
  /** Brand color for the icon, hex without leading # */
  color?: string;
  /** Key of an inline custom icon for tools without a simpleicons entry */
  svg?: 'codex' | 'vscode';
}

export interface UsesCategory {
  title: string;
  items: UsesTool[];
}

export const usesUpdated = 'May 2026';

export const usesCategories: UsesCategory[] = [
  {
    title: 'Languages & Frameworks',
    items: [
      { name: 'TypeScript', icon: 'typescript', color: '3178C6' },
      { name: 'Node.js', icon: 'nodedotjs', color: '5FA04E' },
      { name: 'React', icon: 'react', color: '61DAFB' },
      { name: 'Swift', icon: 'swift', color: 'F05138' },
      { name: 'SwiftUI', icon: 'swift', color: 'F05138' },
      { name: 'Python', icon: 'python', color: '3776AB' },
    ],
  },
  {
    title: 'Editor & Dev',
    items: [
      { name: 'Neovim', icon: 'neovim', color: '57A143' },
      { name: 'VS Code', svg: 'vscode' },
      { name: 'iTerm2', icon: 'iterm2', color: '8E95A0' },
      { name: 'Claude Code', icon: 'anthropic', color: 'D4A574' },
      { name: 'Codex', svg: 'codex' },
    ],
  },
  {
    title: 'Productivity',
    items: [
      { name: 'Linear', icon: 'linear', color: '5E6AD2' },
      { name: 'Notion', icon: 'notion', color: '8E95A0' },
      { name: 'Arc Browser', icon: 'arc', color: '8E95A0' },
    ],
  },
  {
    title: 'Hardware',
    items: [
      { name: 'MacBook Pro 14"', icon: 'apple', color: 'A2AAAD' },
    ],
  },
];
