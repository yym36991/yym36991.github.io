直接访问：https://yym36991.github.io就能看到

当前已经备份：
cd /Users/a58/Desktop

git clone git@github.com:yym36991/yym36991.github.io.git yym36991.github.io.backup
cd yym36991.github.io.backup

git branch hexo-archive
git tag hexo-archive-2026-06-26

git push origin hexo-archive
git push origin hexo-archive-2026-06-26

这样 GitHub 上会多出：

branch: hexo-archive
tag:    hexo-archive-2026-06-26
以后想恢复旧站，可以：

git checkout hexo-archive
或者在 GitHub 页面切换到 hexo-archive 分支查看旧文件。




