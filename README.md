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

## 写笔记

所有笔记都直接保存在：

```text
docs/notes
```

在这个目录下新建或编辑 Markdown 文件后，`npm run dev` 和 `npm run build` 会自动更新笔记索引。

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
