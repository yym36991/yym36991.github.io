<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type LinkItem = {
  text: string
  href: string
  icon?: string
  iconUrl?: string
  external?: boolean
}

type CategoryBlock = {
  title: string
  links: LinkItem[]
}

const now = ref(new Date())
const searchKeyword = ref('')
const searchType = ref<'web' | 'image' | 'video'>('web')
const searchEngine = ref<'bing' | 'baidu' | 'sogou' | 'google' | 'toutiao' | 'site'>('bing')
let timer: ReturnType<typeof setInterval> | undefined

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const timeText = computed(() =>
  now.value.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }),
)

const dateText = computed(() => {
  const date = now.value
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')} ${weekDays[date.getDay()]}`
})

const secondDeg = computed(() => now.value.getSeconds() * 6)
const minuteDeg = computed(() => now.value.getMinutes() * 6 + now.value.getSeconds() * 0.1)
const hourDeg = computed(() => (now.value.getHours() % 12) * 30 + now.value.getMinutes() * 0.5)

function linkTarget(item: LinkItem) {
  return item.external || item.href.startsWith('http') ? '_blank' : undefined
}

function linkRel(item: LinkItem) {
  return item.external || item.href.startsWith('http') ? 'noreferrer' : undefined
}

onMounted(async () => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const quickLinks: LinkItem[] = [
  { text: '京东', href: 'https://www.jd.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=jd.com&sz=32', external: true },
  { text: '天猫', href: 'https://www.tmall.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=tmall.com&sz=32', external: true },
  { text: '唯品会', href: 'https://www.vip.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=vip.com&sz=32', external: true },
  { text: '携程旅行', href: 'https://www.ctrip.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=ctrip.com&sz=32', external: true },
  { text: '哔哩哔哩', href: 'https://www.bilibili.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=bilibili.com&sz=32', external: true },
  { text: 'DeepSeek', href: 'https://chat.deepseek.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=32', external: true },
  { text: '笔记索引', href: '/notes/', icon: '📚' },
  { text: 'Git 中文', href: 'https://git-scm.com/book/zh/v2', icon: '🌿', external: true },
  { text: 'Go 文档', href: 'https://go.dev/doc/', iconUrl: 'https://www.google.com/s2/favicons?domain=go.dev&sz=32', external: true },
  { text: '知乎', href: 'https://www.zhihu.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=zhihu.com&sz=32', external: true },
  { text: '豆瓣', href: 'https://www.douban.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=douban.com&sz=32', external: true },
  { text: 'Redis 文档', href: 'https://redis.io/docs/latest/', iconUrl: 'https://www.google.com/s2/favicons?domain=redis.io&sz=32', external: true },
]

function buildSearchUrl() {
  const keyword = searchKeyword.value.trim()
  if (!keyword) {
    return ''
  }

  const query = encodeURIComponent(keyword)

  if (searchEngine.value === 'site') {
    return `https://www.google.com/search?q=${encodeURIComponent(`site:yym36991.github.io ${keyword}`)}`
  }

  const searchMap = {
    bing: {
      web: `https://www.bing.com/search?q=${query}`,
      image: `https://www.bing.com/images/search?q=${query}`,
      video: `https://www.bing.com/videos/search?q=${query}`,
    },
    baidu: {
      web: `https://www.baidu.com/s?wd=${query}`,
      image: `https://image.baidu.com/search/index?tn=baiduimage&word=${query}`,
      video: `https://www.baidu.com/sf/vsearch?pd=video&wd=${query}`,
    },
    sogou: {
      web: `https://www.sogou.com/web?query=${query}`,
      image: `https://pic.sogou.com/pics?query=${query}`,
      video: `https://v.sogou.com/v?query=${query}`,
    },
    google: {
      web: `https://www.google.com/search?q=${query}`,
      image: `https://www.google.com/search?tbm=isch&q=${query}`,
      video: `https://www.google.com/search?tbm=vid&q=${query}`,
    },
    toutiao: {
      web: `https://so.toutiao.com/search?keyword=${query}`,
      image: `https://so.toutiao.com/search?keyword=${query}&pd=image`,
      video: `https://so.toutiao.com/search?keyword=${query}&pd=video`,
    },
  } as const

  return searchMap[searchEngine.value]?.[searchType.value] || ''
}

function submitSearch() {
  const url = buildSearchUrl()
  if (url) {
    window.open(url, '_blank', 'noreferrer')
  }
}

const categories: CategoryBlock[] = [
  {
    title: '开发文档',
    links: [
      { text: 'Git 中文', href: 'https://git-scm.com/book/zh/v2', icon: '🌿', external: true },
      { text: 'SVN 手册', href: 'https://svnbook.red-bean.com/', icon: '🛠️', external: true },
      { text: 'jQuery API', href: 'https://api.jquery.com/', icon: '🌙', external: true },
      { text: 'Nginx 文档', href: 'https://nginx.org/en/docs/', icon: '🟢', external: true },
      { text: 'Kafka 文档', href: 'https://kafka.apache.org/documentation/', icon: '📨', external: true },
      { text: 'MyBatis 文档', href: 'https://mybatis.org/mybatis-3/zh_CN/', icon: '🐦', external: true },
      { text: '小程序文档', href: 'https://developers.weixin.qq.com/miniprogram/dev/framework/', icon: '💬', external: true },
      { text: 'Node.js 文档', href: 'https://nodejs.org/docs/latest/api/', icon: '🟩', external: true },
      { text: 'Apache 文档', href: 'https://httpd.apache.org/docs/', icon: '🪶', external: true },
      { text: 'Spring 文档', href: 'https://spring.io/projects/spring-framework', icon: '🍃', external: true },
      { text: 'Go 文档', href: 'https://go.dev/doc/', icon: '🟦', external: true },
      { text: 'Java 文档', href: 'https://docs.oracle.com/en/java/', icon: '☕', external: true },
      { text: 'Maven 文档', href: 'https://maven.apache.org/guides/', icon: '📦', external: true },
      { text: 'Docker 文档', href: 'https://docs.docker.com/', icon: '🐳', external: true },
      { text: 'Kubernetes 文档', href: 'https://kubernetes.io/zh-cn/docs/home/', icon: '⎈', external: true },
      { text: 'React 文档', href: 'https://react.dev/', icon: '⚛️', external: true },
      { text: 'Vue 文档', href: 'https://cn.vuejs.org/', icon: '🟢', external: true },
      { text: 'SpringBoot', href: 'https://spring.io/projects/spring-boot', icon: '🍃', external: true },
      { text: 'SpringCloud', href: 'https://spring.io/projects/spring-cloud', icon: '🍃', external: true },
      { text: 'Jenkins 文档', href: 'https://www.jenkins.io/doc/', icon: '👨‍🔧', external: true },
    ],
  },
  {
    title: '软件编程',
    links: [
      { text: 'GitHub', href: 'https://github.com/', icon: '🐙', external: true },
      { text: 'Gitee', href: 'https://gitee.com/', icon: '🟥', external: true },
      { text: 'SourceForge', href: 'https://sourceforge.net/', icon: '🔶', external: true },
      { text: 'LeetCode', href: 'https://leetcode.cn/problemset/', icon: '🧩', external: true },
      { text: 'Stack Overflow', href: 'https://stackoverflow.com/', icon: '🧱', external: true },
      { text: 'SegmentFault', href: 'https://segmentfault.com/', icon: 'sf', external: true },
      { text: 'CSDN', href: 'https://www.csdn.net/', icon: 'C', external: true },
      { text: '博客园', href: 'https://www.cnblogs.com/', icon: '园', external: true },
      { text: '开源中国', href: 'https://www.oschina.net/', icon: 'C', external: true },
      { text: 'Linux 中国', href: 'https://linux.cn/', icon: 'L', external: true },
      { text: '开发者头条', href: 'https://toutiao.io/', icon: '头', external: true },
      { text: '脚本之家', href: 'https://www.jb51.net/', icon: '脚', external: true },
      { text: 'W3CSchool', href: 'https://www.w3cschool.cn/', icon: 'W', external: true },
      { text: '菜鸟教程', href: 'https://www.runoob.com/', icon: '菜', external: true },
      { text: '廖雪峰', href: 'https://www.liaoxuefeng.com/', icon: '✈️', external: true },
      { text: '阮一峰', href: 'https://www.ruanyifeng.com/blog/', icon: '阮', external: true },
      { text: '清华镜像', href: 'https://mirrors.tuna.tsinghua.edu.cn/', icon: '🪁', external: true },
      { text: 'MDN', href: 'https://developer.mozilla.org/zh-CN/', icon: 'MDN', external: true },
      { text: 'Apache', href: 'https://www.apache.org/', icon: '🪶', external: true },
      { text: 'Kernel', href: 'https://www.kernel.org/', icon: '🐧', external: true },
      { text: 'Java', href: 'https://docs.oracle.com/en/java/', icon: '☕', external: true },
      { text: 'Python', href: 'https://docs.python.org/zh-cn/3/', icon: '🐍', external: true },
      { text: 'PyPI', href: 'https://pypi.org/', icon: '📦', external: true },
      { text: 'Node.js', href: 'https://nodejs.org/', icon: '🟩', external: true },
      { text: 'NPM', href: 'https://www.npmjs.com/', icon: 'N', external: true },
      { text: 'GoLang', href: 'https://go.dev/', icon: '🐹', external: true },
      { text: 'PyTorch', href: 'https://pytorch.org/', icon: '🔥', external: true },
      { text: 'TensorFlow', href: 'https://www.tensorflow.org/', icon: 'T', external: true },
    ],
  },
  {
    title: '开发工具',
    links: [
      { text: '字符编码', href: 'https://www.qqxiuzi.cn/bianma/zifuji.php', icon: 'H', external: true },
      { text: 'Unicode', href: 'https://unicode-table.com/cn/', icon: 'H', external: true },
      { text: 'UTF8', href: 'https://www.qqxiuzi.cn/bianma/Unicode-UTF.php', icon: 'H', external: true },
      { text: '菜鸟工具集', href: 'https://c.runoob.com/', icon: '🧰', external: true },
      { text: 'ITool', href: 'https://www.itoolkit.co/', icon: 'I', external: true },
      { text: 'CodePen', href: 'https://codepen.io/', icon: '✒️', external: true },
      { text: 'Gitpod', href: 'https://www.gitpod.io/', icon: '🌀', external: true },
      { text: 'CodeSandbox', href: 'https://codesandbox.io/', icon: '📦', external: true },
      { text: 'Godbolt', href: 'https://godbolt.org/', icon: '⚙️', external: true },
      { text: 'MD5', href: 'https://www.cmd5.com/', icon: '🔐', external: true },
      { text: 'Base64', href: 'https://base64.us/', icon: '🔢', external: true },
      { text: 'JWT', href: 'https://jwt.io/', icon: 'JWT', external: true },
      { text: 'URL 编解码', href: 'https://www.urlencoder.org/', icon: '🔗', external: true },
      { text: 'ASCII 表', href: 'https://www.asciitable.com/', icon: 'A', external: true },
      { text: '进制转换', href: 'https://tool.oschina.net/hexconvert/', icon: '🔢', external: true },
      { text: 'JSON 解析', href: 'https://jsoneditoronline.org/', icon: 'JSON', external: true },
      { text: 'JS 格式化', href: 'https://beautifier.io/', icon: 'JS', external: true },
      { text: 'SQL 压缩', href: 'https://sqlformat.org/', icon: 'SQL', external: true },
      { text: '正则调试', href: 'https://regex101.com/', icon: '.*', external: true },
      { text: 'IP 归属', href: 'https://www.ip138.com/', icon: '🧭', external: true },
      { text: 'UUID 生成器', href: 'https://www.uuidgenerator.net/', icon: 'UUID', external: true },
      { text: '在线比较', href: 'https://www.diffchecker.com/', icon: '🪞', external: true },
      { text: 'Chrome 插件', href: 'https://chromewebstore.google.com/', icon: '🌐', external: true },
    ],
  },
  {
    title: '数据库缓存',
    links: [
      { text: 'Redis 文档', href: 'https://redis.io/docs/latest/', icon: '🔴', external: true },
      { text: 'MySQL 文档', href: 'https://dev.mysql.com/doc/', icon: '🐬', external: true },
      { text: 'PostgreSQL 文档', href: 'https://www.postgresql.org/docs/', icon: '🐘', external: true },
      { text: 'MongoDB 文档', href: 'https://www.mongodb.com/docs/', icon: '🍃', external: true },
      { text: 'ElasticSearch 文档', href: 'https://www.elastic.co/docs', icon: '🔎', external: true },
      { text: '本地 Redis 笔记', href: '/notes/redis/notes', icon: '📝' },
      { text: '本地 ES 笔记', href: '/notes/elastic_search/README', icon: '📒' },
    ],
  },
  {
    title: 'OJ Online',
    links: [
      { text: '清华 OJ', href: 'https://dsa.cs.tsinghua.edu.cn/oj/', icon: '🎓', external: true },
      { text: '浙大 PTA', href: 'https://pintia.cn/', icon: '🎓', external: true },
      { text: '杭电 OJ', href: 'http://acm.hdu.edu.cn/', icon: '🏫', external: true },
      { text: '力扣 LeetCode', href: 'https://leetcode.cn/problemset/', icon: '🧩', external: true },
      { text: '洛谷', href: 'https://www.luogu.com.cn/', icon: '🏔️', external: true },
      { text: 'Codeforces', href: 'https://codeforces.com/', icon: '⚔️', external: true },
      { text: 'AtCoder', href: 'https://atcoder.jp/', icon: '🧠', external: true },
      { text: '牛客编程', href: 'https://www.nowcoder.com/exam/oj', icon: '🐮', external: true },
    ],
  },
  {
    title: 'AI 与搜索',
    links: [
      { text: 'DeepSeek', href: 'https://chat.deepseek.com/', icon: '🤖', external: true },
      { text: 'ChatGPT', href: 'https://chatgpt.com/', icon: '💬', external: true },
      { text: '豆包', href: 'https://www.doubao.com/', icon: '🫘', external: true },
      { text: 'Google', href: 'https://www.google.com/', icon: 'G', external: true },
      { text: '百度', href: 'https://www.baidu.com/', icon: '🔍', external: true },
      { text: 'Bing', href: 'https://www.bing.com/', icon: '🔎', external: true },
    ],
  },
  {
    title: '本地笔记',
    links: [
      { text: 'Go 语言语法', href: '/notes/go_learn/go语言语法/基本语法', icon: '🟦' },
      { text: 'Go 机制原理', href: '/notes/go_learn/go机制原理/知识点', icon: '⚙️' },
      { text: 'Linux 网络', href: '/notes/linux_learn/dir_网络通信基础/知识点', icon: '🐧' },
      { text: 'HTTP 基础', href: '/notes/lib/http_web/基础', icon: '🌐' },
      { text: 'DDIA', href: '/notes/books/ddia', icon: '🗄️' },
      { text: '全部笔记', href: '/notes/', icon: '📚' },
    ],
  },
  {
    title: '站内服务',
    links: [
      { text: '首页', href: '/', icon: '🏠' },
      { text: '笔记索引', href: '/notes/', icon: '📚' },
      { text: 'Go 笔记', href: '/notes/go_learn/go语言语法/基本语法', icon: '🟦' },
      { text: 'Redis 笔记', href: '/notes/redis/notes', icon: '🔴' },
      { text: 'Linux 笔记', href: '/notes/linux_learn/dir_网络通信基础/知识点', icon: '🐧' },
      { text: '使用说明', href: '/guide/usage', icon: '📖' },
    ],
  },
  {
    title: '视频学习',
    links: [
      { text: 'B 站', href: 'https://www.bilibili.com/', icon: '📺', external: true },
      { text: 'YouTube', href: 'https://www.youtube.com/', icon: '▶️', external: true },
      { text: '慕课网', href: 'https://www.imooc.com/', icon: '🎬', external: true },
      { text: '中国大学 MOOC', href: 'https://www.icourse163.org/', icon: '🎓', external: true },
    ],
  },
  {
    title: '社区问答',
    links: [
      { text: 'Stack Overflow', href: 'https://stackoverflow.com/', icon: '🧱', external: true },
      { text: '掘金', href: 'https://juejin.cn/', icon: '💎', external: true },
      { text: '知乎', href: 'https://www.zhihu.com/', icon: '知', external: true },
      { text: 'V2EX', href: 'https://www.v2ex.com/', icon: 'V', external: true },
    ],
  },
  {
    title: '小说文学',
    links: [
      { text: '起点', href: 'https://www.qidian.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=qidian.com&sz=32', external: true },
      { text: '纵横', href: 'https://www.zongheng.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=zongheng.com&sz=32', external: true },
      { text: '创世中文', href: 'https://chuangshi.qq.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=qq.com&sz=32', external: true },
      { text: '17K 小说', href: 'https://www.17k.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=17k.com&sz=32', external: true },
      { text: '飞卢', href: 'https://b.faloo.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=faloo.com&sz=32', external: true },
      { text: '凤凰书城', href: 'https://book.ifeng.com/', iconUrl: 'https://www.google.com/s2/favicons?domain=ifeng.com&sz=32', external: true },
      { text: '晋江文学', href: 'https://www.jjwxc.net/', iconUrl: 'https://www.google.com/s2/favicons?domain=jjwxc.net&sz=32', external: true },
      { text: '古诗文网', href: 'https://www.gushiwen.cn/', iconUrl: 'https://www.google.com/s2/favicons?domain=gushiwen.cn&sz=32', external: true },
      { text: '藏书网', href: 'https://www.99csw.com/book/', iconUrl: 'https://www.google.com/s2/favicons?domain=99csw.com&sz=32', external: true },
    ],
  },
  {
    title: '股市投资',
    links: [
      { text: '大盘云图', href: 'https://52etf.site/', iconUrl: 'https://www.google.com/s2/favicons?domain=52etf.site&sz=32', external: true },
      { text: '深交所', href: 'https://www.szse.cn/index/index.html', iconUrl: 'https://www.google.com/s2/favicons?domain=szse.cn&sz=32', external: true },
      { text: '新浪行情', href: 'https://vip.stock.finance.sina.com.cn/mkt/', iconUrl: 'https://www.google.com/s2/favicons?domain=sina.com.cn&sz=32', external: true },
      { text: '集思录', href: 'https://www.jisilu.cn/', iconUrl: 'https://www.google.com/s2/favicons?domain=jisilu.cn&sz=32', external: true },
    ],
  },
]
</script>

<template>
  <section class="portal-home">
    <div class="portal-topbar">
      <div class="portal-brand">
        <strong>Home.com</strong>
      </div>
      <nav>
        <a href="/notes/">云书签</a>
        <a href="/notes/">云笔记</a>
        <a href="/guide/usage">关于本站</a>
      </nav>
      <div class="portal-clock-panel">
        <div class="clock-face" aria-label="当前时间">
          <span class="clock-mark mark-1">1</span>
          <span class="clock-mark mark-2">2</span>
          <span class="clock-mark mark-4">4</span>
          <span class="clock-mark mark-5">5</span>
          <span class="clock-mark mark-7">7</span>
          <span class="clock-mark mark-8">8</span>
          <span class="clock-mark mark-10">10</span>
          <span class="clock-mark mark-11">11</span>
          <span class="clock-mark mark-12">12</span>
          <span class="clock-mark mark-3">3</span>
          <span class="clock-mark mark-6">6</span>
          <span class="clock-mark mark-9">9</span>
          <i class="clock-hand hour" :style="{ transform: `rotate(${hourDeg}deg)` }"></i>
          <i class="clock-hand minute" :style="{ transform: `rotate(${minuteDeg}deg)` }"></i>
          <i class="clock-hand second" :style="{ transform: `rotate(${secondDeg}deg)` }"></i>
          <b></b>
        </div>
      </div>
    </div>

    <form class="portal-search" @submit.prevent="submitSearch">
      <div class="search-types" aria-label="搜索类型">
        <label><input v-model="searchType" type="radio" value="web" />网页</label>
        <label><input v-model="searchType" type="radio" value="image" />图片</label>
        <label><input v-model="searchType" type="radio" value="video" />视频</label>
      </div>
      <div class="search-main">
        <span>输入关键字</span>
        <input v-model="searchKeyword" aria-label="输入搜索关键字" />
        <button type="submit">点击搜索</button>
      </div>
      <div class="search-engines" aria-label="搜索引擎">
        <label><input v-model="searchEngine" type="radio" value="bing" />bing 必应</label>
        <label><input v-model="searchEngine" type="radio" value="baidu" />baidu 百度</label>
        <label><input v-model="searchEngine" type="radio" value="sogou" />sogou 搜狗</label>
        <label><input v-model="searchEngine" type="radio" value="google" />Google 谷歌</label>
        <label><input v-model="searchEngine" type="radio" value="toutiao" />头条搜索</label>
        <label><input v-model="searchEngine" type="radio" value="site" />站内搜索</label>
      </div>
    </form>

    <div class="portal-card portal-common">
      <div class="portal-common-links">
        <a
          v-for="item in quickLinks"
          :key="item.href"
          :href="item.href"
          :target="linkTarget(item)"
          :rel="linkRel(item)"
        >
          <img v-if="item.iconUrl" class="portal-link-icon" :src="item.iconUrl" alt="" loading="lazy" />
          <span v-if="item.icon">{{ item.icon }}</span>
          {{ item.text }}
        </a>
      </div>
    </div>

    <div class="portal-card portal-categories">
      <div class="portal-category-grid">
        <div
          v-for="category in categories"
          :key="category.title"
          class="portal-category"
          :class="{ 'portal-category-compact': category.links.length <= 4 }"
        >
          <button type="button">{{ category.title }}</button>
          <div class="portal-flyout">
          <a
            v-for="link in category.links"
            :key="link.href"
            :href="link.href"
            :target="linkTarget(link)"
            :rel="linkRel(link)"
          >
            <img v-if="link.iconUrl" class="portal-link-icon" :src="link.iconUrl" alt="" loading="lazy" />
            <span v-if="link.icon">{{ link.icon }}</span>
            {{ link.text }}
          </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
