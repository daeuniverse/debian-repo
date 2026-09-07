<div v-pre lang="zh-CN">

<!-- quick-start-requirements:start -->
# Linux 内核要求

## 1. 检查内核版本

使用 `uname -r` 检查计算机上的内核版本。

```shell
uname -r
```

> **注意**
> 如果内核版本为 `< 5.17`，请按照 [**升级指南**](/zh-CN/dae/user-guide/kernel-upgrade) 将内核升级到最低要求版本。

## 2. 按使用场景确认要求

| 使用方式 | 最低版本 | 用途与影响范围 |
| --- | --- | --- |
| 绑定到 WAN | `5.17` | 为本地程序提供网络服务。<br>仅绑定 WAN 时，不影响从其他接口进入的流量。 |
| 绑定到 LAN | `5.17` | 作为中间设备为 LAN 提供网络服务。<br>仅绑定 LAN 时，只处理来自 LAN 的流量，不影响本地程序。 |
| `dae trace` | `5.15` | 排查网络连通性问题。 |

## 3. 检查内核配置

通常，主流桌面发行版会启用这些项目。但为了减小内核体积，OpenWRT、Armbian 等嵌入式设备发行版默认会关闭某些项目。

使用类似以下命令检查：

此命令只列出配置值。请将输出与下方所需配置项逐项对照；有输出不代表全部符合要求。

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

### 所需配置项与取值

dae 需要：

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

::: details 查看完整内核配置

使用以下命令显示计算机上的内核配置项目。

```shell
zcat /proc/config.gz || cat /boot/{config,config-$(uname -r)}
```

:::

### 特定发行版说明

> **注意**：`Armbian` 用户可按照 [**升级指南**](/zh-CN/dae/user-guide/kernel-upgrade) 升级内核，以满足内核配置要求。

> `Arch Linux ARM` 用户可使用满足 dae 内核配置要求的 [linux-aarch64-7ji](https://github.com/7Ji-PKGBUILDs/linux-aarch64-7ji)。
<!-- quick-start-requirements:end -->

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
