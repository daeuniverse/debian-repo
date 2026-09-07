---
title: "Overview"
---

<div v-pre lang="en-US">

# Overview

Start with the host requirements, then install and configure dae. This guide connects the installation, service management, configuration and troubleshooting documentation.

## First deployment

| Step | What to do | Guide |
| --- | --- | --- |
| 1 | Check the kernel version and required options | [Kernel requirements](/dae/start/requirements) |
| 2 | Choose the installation method for your system | [Installation](/dae/installation/) |
| 3 | Set network interfaces and subscriptions or nodes | [Minimal configuration](/dae/start/minimal-configuration) |
| 4 | Start dae and configure boot enablement | [Service management](/dae/start/service-management) |

For a PPPoE interface, also read [PPPoE interface setup](/dae/start/pppoe).

## Configure traffic handling

| Need | Documentation |
| --- | --- |
| DNS servers and DNS routing | [DNS configuration](/dae/configuration/dns) · [External DNS](/dae/configuration/external-dns) |
| Domain, IP and game routing | [Routing rules](/dae/configuration/routing) · [Game routing](/dae/configuration/gaming-oriented-routing) |
| Organize configuration files | [Split configuration files](/dae/configuration/separate-config) |

## Operate and troubleshoot

- [Service management](/dae/start/service-management)：Start, enable, reload and restart with systemd or OpenRC.
- [Reload and suspend](/dae/user-guide/reload-and-suspend)：Reload configuration or temporarily suspend traffic handling.
- [Troubleshooting](/dae/troubleshooting)：Investigate network, DNS, firewall and eBPF issues.

## Understand and contribute

[How dae works](/dae/how-it-works) · [Proxy protocols](/dae/proxy-protocols) · [Build from source](/dae/user-guide/build-by-yourself) · [Contribute](/dae/development/contribute)

To install a downloaded binary or use the installer, see [Manual installation](/dae/installation/manual-installation).

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
