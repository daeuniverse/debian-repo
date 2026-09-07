# honk <Badge type="warning" text="实验性" />

honk 是 Rust 编写的 Linux 透明代理引擎，内核路径沿用 dae 的 eBPF 数据面与 `dae0`／`daens` 模型，用户态的出站分组、多协议拨号与 Clash 兼容 API 借鉴 sing-box。它不是任何一方的移植，而是把两者的设计合到一个进程里，以 GPL-3.0 发布。

::: warning 尚未稳定
上游将 honk 标注为 experimental，版本仍处于 `v0.0.1` 预发布阶段，接口、配置与功能随时变动，不建议用于生产环境。
:::

本站不提供 honk 的安装与配置说明。功能范围、配置格式与当前进度以上游为准：

[honk 项目主页](https://github.com/daeuniverse/honk)
