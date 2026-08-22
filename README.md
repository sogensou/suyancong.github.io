# suyancong.gitlink.net

苏彦聪（Yancong Su）的个人主页 —— 厦门理工学院影视与传播学院。

**线上地址：<http://suyancong.gitlink.net>**

> ⚠️ 目前只能走 **HTTP**。`https://suyancong.gitlink.net` 的证书不覆盖该子域，
> 且会 301 跳转到 `www.gitlink.org.cn`，对外分享请用 `http://` 开头的链接。

---

## 部署机制

由 **GitLink Pages** 托管，纯静态、无构建步骤：

```
git push origin master
        │
        ▼
仓库 webhook（type: softbot）
POST https://gitlink.org.cn/api/site_pages/softbot_build
        │
        ▼
构建机拉取 master 根目录 → 发布到 http://suyancong.gitlink.net
```

推送到 `master` 后约 20–60 秒生效。仓库根目录的 `index.html` 就是站点首页。

### 仓库只有一个 webhook，别误删

`id=54336`，type `softbot`，指向上面那个 `softbot_build` 端点 —— **它就是部署本身**，
删掉站点就不再更新了。（原先还有一个建木 CI 的 `jianmu.gitlink.org.cn/webhook/projects/sync`，
因为仓库 `open_devops=false`、纯静态站点也用不上流水线，已于 2026-08-21 移除。）

### ⚠️ webhook 显示 `fail` 通常是假失败

GitLink 后台的 webhook 投递记录经常显示失败，响应体是：

```
context deadline exceeded (Client.Timeout exceeded while awaiting headers)
```

这是**构建接口同步执行、客户端等不到响应就超时**，而构建实际已经跑完。
判断有没有部署成功，不要看 webhook 状态，直接看站点内容：

```bash
curl -s http://suyancong.gitlink.net | grep -o '<title>.*</title>'
```

---

## 目录结构

```
.
├── index.html          首页：简介 · 研究方向 · 精选成果 · 近期动态 · 学术兼职
├── publications.html   研究成果：期刊论文 · 会议论文 · 策展参展 · 译著与随笔
├── research.html       科研项目：纵向课题 · 横向项目 · 教研教改
├── teaching.html       教学：主讲课程 · 学位论文 · 毕业设计 · 学科竞赛 · 大创项目
├── cv.html             简历：学习经历 · 工作经验 · 学术兼职 · 社会兼职 · 荣誉表彰
└── assets/
    ├── css/main.css    全站唯一样式表（设计令牌 + 组件）
    ├── js/main.js      三件事：主题切换、导航高亮、页脚更新时间
    ├── img/
    │   ├── avatar.png            首页头像 400×400（插画版证件照）
    │   ├── favicon.png           浏览器标签页图标 32×32（GitLink 线描头像）
    │   └── apple-touch-icon.png  iOS 添加到主屏图标 180×180（同上）
    └── files/          放 PDF 全文、简历附件等
```

### 页脚的「最近更新时间」

由 `main.js` 从 HTTP 响应的 `Last-Modified` 头读取并填入，**不需要手工维护**：
GitLink Pages 会把该头设为部署时间，所以推一次就自动刷新。
禁用 JavaScript 时整行不显示，以免留下一个过期的死日期。

### 分割线的约定

页面上的横线只有三种来源，改版式时注意别叠在一起：

1. `.section-title::after` —— 章节标题右侧那条细线
2. 列表内部的 `border-top`（`.pub` / `.entries > li` / `.timeline > li` / `.courses > li` / `.roles > li`）
   —— **每个列表的首项都要 `border-top: 0`**，否则会和上面的章节标题线挤成两条
3. 列表末项的 `border-bottom` —— 用来收口

`.section-title` 有 `3rem` 上边距把它和上一段内容隔开；作为容器首个元素、
或紧跟在页内目录 `.toc` 后面时归零，避免间距翻倍。

**没有构建、没有依赖、没有 CDN**。字体全部使用系统字体栈（国内网络不加载 Google Fonts），
图标是内联 SVG。直接改 HTML 就是改网站。

---

## 本地预览

```bash
python3 -m http.server 8765
```

然后打开 <http://127.0.0.1:8765>。

---

## 维护指引

### 加一篇论文

打开 `publications.html`，找到对应分区（`#journal` / `#conference` / `#exhibition` / `#other`），
复制任意一个 `<li class="pub">` 块改内容即可：

```html
<li class="pub"><div class="pub__type">2026</div><div>
  <div class="pub__title">论文标题</div>
  <div class="pub__authors"><span class="me">苏彦聪</span>, 合作者</div>
  <div class="pub__venue">期刊或会议, 卷(期): 页码, 年份</div>
  <div class="pub__links"><a href="https://doi.org/..." rel="noopener">DOI</a></div>
</div></li>
```

`<span class="me">` 是本人署名加粗。别忘了同步改页顶目录里的计数
（`期刊论文 · 11` 这类数字）和首页 `.stats` 区的四个统计数。

### 加一个课题 / 竞赛 / 课程

- 课题、竞赛、大创 → `.entries` 列表，序号是 CSS 自动生成的，不用手写
- 课程、毕业设计 → `.courses` 列表
- 主持 / 参与用 `<span class="role">主持</span>` 和 `<span class="role role--minor">参与</span>` 区分

### 改导航或页脚

⚠️ **导航栏和页脚在 5 个 HTML 文件里各有一份**，这是"零构建"的代价。
增删导航项、改页脚信息时，5 个文件都要改，别漏。

同理，**学术兼职在 `index.html` 和 `cv.html` 里各有一份**，改一处记得同步另一处。

### 换头像与图标

**首页头像**：替换 `assets/img/avatar.png`（正方形，400×400 左右即可）。

**标签页图标**：`favicon.png` / `apple-touch-icon.png` 用的是另一张源图——
GitLink 上那张黑白线描头像，比插画版更抗缩小。两者互相独立，换其中一个不影响另一个。

favicon 做成 **32×32**：2x 屏的标签页正好原生显示 32px，1x 屏由浏览器降到 16px。
线描的笔画很细，直接缩会被平均成灰雾，所以缩放前先用 `MinFilter(21)` 把黑线加粗一档
（`apple-touch-icon` 有 180px 空间，不需要加粗）。16px 下依然偏软，这是线描本身的限制，
换素材时别指望调参数能解决。

三张图的背景都填成站点浅色背景 `#fbfaf8`，所以浅色主题下头像和页面是连成一片的。

> 换完图标后浏览器多半还显示旧的——favicon 缓存比普通资源顽固得多，
> 硬刷新（`Cmd+Shift+R`）或换个标签页打开才看得到。

### 配色与排版

全部集中在 `assets/css/main.css` 第 1 节的设计令牌里，改那几个变量就能换肤。
深浅两套色值分别定义在 `:root`、`@media (prefers-color-scheme: dark)` 和
`:root[data-theme="dark"]` 三处，改配色时三处都要顾到。

现有配色已按 WCAG AA 校验过（正文 ≥ 15:1，弱化文字 ≥ 4.5:1，主按钮 ≥ 5.9:1）。

---

## 待补充

- [ ] `assets/files/` 下放简历 PDF，并在 `cv.html` 加下载按钮
- [ ] 论文 PDF 全文（有版权允许的）挂到 `assets/files/`，在对应条目加 PDF 链接
- [ ] 策展作品与互动装置的图片／视频，可在首页加一个作品展示区
