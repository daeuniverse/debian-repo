# DaedNext <Badge type="warning" text="Experimental" />

DaedNext is daed in Rust: the daed web dashboard bundled with the dae core from [DaeNext](https://github.com/ksong008/DaeNext) into one `daed` binary. DaeNext rewrites the daemon, routing, DNS, configuration parsing and the outbound protocol stack in Rust and loads the eBPF datapath natively through Aya. The dashboard keeps daed's MIT license; the core is released under AGPL-3.0-only.

::: warning Not yet released
Neither repository has published a release. Interfaces, configuration and packaging change without notice, and it is not recommended for production.
:::

This site carries no DaedNext installation or configuration guide. For the build, the feature scope and current progress, follow upstream:

[DaedNext project page](https://github.com/ksong008/DaedNext)
