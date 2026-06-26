# notes_site

本地优先的技术笔记网站，基于 VitePress。

## 本地运行

```bash
npm install
npm run dev
```

访问：

```text
http://127.0.0.1:5173
```

## 同步笔记

```bash
npm run sync
```

默认从 `/Users/a58/Desktop/golang_and_linux` 同步 Markdown 文件到 `docs/notes`。

如需临时切换来源：

```bash
NOTES_SOURCE_ROOT=/path/to/notes npm run sync
```

## 构建

```bash
npm run build
npm run preview
```

## 自动提交

```bash
npm run git:auto-commit
```

如果配置了 `origin` 远程仓库，脚本会在提交后自动推送当前分支。
