---
title: "外部 DNS"
---

<div v-pre lang="zh-CN">

# 外部 DNS

> **注意**
> DNS 请求应由 dae 转发，才能按域名分流。本指南说明如何将 dae 配置为使用外部 DNS。

如果使用 AdGuardHome 等外部 DNS，可参考以下指南。

## 本机上的外部 DNS

如果在本机部署外部 DNS，可能希望代理对 `dns.google` 的 DNS 查询。例如，若 AdGuardHome 有以下配置：

```
Listen on: the same machine with dae, port 53.

China mainland: udp://223.5.5.5:53
Others: https://dns.google/dns-query
```

应按以下方式配置 dae：

1. 在`global`部分补全 `wan_interface`，以代理 AdguardHome 的请求。

2. 将以下规则插入`routing`部分的第一行，以避免环路。

   ```python
   pname(AdGuardHome) && l4proto(udp) && dport(53) -> must_direct
   ```

   并确保路由规则会代理域名 `dns.google`。

3. 在`dns`部分添加 upstream 和 request。

   ```
   dns {
     upstream {
       adguardhome: 'udp://127.0.0.1:53'
     }
     routing {
       request {
         fallback: adguardhome
       }
     }
   }
   ```

4. 绑定 WAN 时，确保 `/etc/resolv.conf` 不直接使用本机外部 DNS。例如，可设置为 `nameserver 119.29.29.29`；数据包经由网卡发送时，DNS 流量会被 dae 劫持。

   重启后，dnsmasq 等 DNS 服务可能还原 `/etc/resolv.conf`。遇到此情况，原文建议卸载这些服务，或将该文件设置为不可修改：

   ::: code-group

   ```shell [sudo]
   sudo chattr +i /etc/resolv.conf
   ```

   ```shell [root]
   chattr +i /etc/resolv.conf
   ```

   :::

5. 如果绑定到 LAN，请确保 DHCP 服务器将 dae 作为 DNS 服务器下发（DNS 请求应由 dae 转发，才能按域名分流）。

6. 如果仍有 DNS 问题且没有 warn/error 日志，必须将外部 DNS（此处为 AdGuardHome）的监听端口从 53 改为非 53 端口。参见 [#31](https://github.com/daeuniverse/dae/issues/31#issuecomment-1467358364)。

7. 如果使用 PVE，参见 [#37](https://github.com/daeuniverse/dae/discussions/37)。

## LAN 中另一台机器上的外部 DNS

如果在 LAN 中另一台机器上部署外部 DNS，可能希望代理对 `dns.google` 的 DNS 查询。例如，若 `AdguardHome` 有以下配置：

```
Listen on: 192.168.30.3:53 (mac address: 8c:16:45:36:1c:5a)

China mainland: udp://223.5.5.5:53
Others: https://dns.google/dns-query
```

应按以下方式配置 dae：

1. 在`global`部分填写 `lan_interface`，以代理 AdguardHome 的请求。

2. 将以下规则插入`routing`部分的第一行，以避免环路。

   ```python
   sip(192.168.30.3) && l4proto(udp) && dport(53) -> must_direct
   # Or use MAC address if in the same link:
   # mac(8c:16:45:36:1c:5a) && l4proto(udp) && dport(53) -> must_direct
   ```

   并确保路由规则会代理域名 `dns.google`。

3. 在`dns`部分添加 upstream 和 request。

   ```
   dns {
     upstream {
       adguardhome: 'udp://192.168.30.3:53'
     }
     routing {
       request {
         fallback: adguardhome
       }
     }
   }
   ```

4. 如果绑定到 LAN，请确保 DHCP 服务器将 dae 作为 DNS 服务器下发（DNS 请求应由 dae 转发，才能按域名分流）。

5. 如果仍有 DNS 问题且没有 warn/error 日志，必须将外部 DNS（此处为 AdGuardHome）的监听端口从 53 改为非 53 端口。参见 [#31](https://github.com/daeuniverse/dae/issues/31#issuecomment-1467358364)。

6. 如果使用 PVE，参见 [#37](https://github.com/daeuniverse/dae/discussions/37)。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/configuration/external-dns.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
