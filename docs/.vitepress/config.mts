import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(__dirname, '..')
const notesRoot = path.join(docsRoot, 'notes')

function formatTitle(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const heading = content.match(/^#\s+(.+)$/m)
    if (heading?.[1]) {
      return heading[1].trim()
    }
  } catch {
    // Fall through to the filename-based title.
  }

  return path
    .basename(filePath, path.extname(filePath))
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function toLink(filePath: string): string {
  const relativePath = path.relative(docsRoot, filePath)
  return `/${relativePath.replace(/\\/g, '/').replace(/\.md$/, '')}`
}

function buildSidebar(dir: string): Array<Record<string, unknown>> {
  if (!fs.existsSync(dir)) {
    return []
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.'))
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) {
        return a.isDirectory() ? -1 : 1
      }
      return a.name.localeCompare(b.name, 'zh-CN')
    })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        const items = buildSidebar(fullPath)
        if (items.length === 0) {
          return []
        }
        return [
          {
            text: entry.name,
            collapsed: true,
            items,
          },
        ]
      }

      if (!entry.name.endsWith('.md') || entry.name === 'index.md') {
        return []
      }

      return [
        {
          text: formatTitle(fullPath),
          link: toLink(fullPath),
        },
      ]
    })
}

export default defineConfig({
  title: '技术笔记',
  description: '本地 Markdown 笔记网站',
  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  markdown: {
    html: false,
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
      { text: '使用说明', link: '/guide/usage' },
    ],
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '首页', link: '/' },
          { text: '使用说明', link: '/guide/usage' },
        ],
      },
      {
        text: '笔记',
        items: [{ text: '笔记索引', link: '/notes/' }, ...buildSidebar(notesRoot)],
      },
    ],
    outline: {
      label: '本文目录',
      level: [2, 3],
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
    search: {
      provider: 'local',
    },
  },
})
