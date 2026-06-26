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

## 同步笔记

网站不会直接改动原始笔记目录。`npm run sync` 会把 `/Users/a58/Desktop/golang_and_linux` 中指定目录下的 Markdown 文件复制到 `docs/notes`。

```bash
npm run sync
```

`npm run dev` 和 `npm run build` 会自动先执行同步。

## 自动提交

自动提交脚本会在有变更时提交当前仓库：

```bash
npm run git:auto-commit
```

如果后续要定期自动提交，可以用 macOS 的 `launchd` 定时执行这个命令。

## GitHub Pages

项目已经包含 GitHub Pages 工作流。推送到 GitHub 后，在仓库设置里将 Pages source 设为 GitHub Actions，即可托管静态网站。
