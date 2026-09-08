---
title: "核心參數"
---

<div v-pre lang="zh-TW">

# 核心參數

> **注意**
> 如果 `global.auto_config_kernel_parameter` 為 `true`，將自動設定參數。

如果你將 dae 設定為路由器或其他中介裝置，並將其繫結至 LAN 介面，則需要調整一些 Linux 核心參數，才能讓所有功能正常運作。預設情況下，最新的 Linux 發行版停用了 IP 轉送。當需要架設 Linux 路由器、閘道、VPN 伺服器，或只是一般撥號伺服器時，需要啟用轉送。此外，為了維持閘道位置並保持正確的下游路由表，應停用 `send-redirects`。請執行下列操作來調整 Linux 核心參數：

對於每個要代理的 LAN 介面：

請將 `docker0` 修改為你的 LAN 介面。

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

亦建議啟用 IPv4 和 IPv6 轉送，以避免異常情況：

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

對於接受 RA 的 WAN 介面：

請將 `eth0` 修改為你的 WAN 介面。

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

如果 `accept_ra` 為 1，請將其設定為 2，因為 `net.ipv6.conf.all.forwarding = 1` 會抑制它。更多資訊請參閱 <https://sysctl-explorer.net/net/ipv6/accept_ra/>。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/kernel-parameters.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
