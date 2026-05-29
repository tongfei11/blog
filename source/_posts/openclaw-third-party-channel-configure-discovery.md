---
title: OpenClaw 第三方 Channel 在 configure 里消失：从 4.27 问题到 5.12 修复
date: 2026-05-26 18:08:00
tags:
  - OpenClaw
  - 插件
  - Channel
  - 排查
---

最近在跟进我们自己的 Channel 插件对最新 OpenClaw 的兼容情况。这个插件本来可以作为第三方 Channel 接入 OpenClaw，但升级到 2026.4.27 之后，出现了一个很具体的问题：插件还在，也能被加载，但官方配置入口里看不到这个 Channel 了。

这类问题容易被误判成插件运行时坏了。实际排查下来，真正断掉的是“发现和配置”这条链路。

## 问题现象

当时本机有一个第三方 Channel 插件，安装在 OpenClaw 配置目录的 `npm/node_modules` 下面。插件本身有 Channel 能力，也声明了相关 metadata。

但升级后，进入官方配置流程：

```bash
openclaw configure --section channels
```

对应的 Channel 不再出现在可选列表里。

这意味着用户无法通过官方 configure 流程完成配置。插件并不是完全不能运行，但对普通用户来说，只要官方配置入口里没有，它就等同于“不可配置”。

## 排查方向

一开始我先排除了几个常见方向：

- 插件文件是否还在。
- 插件是否能被 OpenClaw 加载。
- 插件是否声明了 Channel 能力。
- 配置文件里是否还有旧的 `channels.<id>` 配置。

这些检查之后，问题逐渐收敛到一个更具体的点：OpenClaw 当时没有可靠地把 npm 安装的第三方 Channel metadata 接进 configure 的发现列表。

也就是说，插件 runtime 能加载是一回事，能不能进入官方配置入口是另一回事。

## 三个处理方向

和 ChatGPT 沟通排查后，我把可选处理方式收敛成了三个方向。

第一个方向是修改插件文件夹下的 JSON 文件，包括 `package.json` 里的 OpenClaw metadata，以及 `openclaw.plugin.json` 里的 Channel 配置声明。这个方向是插件开发者最自然会先尝试的，因为它仍然限制在插件包自己的范围内，没有越界修改用户配置。

但实际验证后，这个方向没有解决 configure 不显示的问题。原因是当时的问题不只是插件声明不完整，而是 OpenClaw 的官方 configure 发现链路没有稳定消费 npm-installed plugin 的 Channel metadata。插件文件夹里声明得更完整，不等于官方配置入口一定会把它列出来。

第二个方向是增加一个本地 catalog 文件，让 OpenClaw 的 Channel 发现流程能看到这个插件。这个办法能让问题绕过去，也说明 configure 的发现逻辑更依赖 catalog/安装记录，而不是单纯读取 npm 包本身。

但 catalog 文件不在第三方插件的标准安装流程里。作为本机临时修复可以接受，作为插件对外分发方案就不合适。插件不应该在安装或运行时主动写用户的 OpenClaw catalog，也不应该要求普通用户理解 catalog 文件该放哪里、该写什么字段。

第三个方向是使用 ClawHub 安装插件。这个方向最接近 OpenClaw 之后希望建立的插件分发路径，因为 ClawHub/catalog 可以为 configure 提供更完整的发现信息。

但这里也有一个体验问题：ClawHub 并不是 `openclaw plugins install` 的默认路径。用户如果写：

```bash
openclaw plugins install liangzimixin
```

它走的是 npm 路径。要走 ClawHub，必须明确写成：

```bash
openclaw plugins install clawhub:liangzimixin
```

这就造成了一个割裂：默认安装路径能装到插件，但官方 configure 不一定能配置；ClawHub 路径能进入发现流程，但用户必须知道要加 `clawhub:` 前缀。

这三个方向都说明同一个问题：插件作者不应该靠修改插件文件夹之外的用户配置来维持兼容。直接改 `openclaw.json` 虽然可能短期有效，但它要求用户知道内部配置结构、账户字段、secret 写入位置和 Channel schema。对插件作者来说，这不是一个合规的产品路径，未来也可能被 OpenClaw 出于安全治理进一步限制。

## 为什么提 issue

基于上面的排查，我最后把问题整理成了 issue。核心诉求不是让官方支持某一个具体插件，而是让官方配置入口消费 npm-installed plugin 已经声明的 Channel metadata。

当时还把 DingTalk 作为另一个例子加进去。这样问题就不是 `liangzimixin` 一个小插件的个例，而是更通用的第三方 Channel 分发问题：

- 插件可以通过 npm 安装。
- 插件可以被 OpenClaw 加载。
- 插件声明了 Channel 能力。
- 但 `openclaw configure --section channels` 无法配置它。

这个状态很尴尬，因为它不是“安装失败”，也不是“运行失败”，而是卡在官方产品路径中间：插件存在，但用户没有合规入口配置它。

## 5.12 的修复

后面官方确认了这个问题。修复先进入 main，之后 2026.5.12 正式版修正了第三方 Channel 的发现问题。

这也是我现在对插件兼容性的判断：不要把 2026.4.27 到 2026.5.7 当作推荐区间。这个区间里，第三方 Channel 可能能运行，但 configure 发现链路不可靠。

更合理的说明是：

```text
推荐 OpenClaw 2026.5.12 或更高版本。
2026.4.27 到 2026.5.7 之间存在第三方 Channel configure 发现问题，不建议使用。
```

如果要兼容更老版本，也应该单独说明，而不是让最新版本插件继续笼统写 `>=2026.3.8`。

## 短期结论

这次问题暴露的不是单个插件兼容性，而是 OpenClaw 在插件安全性收紧过程中的一次 breaking update。

从平台角度看，收紧第三方插件和 Channel 的发现、安装、配置路径是有意义的。Channel 会处理消息、凭据、外部网络和用户会话，不应该永远靠隐式扫描和手工配置维持。把插件 metadata、安装来源、catalog、configure 流程统一起来，长期看有利于安全和可治理。

但这类收紧如果没有清晰迁移路径，对第三方开发者非常不友好。插件能安装、能加载，却不能通过官方 configure 配置，这种半可用状态最难排查。用户会以为插件坏了，开发者也只能在插件 metadata、catalog、ClawHub、手动配置之间反复试。

短期处理上，我会把插件推荐版本提高到 OpenClaw 2026.5.12 以上，并在 README 里明确 2026.4.27 到 2026.5.7 的风险。长期看，第三方插件应该尽量走官方发现和配置链路，而不是让用户手动修改 OpenClaw 配置文件。
