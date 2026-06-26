# 技术笔记

这是一个本地优先的 Markdown 笔记网站，用来整理 Go、Linux、Redis、HTTP、数据库等学习记录。

## 快速开始

```bash
npm install
npm run dev
```

启动后打开：

```text
http://127.0.0.1:5173
```

## 内容来源

执行 `npm run sync` 时，会从下面目录同步 Markdown 文件：

- `/Users/a58/Desktop/golang_and_linux/books`
- `/Users/a58/Desktop/golang_and_linux/go_learn`
- `/Users/a58/Desktop/golang_and_linux/redis`
- `/Users/a58/Desktop/golang_and_linux/linux_learn`
- `/Users/a58/Desktop/golang_and_linux/lib/http_web`
- `/Users/a58/Desktop/golang_and_linux/elastic_search`

同步后的内容会展示在“笔记”栏目中。

## 常用命令

```bash
npm run dev
npm run build
npm run preview
npm run sync
npm run git:auto-commit
```
