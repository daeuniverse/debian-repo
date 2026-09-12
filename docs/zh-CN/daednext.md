# DaedNext <Badge type="warning" text="实验性" />

DaedNext 是 daed 的 Rust 版本，把 daed 的 Web 面板与 [DaeNext](https://github.com/ksong008/DaeNext) 的 dae 核心打包成一个 `daed` 二进制。DaeNext 用 Rust 重写了守护进程、路由、DNS、配置解析与出站协议栈，并通过 Aya 原生加载 eBPF 数据面；面板沿用 daed 的 MIT 许可证，核心以 AGPL-3.0-only 发布。

::: warning 尚未发布
两个仓库都还没有发布版本，接口、配置与打包方式随时变动，不建议用于生产环境。
:::

本站不提供 DaedNext 的安装与配置说明。构建方式、功能范围与当前进度以上游为准：

[DaedNext 项目主页](https://github.com/ksong008/DaedNext)
