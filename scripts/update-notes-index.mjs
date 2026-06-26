import fs from 'node:fs'
import path from 'node:path'

const siteRoot = path.resolve(new URL('..', import.meta.url).pathname)
const notesRoot = path.join(siteRoot, 'docs', 'notes')

const ignoreDirectories = new Set([
  '.git',
  '.idea',
  '.vscode',
  'node_modules',
  '__pycache__',
  'vendor',
  'data',
  'test',
  'bin',
])

function collectMarkdownFiles(dir, relativeBase = '') {
  if (!fs.existsSync(dir)) {
    return []
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.'))
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name)
      const relativePath = path.join(relativeBase, entry.name)

      if (entry.isDirectory()) {
        if (ignoreDirectories.has(entry.name)) {
          return []
        }
        return collectMarkdownFiles(fullPath, relativePath)
      }

      if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name === 'index.md') {
        return []
      }

      return [relativePath]
    })
}

function toTitle(relativePath) {
  return relativePath
    .replace(/\.md$/, '')
    .split(path.sep)
    .map((part) => part.replace(/[-_]/g, ' '))
    .join(' / ')
}

function toLink(relativePath) {
  return `./${relativePath.replace(/\\/g, '/').replace(/\.md$/, '')}`
}

function writeIndex(markdownFiles) {
  fs.mkdirSync(notesRoot, { recursive: true })

  const grouped = new Map()

  for (const file of markdownFiles.sort((a, b) => a.localeCompare(b, 'zh-CN'))) {
    const [group = '其他'] = file.split(path.sep)
    if (!grouped.has(group)) {
      grouped.set(group, [])
    }
    grouped.get(group).push(file)
  }

  const lines = [
    '# 笔记索引',
    '',
    '这里的内容来自 `docs/notes`，这是当前笔记网站的唯一笔记源目录。',
    '',
    `最近更新索引：${new Date().toLocaleString('zh-CN', { hour12: false })}`,
    '',
  ]

  for (const [group, files] of grouped) {
    lines.push(`## ${group}`, '')
    for (const file of files) {
      lines.push(`- [${toTitle(file)}](${toLink(file)})`)
    }
    lines.push('')
  }

  if (markdownFiles.length === 0) {
    lines.push('暂时还没有笔记。可以在 `docs/notes` 下新建 Markdown 文件。', '')
  }

  fs.writeFileSync(path.join(notesRoot, 'index.md'), `${lines.join('\n')}\n`)
}

const markdownFiles = collectMarkdownFiles(notesRoot)
writeIndex(markdownFiles)

console.log(`Updated notes index with ${markdownFiles.length} markdown files.`)
