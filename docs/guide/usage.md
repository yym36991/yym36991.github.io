# 使用说明

## 本地启动

首次使用：

```bash
cd /Users/a58/Desktop/notes_site
npm install
npm run dev
```

之后日常启动：

```bash
cd /Users/a58/Desktop/notes_site
npm run dev
```

## 写笔记

网站的笔记源目录是：

```text
docs/notes
```

以后不要再把新笔记写到 `/Users/a58/Desktop/golang_and_linux`。直接在 `docs/notes` 下按分类新建 Markdown 文件即可。

如果只想重新生成笔记索引，可以执行：

```bash
npm run update-index
```

`npm run dev` 和 `npm run build` 会自动先更新索引。

## 自动提交

自动提交脚本会在有变更时提交当前仓库：

```bash
npm run git:auto-commit
```

如果后续要定期自动提交，可以用 macOS 的 `launchd` 定时执行这个命令。

## GitHub Pages

项目已经包含 GitHub Pages 工作流。推送到 GitHub 后，在仓库设置里将 Pages source 设为 GitHub Actions，即可托管静态网站。
