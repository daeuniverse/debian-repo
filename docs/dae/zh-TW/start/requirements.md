<div v-pre lang="zh-TW">

<!-- quick-start-requirements:start -->
# Linux 核心需求

## 1. 檢查核心版本

使用 `uname -r` 檢查機器上的核心版本。

```shell
uname -r
```

> **注意**
> 若核心版本為 `< 5.17`，請依照[**升級指南**](/zh-TW/dae/user-guide/kernel-upgrade)將核心升級至最低需求版本。

## 2. 按使用情境確認需求

| 使用方式 | 最低版本 | 用途與影響範圍 |
| --- | --- | --- |
| 繫結 WAN | `5.17` | 為本機程式提供網路服務。<br>僅繫結 WAN 時，不影響從其他介面進入的流量。 |
| 繫結 LAN | `5.17` | 作為中介裝置為 LAN 提供網路服務。<br>僅繫結 LAN 時，只處理來自 LAN 的流量，不影響本機程式。 |
| `dae trace` | `5.15` | 排查網路連線問題。 |

## 3. 檢查核心設定

主流桌面發行版通常已啟用這些項目。但為縮減核心大小，OpenWRT、Armbian 等嵌入式裝置發行版預設會停用部分項目。

使用下列命令檢查：

此命令只列出設定值。請將輸出與下方所需設定項目逐項對照；有輸出不代表全部符合需求。

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

### 所需設定項目與數值

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

::: details 查看完整核心設定

使用下列命令顯示機器上的核心設定項目。

```shell
zcat /proc/config.gz || cat /boot/{config,config-$(uname -r)}
```

:::

### 特定發行版說明

> **注意**：`Armbian` 使用者可依照[**升級指南**](/zh-TW/dae/user-guide/kernel-upgrade)升級核心，以符合核心設定需求。

> `Arch Linux ARM` 使用者可使用符合 dae 核心設定需求的 [linux-aarch64-7ji](https://github.com/7Ji-PKGBUILDs/linux-aarch64-7ji)。
<!-- quick-start-requirements:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
