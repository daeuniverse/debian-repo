---
title: "拆分設定檔"
---

<div v-pre lang="zh-TW">

# 拆分設定檔

有時可能想將設定檔拆分為多個檔案。以下情況可能很有用：

1. 想透過 `sed` 等工具修改設定檔來切換節點。
2. 複製他人的設定檔，並想覆寫其中的某些部分。

## 範例

目錄結構：

```sh
# tree /etc/dae
/etc/dae
├── config.d
│  ├── dns.dae
│  ├── node.dae
│  └── route.dae
└── config.dae
```

設定檔：

關於 `include` 路徑的說明：

- 相對路徑（例如 `config.d/*.dae`）相對於*進入點*設定檔（傳遞給 `dae -c ...` 的檔案）所在目錄解析，而不是相對於目前的工作目錄。
- 絕對路徑（例如 `/etc/dae/config.d/*.dae`）會原樣使用。
- 基於安全理由，dae 僅允許包含進入點設定目錄下的檔案。

以下四個檔案配合使用。標籤用於查看不同檔案，不代表任選其一。

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

然後透過以下命令執行 `dae`：

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

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/configuration/separate-config.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
