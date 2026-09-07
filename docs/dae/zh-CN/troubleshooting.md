---
title: "故障排查"
---

<div v-pre lang="zh-CN">

# 故障排查

## `dae suspend` 后无网络

请勿在 DHCP 设置中将 dae 设为 DNS。例如，可在 DHCP 设置中将 `223.5.5.5` 设为 DNS。

因为 dae 暂停后不会劫持任何 DNS 请求。

## PVE 相关

- [PVE 网卡硬件直通](https://github.com/daeuniverse/dae/issues/43)

## 绑定 WAN 后无网络

### 排查本地 DNS 服务

如果在 `dns` 部分使用 `adguardhome`、`mosdns`，请参阅 [外部 DNS](/zh-CN/dae/configuration/external-dns)。

### 排查防火墙

如果绑定到 WAN，请确保防火墙已停止，或防火墙允许标记 `0x8000000`。无需担心此端口的安全性，因为此端口有自己的防火墙规则。

Linux 上常见的防火墙：

```bash
ufw
firewalld
```

#### ufw

UFW 用户可能需要额外步骤，以确保 绑定 LAN 正常工作。

例如，在 `/etc/ufw/before*.rules` 中添加以下内容：

```bash
# before.rules
-A ufw-before-input -m mark --mark 0x8000000 -j ACCEPT

# before6.rules
-A ufw6-before-input -m mark --mark 0x8000000 -j ACCEPT
```

#### firewalld

如果使用 firewalld，很难添加标记支持。每次计算机启动和防火墙规则变更时，都必须执行以下命令：

此命令要求 firewalld 的 nftables 表允许外部修改。`NftablesTableOwner=yes` 时禁止外部修改，执行前请核对 [firewalld 配置](https://firewalld.org/documentation/man-pages/firewalld.conf.html)。

```bash
sudo nft 'insert rule inet firewalld filter_INPUT mark 0x8000000 accept'
```

### 排查 PPPoE

旧版本 dae 不支持 PPPoE，请使用最新版本。

## 绑定 LAN 但其他计算机 DNS 异常

### 排查 dae 配置

请确保绑定到正确的 LAN 接口。

例如，若对 WAN 和 LAN 使用同一接口 eth1，请写为 `wan_interface: eth1`，并同时写入 `lan_interface: eth1`。若要代理的 LAN 接口是 eth1 和 docker0，请同时写为 `lan_interface: eth1,docker0`。

### 排查 DNS

在 LAN 中另一台计算机上验证：

```bash
curl -i 1.1.1.1
curl -i google.com
```

若第一行有响应而第二行没有，请检查 dae 所在计算机的端口 `53` 是否被其他程序占用。

```bash
netstat -ulpen|grep 53
# or
# lsof -i:53 -n
```

若被占用，请停止该服务进程或将其监听端口从 53 改为其他端口。别忘了修改 `/etc/resolv.conf` 以确保 DNS 可访问（例如写入 `nameserver 223.5.5.5`，但不要使用 `nameserver 127.0.0.1`）。

## 无法加载 eBPF 对象

> FATA[0022] load eBPF objects: field TproxyWanEgress: program tproxy_wan_egress: load program: argument list too long: 1617: (bf) r2 = r6: 1618: (85) call bpf_map_loo (truncated, 992 line(s) omitted)

若使用 `clang-13` 编译 dae，可能遇到此问题。

可通过以下方法解决：

1. 方法 1：使用 `clang-15` 或更高版本编译 dae，或直接从 [releases](https://github.com/daeuniverse/dae/releases) 下载 dae。
2. 方法 2：编译时添加 CFLAGS `-D__UNROLL_ROUTE_LOOP`。但这会在 eBPF 加载阶段增加内存占用（或交换空间占用）（约 180MB）。例如，使用 `make CGO_ENABLED=0 GOARCH=arm64 CFLAGS="-D__UNROLL_ROUTE_LOOP"` 为 ARM64 编译 dae。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/troubleshooting.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
