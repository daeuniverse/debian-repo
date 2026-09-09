# honk <Badge type="warning" text="Experimental" />

honk is a Linux transparent proxy engine written in Rust. Its kernel path follows dae's eBPF datapath and the `dae0`/`daens` model, while its outbound groups, multi-protocol dialers and Clash-compatible API follow sing-box. It is a line-for-line port of neither project, but combines both designs in one process, released under GPL-3.0-only.

::: warning Not yet stable
Upstream marks honk as experimental. It is still in the `v0.0.1-alpha` series, its interfaces, configuration and features change without notice, and it is not recommended for production.
:::

This site carries no honk installation or configuration guide. For the feature scope, the configuration format and current progress, follow upstream:

[honk project page](https://github.com/daeuniverse/honk)
