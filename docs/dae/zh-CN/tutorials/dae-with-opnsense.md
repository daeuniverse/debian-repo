---
title: "OPNsense"
---

<div v-pre lang="zh-CN">

# OPNsense

本教程展示如何以旁路方式将 dae 与 OPNsense 配合使用。dae 安装在另一台 Linux 系统上，并通过以太网与 OPNsense 相连（物理连接、Linux 网桥或 SR-IOV）。

## 接口

应为 dae 与 OPN 之间的接口分配一个与 OPN LAN 不同子网的地址。若将此接口称为 wan_proxy，配置如下：

```
OPN LAN: 192.168.1.1/24
OPN wan_proxy: 192.168.2.2 Gateway Auto Detect
dae enp1s0: 192.168.2.1 Gateway 192.168.2.2
```

## 流量分流

1. 配置 GeoIP 列表

   > 在 `Firewall: Aliases: GeoIP Settings` 中添加；请参阅 [OPN 文档](https://docs.opnsense.org/manual/how-tos/maxmind_geo_ip.html)。

2. 配置 GeoIP 别名

   > 在 `Firewall: Aliases: Aliases` 中添加名为 proxyip 的别名，选择 GeoIP 类型，并在显示的 Asia 区域中选择 China（或自己的国家）。

3. 添加额外 IP 地址列表（可选）

   > 在 `Firewall: Aliases: Aliases` 中添加名为 proxyip_ex 的别名，选择 URL Table 类型。可添加他人维护的 IP 列表链接；文件内容为每行一个以 CIDR 表示的 IP 地址。

4. 配置保留地址别名

   > 在 `Firewall: Aliases: Aliases` 中添加名为 \_\_private_network 的别名，选择 Network 类型，添加所有保留地址（或仅添加网络使用的保留地址）；请参阅[保留 IP 地址](https://www.wikiwand.com/zh-hant/保留IP地址)。

5. 聚合上述别名

   > 在 `Firewall: Aliases: Aliases` 中添加名为 proxyroute 的别名，选择 Network group 类型，选择 proxyip、proxyip_ex（如有）、\_\_private_network 及系统内置的 \_\_lo0_network 别名，并将其聚合。

6. 添加网关

   > 在 `System: Gateways: Single` 中添加名为 proxy 的网关，选择 dae 之间的 wan_proxy 接口，IP 为 dae 的 IP。按照上面的接口示例，此处填入 192.168.2.1。优先级必须低于默认网关，例如默认网关设为 254 时，此处设为 255。

7. 流量分流规则

   > 在 `Firewall: Rules: Floating` 中添加规则，配置如下：

   | 项目 | 配置 |
   | - | - |
   | 操作 | Pass |
   | Quick | √ |
   | 接口 | LAN |
   | 方向 | in |
   | TCP/IP 版本 | IPv4 |
   | 协议 | TCP/UDP |
   | 目的地/反转 | √ |
   | 目的地 | proxyroute |
   | 网关 | proxy |

   > 此外，可通过 Source/Invert 排除 LAN 设备，使其流量不会经过 dae。

8. 允许 dae 流量进入 OPN

   > 在 `Firewall: Rules: wan_proxy` 中新建规则，保留所有默认值并保存。

9. OPN 自身的代理（可选）

   > 若需要让 OPN 自身的一些流量经过代理，例如使用 Google Drive 备份配置，建议在 `System: Routes: Configuration` 添加静态路由规则，将需代理 IP 段的网关设为 proxy。不建议在浮动规则中处理 WAN 流量，这可能造成循环。

## dae 相关配置

本节不涉及 dae 配置文件内容，只说明如何配置使 DNS 请求经过 dae，以及代理正常而直连不工作的常见问题解决方案。下述 `domain` 和 `ip` 模式，以及 dae 的 `dns` 和 `routing` 规则配置方式，请参阅 dae 文档。

要使用 dae 进行透明代理并使基于域名的流量分流规则正常工作，在 `domain` 和 `domain+` 模式下 DNS 请求需要经过 dae（注意 DNS 服务器未设为 dae 地址，dae 不监听 53 端口）。若 DNS 请求不经过 dae，则需要使用 dae 的 `domain++` 模式（根据嗅探到的域名再次匹配流量分流规则，性能不如 domain 模式）。若使用 `domain++` 模式，或不需要按域名分流而使用 `ip` 模式，可忽略以下配置。

1. DNS 转发配置
   > 在 `Services: Unbound DNS: Query Forwarding` 设置，将 DNS 请求转发至指定服务器，例如配置 OpenDNS 的 208.67.222.222。下一步需要设置静态路由规则，将此地址的网关设为 dae，因此不要使用上游下发的 DNS；这样在排查 DNS 问题时，可以正常使用 dig 或 nslookup 查询上游下发的 DNS 服务器进行测试。

2. 静态路由配置
   > 在 `System: Routes: Configuration` 添加静态路由规则，将网络设为 208.67.222.222/32，并将网关设为 proxy。

完成上述配置后，DNS 请求可经过 dae，并由 dae 劫持处理。这里设置的 DNS 服务器不是最终查询服务器。dae 会根据 dae 配置中的 dns 规则重写 DNS 查询的目标服务器，然后发送 DNS 查询请求。

应注意，Unbound 转发客户端 DNS 请求时会附加 EDNS 相关参数，这可能使上游服务器返回过大的 DNS 响应（偶尔大于 2000），导致 dae 处理 udp DNS 的缓冲区溢出（出于性能考虑，dae 未使用更大缓冲区；tcp DNS 不会溢出）。最终客户端无法获得 DNS 响应，甚至可能导致 dae 崩溃。要解决此问题，可切换到 Dnsmasq，或在 `Services: Unbound DNS: General` 禁用 EDNSSEC 支持，并写入以下 Unbound 配置；这可有效减小返回 DNS 响应的大小。

``` yaml
# saved as /usr/local/etc/unbound.opnsense.d/disableedns.conf
server:
    disable-edns-do: yes 
```

此外，由于 dae 不执行 snat，若代理正常而直连不工作[这里的直连指 dae `routing` 中的 direct，不是 OPN 未分流到 dae、直接从 WAN 端口出去的流量。例如，按上一节配置的流量分流规则，OPN 会将 steam 的流量分流至 dae，dae 在 `routing` 中配置了 domain(geosite:steam@cn) -> direct，但 steam 无法正常登录或下载]，请在安装 dae 的系统中配置 nat。

## 性能优化

将 OPN 与 dae 之间的 MTU 值从默认 1500 改为 9000（需修改两个接口和中间链路），可实现更低负载。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/tutorials/dae-with-opnsense.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
