---
title: "内核参数"
---

<div v-pre lang="zh-CN">

# 内核参数

> **注意**
> 如果 `global.auto_config_kernel_parameter` 为 `true`，将自动配置参数。

如果你将 dae 设置为路由器或其他中间设备，并将其绑定到 LAN 接口，则需要调整一些 Linux 内核参数，以使一切正常工作。默认情况下，最新的 Linux 发行版禁用了 IP 转发。当需要搭建 Linux 路由器、网关、VPN 服务器，或只是普通拨号服务器时，需要启用转发。此外，为了保持网关位置并维持正确的下游路由表，应禁用 `send-redirects`。请执行以下操作来调整 Linux 内核参数：

对于每个要代理的 LAN 接口：

请将 `docker0` 修改为你的 LAN 接口。

::: code-group

```shell [sudo]
export lan_ifname=docker0

sudo tee /etc/sysctl.d/60-dae-lan-$lan_ifname.conf << EOF
net.ipv4.conf.$lan_ifname.forwarding = 1
net.ipv6.conf.$lan_ifname.forwarding = 1
net.ipv4.conf.$lan_ifname.send_redirects = 0
EOF
sudo sysctl --system
```

```shell [root]
export lan_ifname=docker0

tee /etc/sysctl.d/60-dae-lan-$lan_ifname.conf << EOF
net.ipv4.conf.$lan_ifname.forwarding = 1
net.ipv6.conf.$lan_ifname.forwarding = 1
net.ipv4.conf.$lan_ifname.send_redirects = 0
EOF
sysctl --system
```

:::

还建议启用 IPv4 和 IPv6 转发，以避免异常情况：

::: code-group

```shell [sudo]
sudo tee /etc/sysctl.d/60-ip-forward.conf << EOF
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
EOF
sudo sysctl --system
```

```shell [root]
tee /etc/sysctl.d/60-ip-forward.conf << EOF
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
EOF
sysctl --system
```

:::

对于接受 RA 的 WAN 接口：

请将 `eth0` 修改为你的 WAN 接口。

::: code-group

```shell [sudo]
export wan_ifname=eth0

if [ "$(cat /proc/sys/net/ipv6/conf/$wan_ifname/accept_ra)" == "1" ]; then
    sudo tee /etc/sysctl.d/60-dae-wan-$wan_ifname.conf << EOF
net.ipv6.conf.$wan_ifname.accept_ra = 2
EOF
    sudo sysctl --system
fi
```

```shell [root]
export wan_ifname=eth0

if [ "$(cat /proc/sys/net/ipv6/conf/$wan_ifname/accept_ra)" == "1" ]; then
    tee /etc/sysctl.d/60-dae-wan-$wan_ifname.conf << EOF
net.ipv6.conf.$wan_ifname.accept_ra = 2
EOF
    sysctl --system
fi
```

:::

如果 `accept_ra` 为 1，请将其设置为 2，因为 `net.ipv6.conf.all.forwarding = 1` 会抑制它。更多信息请参阅 <https://sysctl-explorer.net/net/ipv6/accept_ra/>。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/kernel-parameters.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
