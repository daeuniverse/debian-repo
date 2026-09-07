---
title: "疑難排解"
---

<div v-pre lang="zh-TW">

# 疑難排解

## `dae suspend` 後無法連網

請勿在 DHCP 設定中將 dae 設為 DNS。例如，可在 DHCP 設定中將 `223.5.5.5` 設為 DNS。

因為 dae 暫停後不會劫持任何 DNS 請求。

## PVE 相關

- [PVE 網卡硬體直通](https://github.com/daeuniverse/dae/issues/43)

## 繫結 WAN 後無法連網

### 排查本機 DNS 服務

若在 `dns` 區段使用 `adguardhome`、`mosdns`，請參閱 [外部 DNS](/zh-TW/dae/configuration/external-dns)。

### 排查防火牆

若繫結 WAN，請確認防火牆已停止，或防火牆允許標記 `0x8000000`。不必擔心此連接埠的安全性，因為此連接埠有自己的防火牆規則。

Linux 常見的防火牆：

```bash
ufw
firewalld
```

#### ufw

UFW 使用者可能需要額外步驟，以確保 繫結 LAN 可運作。

例如，在 `/etc/ufw/before*.rules` 新增下列內容：

```bash
# before.rules
-A ufw-before-input -m mark --mark 0x8000000 -j ACCEPT

# before6.rules
-A ufw6-before-input -m mark --mark 0x8000000 -j ACCEPT
```

#### firewalld

若使用 firewalld，很難加入 mark 支援。每次機器啟動及防火牆規則變更時，都必須執行下列命令：

此命令要求 firewalld 的 nftables 表允許外部修改。`NftablesTableOwner=yes` 時禁止外部修改，執行前請核對 [firewalld 設定](https://firewalld.org/documentation/man-pages/firewalld.conf.html)。

```bash
sudo nft 'insert rule inet firewalld filter_INPUT mark 0x8000000 accept'
```

### 排查 PPPoE

舊版 dae 不支援 PPPoE，請使用最新版本。

## 繫結 LAN，但其他機器的 DNS 異常

### 排查 dae 設定

請確認已繫結正確的 LAN 介面。

例如，若 WAN 與 LAN 使用相同的 `eth1` 介面，請在 `wan_interface: eth1` 中設定，也在 `lan_interface: eth1` 中設定。若要代理的 LAN 介面為 eth1 與 docker0，請都寫入 `lan_interface: eth1,docker0`。

### 排查 DNS

在 LAN 的另一台機器上驗證：

```bash
curl -i 1.1.1.1
curl -i google.com
```

若第一行有回應而第二行沒有，請檢查 dae 所在機器上的連接埠 `53` 是否被其他程式佔用。

```bash
netstat -ulpen|grep 53
# or
# lsof -i:53 -n
```

若被佔用，請停止該服務處理程序，或將其監聽連接埠從 53 改為其他連接埠。請勿忘記修改 `/etc/resolv.conf`，以使 DNS 可存取（例如內容為 `nameserver 223.5.5.5`，但請勿使用 `nameserver 127.0.0.1`）。

## 無法載入 eBPF 物件

> FATA[0022] load eBPF objects: field TproxyWanEgress: program tproxy_wan_egress: load program: argument list too long: 1617: (bf) r2 = r6: 1618: (85) call bpf_map_loo (truncated, 992 line(s) omitted)

若使用 `clang-13` 編譯 dae，可能遇到此問題。

可透過以下方法解決：

1. 方法 1：使用 `clang-15` 或更高版本編譯 dae，或直接從 [releases](https://github.com/daeuniverse/dae/releases) 下載 dae。
2. 方法 2：編譯時加入 CFLAGS `-D__UNROLL_ROUTE_LOOP`。但這會在 eBPF 載入階段增加記憶體用量（或 swap 空間）（約 180MB）。例如，使用 `make CGO_ENABLED=0 GOARCH=arm64 CFLAGS="-D__UNROLL_ROUTE_LOOP"` 將 dae 編譯為 ARM64。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/troubleshooting.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
