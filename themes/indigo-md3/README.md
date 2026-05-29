# hexo-theme-indigo-md3

基于 Material Design 3 (MD3) 设计规范改版的高颜值、极简响应式 Hexo 博客主题。

---

## 🌟 核心功能亮点

1. **🎨 6 套内置配色切换（支持 Light / Dark 双色模式）**
   - 内置了 **Indigo** (默认靛蓝)、**Emerald** (翡翠绿)、**Terracotta** (陶土红)、**Amber** (琥珀黄)、**Ocean** (海洋蓝) 和 **Rose** (玫瑰粉) 六种高品质 MD3 主题色，支持 Light 和 Dark 模式无缝自动转换。
2. **🎛️ 高度自定义色彩方案**
   - 采用 4 个核心基准色彩（`primary`、`on_primary`、`primary_container`、`on_primary_container`）为设计支柱，支持在配置文件中直接通过十六进制色彩值（Hex Code）同时定制白天和黑夜模式的专属配色。
3. **🌐 首屏中文化与 Runtime 语言自适应**
   - 构建生成时静态渲染 Simplified Chinese（防闪烁、首屏极速呈现）。
   - 客户端加载时根据浏览器 `navigator.language` 自动适配英文（当浏览器语言非中文时无缝替换），完美兼顾多语言体验。
4. **📶 一键复制 RSS 与 MD3 Toast 提醒**
   - 右上角常驻 RSS 订阅按钮。点击即可将订阅源的绝对路径写入剪贴板（兼容各版本浏览器及降级复制）。
   - 复制成功后，会在页面底部弹出一个精致的 Material Design 3 风格 Toast 提示条，3 秒后优雅隐退。
5. **🪟 MD3 分享模态弹窗**
   - 移除了首页底部怪异平铺的社交图标，将其完美收纳进隐藏的 `.md-dialog` 模态遮罩弹窗内。仅在文章分享时触发弹窗，界面极其清爽。
6. **⚡ 纯 CSS Grid 2列归档布局**
   - 弃用了原版低效且在图片加载时易抖动的 JS 瀑布流，改用纯 CSS Grid 布局，响应式适配单双栏切换，间距与呼吸感恰到好处。
7. **🖼️ 图片灯箱支持（Lightbox）**
   - 内置优雅的图片画廊灯箱，支持点击图片放大、遮罩、标题展示与滚动自适应。

---

## 🛠️ 安装与启用

1. 将本主题克隆/解压至 Hexo 博客的 `themes/indigo-md3` 目录下。
2. 打开 Hexo 博客根目录下的 `_config.yml` 配置文件。
3. 找到 `theme` 项，并将其修改为 `indigo-md3`：
   ```yaml
   theme: indigo-md3
   ```
4. 确保在根目录安装了 `lodash` 依赖，以支持模板 Locals 扩展：
   ```bash
   npm install lodash --save
   ```

---

## ⚙️ 主题详细配置说明

打开 `themes/indigo-md3/_config.yml` 文件进行个性化定制：

### 1. 配色方案设置 (`theme_color`)
```yaml
theme_color:
  # 选择当前使用的配色方案：
  # 可选：indigo (靛蓝), emerald (翡翠绿), terracotta (陶土红), amber (琥珀黄), ocean (海洋蓝), rose (玫瑰粉), custom (自定义)
  scheme: indigo

  # 当且仅当 scheme 设置为 custom 时，以下自定义 Hex 配色才会生效
  custom:
    light:
      primary: '#4F52B2'                  # 主色
      on_primary: '#FFFFFF'               # 主色上的文本色
      primary_container: '#E2DFFF'        # 主色容器背景
      on_primary_container: '#0B0067'     # 主色容器之上的文本色
    dark:
      primary: '#BEC2FF'
      on_primary: '#1B1F83'
      primary_container: '#363999'
      on_primary_container: '#E2DFFF'
```

### 2. 导航菜单定制 (`menu`)
每一项的 Key 匹配 [Google Material Symbols](https://fonts.google.com/icons) 中的图标名称（例如：`home`、`archive`、`sell`、`category`），特异支持 `github` 自动渲染 GitHub 官方 SVG Logo：
```yaml
menu:
  home:
    text: Home
    url: /
  archive:
    text: Archives
    url: /archives
  sell:
    text: Tags
    url: /tags
  category:
    text: Categories
    url: /categories
  github:
    text: GitHub
    url: https://github.com/your-username
    target: _blank
```

### 3. 博主基本信息
```yaml
avatar: /img/avatar.jpg     # 头像路径
avatar_link: /              # 点击头像跳转地址
brand: /img/brand.jpg       # 抽屉导航背景图
favicon: /favicon.ico       # 浏览器标签栏图标路径
since_year: 2020            # 博客创建年份（展示在页脚）
about: "A developer exploring web technologies and Material Design."
```

### 4. 赞赏与打赏模态弹窗
```yaml
reward:
  title: 感谢您的支持！
  wechat: /img/wechat.jpg     # 微信收款码路径 (设为 false 禁用)
  alipay: /img/alipay.jpg     # 支付宝收款码路径 (设为 false 禁用)
```

---

## 📄 许可证

本主题基于 [MIT License](LICENSE) 开源发布。
博客生成内容推荐遵循 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 知识共享署名-非商业性-相同方式共享国际协议。
