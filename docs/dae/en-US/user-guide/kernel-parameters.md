---
title: "Kernel parameters"
---

<div v-pre lang="en-US">

# Kernel parameters

> **Note**
> Parameters will be automatically configured if `global.auto_config_kernel_parameter` is `true`.

If you set up dae as a router or other intermediate device and bind it to LAN interfaces, you need to adjust some Linux kernel parameters to make everything work fine. By default, the latest Linux distributions have IP Forwarding `disabled`. In the case where we need to up a Linux router/gateway or a VPN server or simply a plain dial-in server, then we need to enable forwarding. Moreover, in order to keep our gateway position and keep correct downstream route table, we should disable `send-redirects`. Do the followings to adjust Linux kernel parameters:

For every LAN interfaces you want to proxy:

Please modify `docker0` to your LAN interface.

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

It is also recommended to enable IPv4 and IPv6 forward to avoid weird situations:

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

For your WAN interfaces that accept RA:

Please modify `eth0` to your WAN interface.

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

Setting accept_ra to 2 if it is 1 because `net.ipv6.conf.all.forwarding = 1` will suppress it. See <https://sysctl-explorer.net/net/ipv6/accept_ra/> for more information.

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/kernel-parameters.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
