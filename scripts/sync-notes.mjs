import fs from 'node:fs'
import path from 'node:path'

const siteRoot = path.resolve(new URL('..', import.meta.url).pathname)
const sourceRoot = process.env.NOTES_SOURCE_ROOT || '/Users/a58/Desktop/golang_and_linux'
const targetRoot = path.join(siteRoot, 'docs', 'notes')

const includePaths = [
  'books',
  'go_learn',
  'redis',
  'linux_learn',
  'lib/http_web',
  'elastic_search',
]

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

function ensureDirectory(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function removeDirectory(dir) {
  fs.rmSync(dir, { recursive: true, force: true })
}

function copyMarkdownFiles(sourceDir, relativeBase, copiedFiles) {
  if (!fs.existsSync(sourceDir)) {
    return
  }

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) {
      continue
    }

    const sourcePath = path.join(sourceDir, entry.name)
    const relativePath = path.join(relativeBase, entry.name)

    if (entry.isDirectory()) {
      if (ignoreDirectories.has(entry.name)) {
        continue
      }
      copyMarkdownFiles(sourcePath, relativePath, copiedFiles)
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue
    }

    const targetPath = path.join(targetRoot, relativePath)
    ensureDirectory(path.dirname(targetPath))
    const content = fs
      .readFileSync(sourcePath, 'utf8')
      .replace(/```(\s*)golang\b/g, '```$1go')
      .replace(/~~~(\s*)golang\b/g, '~~~$1go')
    fs.writeFileSync(targetPath, content)
    copiedFiles.push(relativePath)
  }
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

function writeIndex(copiedFiles) {
  const grouped = new Map()

  for (const file of copiedFiles.sort((a, b) => a.localeCompare(b, 'zh-CN'))) {
    const [group = '其他'] = file.split(path.sep)
    if (!grouped.has(group)) {
      grouped.set(group, [])
    }
    grouped.get(group).push(file)
  }

  const lines = [
    '# 笔记索引',
    '',
    `同步来源：\`${sourceRoot}\``,
    '',
    `最近同步：${new Date().toLocaleString('zh-CN', { hour12: false })}`,
    '',
  ]

  for (const [group, files] of grouped) {
    lines.push(`## ${group}`, '')
    for (const file of files) {
      lines.push(`- [${toTitle(file)}](${toLink(file)})`)
    }
    lines.push('')
  }

  if (copiedFiles.length === 0) {
    lines.push('暂未同步到 Markdown 文件。', '')
  }

  fs.writeFileSync(path.join(targetRoot, 'index.md'), `${lines.join('\n')}\n`)
}

removeDirectory(targetRoot)
ensureDirectory(targetRoot)

const copiedFiles = []

for (const includePath of includePaths) {
  copyMarkdownFiles(path.join(sourceRoot, includePath), includePath, copiedFiles)
}

writeIndex(copiedFiles)

console.log(`Synced ${copiedFiles.length} markdown files to ${targetRoot}`)
