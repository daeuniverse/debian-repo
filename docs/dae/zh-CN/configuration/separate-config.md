---
title: "拆分配置文件"
---

<div v-pre lang="zh-CN">

# 拆分配置文件

有时可能想将配置文件拆分为多个文件。以下情况可能很有用：

1. 想通过 `sed` 等工具修改配置文件来切换节点。
2. 复制他人的配置文件，并想覆盖其中的某些部分。

## 示例

目录结构：

```sh
# tree /etc/dae
/etc/dae
├── config.d
│  ├── dns.dae
│  ├── node.dae
│  └── route.dae
└── config.dae
```

配置文件：

关于 `include` 路径的说明：

- 相对路径（例如 `config.d/*.dae`）相对于*入口*配置文件（传递给 `dae -c ...` 的文件）所在目录解析，而不是相对于当前工作目录。
- 绝对路径（例如 `/etc/dae/config.d/*.dae`）按原样使用。
- 出于安全原因，dae 仅允许包含入口配置目录下的文件。

以下四个文件配合使用。标签用于查看不同文件，不代表任选其一。

::: code-group

```jsonc [config.dae]
# config.dae

# load all dae files placed in ./config.d/
include {
    # Relative path example:
    config.d/*.dae

    # Absolute path example:
    /etc/dae/config.d/*.dae
}
global {
    tproxy_port: 12345

    log_level: warn

    tcp_check_url: 'http://cp.cloudflare.com'
    udp_check_dns: 'dns.google:53'
    check_interval: 600s
    check_tolerance: 50ms

    #lan_interface: eth0
    wan_interface: eth0
    allow_insecure: false

    dial_mode: domain
    disable_waiting_network: false
    auto_config_kernel_parameter: true
    sniffing_timeout: 30ms
}
```

```jsonc [dns.dae]
# dns.dae
dns {
    upstream {
        alidns: 'udp://dns.alidns.com:53'
        googledns: 'tcp+udp://dns.google:53'
    }

    routing {
        request {
            qname(geosite:category-ads) -> reject
            qname(geosite:category-ads-all) -> reject
            fallback: alidns
        }
        response {
            upstream(googledns) -> accept
            !qname(geosite:cn) && ip(geoip:private) -> googledns
            fallback: accept
        }
    }
}
```

```jsonc [node.dae]
# node.dae
node {
    node1: 'xxx'
    node2: 'xxx'
}

subscription {
    my_sub: 'https://www.example.com/subscription/link'
}

group {
    my_group {
        filter: subtag(my_sub) && !name(keyword: 'ExpireAt:')
        policy: min_moving_avg
    }

    local_group {
        filter: name(node1, node2)
        policy: fixed(0)
    }
}
```

```jsonc [route.dae]
# route.dae
routing {
    pname(NetworkManager) -> direct
    dip(224.0.0.0/3, 'ff00::/8') -> direct
    dip(geoip:private) -> direct

    dip(1.14.5.14) -> direct

    domain(geosite:openai) -> local_group
    dip(geoip:cn) -> direct
    domain(geosite:cn) -> direct
    domain(geosite:category-scholar-cn) -> direct
    domain(geosite:geolocation-cn) -> direct


    fallback: my_group
}
```

:::

然后通过以下命令运行 `dae`：

::: code-group

```shell [sudo]
sudo dae run -c /etc/dae/config.dae
```

```shell [root]
dae run -c /etc/dae/config.dae
```

:::

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/configuration/separate-config.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
