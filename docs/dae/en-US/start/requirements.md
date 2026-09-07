<div v-pre lang="en-US">

<!-- quick-start-requirements:start -->
# Linux Kernel Requirement

## 1. Check the kernel version

Use `uname -r` to check the kernel version on your machine.

```shell
uname -r
```

> **Note**
> If you find your kernel version is `< 5.17`, follow the [**Upgrade Guide**](/dae/user-guide/kernel-upgrade) to upgrade the kernel to the minimum required version.

## 2. Choose your use case

| Usage | Minimum | Purpose and scope |
| --- | --- | --- |
| Bind to WAN | `5.17` | Provide network service for local programs.<br>When bound only to WAN, dae does not affect traffic arriving from other interfaces. |
| Bind to LAN | `5.17` | Act as an intermediate device providing network service for LAN traffic.<br>When bound only to LAN, dae handles only traffic from LAN and does not affect local programs. |
| `dae trace` | `5.15` | Diagnose network connectivity issues. |

## 3. Check kernel configurations

Usually, mainstream desktop distributions have these items turned on. But in order to reduce kernel size, some items are turned off by default on embedded device distributions like OpenWRT, Armbian, etc.

Check them using command like:

This command only lists configuration values. Compare the output with the required values below; output alone does not mean all requirements are met.

::: code-group

```shell [Bash / Zsh]
(zcat /proc/config.gz || cat /boot/config "/boot/config-$(uname -r)") |
  grep -E \
    -e 'CONFIG_(DEBUG_INFO|DEBUG_INFO_BTF|KPROBES|KPROBE_EVENTS)=' \
    -e 'CONFIG_(BPF|BPF_SYSCALL|BPF_JIT|BPF_STREAM_PARSER|BPF_EVENTS)=' \
    -e 'CONFIG_(NET_CLS_ACT|NET_SCH_INGRESS|NET_INGRESS|NET_EGRESS)=' \
    -e 'CONFIG_(NET_CLS_BPF|CGROUPS)=' \
    -e '# CONFIG_DEBUG_INFO_REDUCED is not set'
```

```fish [fish]
begin
  zcat /proc/config.gz || cat /boot/config "/boot/config-"(uname -r)
end | grep -E \
  -e 'CONFIG_(DEBUG_INFO|DEBUG_INFO_BTF|KPROBES|KPROBE_EVENTS)=' \
  -e 'CONFIG_(BPF|BPF_SYSCALL|BPF_JIT|BPF_STREAM_PARSER|BPF_EVENTS)=' \
  -e 'CONFIG_(NET_CLS_ACT|NET_SCH_INGRESS|NET_INGRESS|NET_EGRESS)=' \
  -e 'CONFIG_(NET_CLS_BPF|CGROUPS)=' \
  -e '# CONFIG_DEBUG_INFO_REDUCED is not set'
```

:::

### Required configuration values

dae needs:

```
CONFIG_BPF=y
CONFIG_BPF_SYSCALL=y
CONFIG_BPF_JIT=y
CONFIG_CGROUPS=y
CONFIG_KPROBES=y
CONFIG_NET_INGRESS=y
CONFIG_NET_EGRESS=y
CONFIG_NET_SCH_INGRESS=m
CONFIG_NET_CLS_BPF=m
CONFIG_NET_CLS_ACT=y
CONFIG_BPF_STREAM_PARSER=y
CONFIG_DEBUG_INFO=y
# CONFIG_DEBUG_INFO_REDUCED is not set
CONFIG_DEBUG_INFO_BTF=y
CONFIG_KPROBE_EVENTS=y
CONFIG_BPF_EVENTS=y
```

::: details Show the full kernel configuration

Use following command to show kernel configuration items on your machine.

```shell
zcat /proc/config.gz || cat /boot/{config,config-$(uname -r)}
```

:::

### Distribution-specific notes

> **Note**: `Armbian` users can follow the [**Upgrade Guide**](/dae/user-guide/kernel-upgrade) to upgrade the kernel to meet the kernel configuration requirement.

> `Arch Linux ARM` users can use [linux-aarch64-7ji](https://github.com/7Ji-PKGBUILDs/linux-aarch64-7ji) which meets the kernel configuration requirement of dae.
<!-- quick-start-requirements:end -->

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
