---
title: "代理协议"
---

<div v-pre lang="zh-CN">

# 代理协议

> **注意**：dae 当前支持以下代理协议

| 协议 | 支持细节 | URI 格式 |
| --- | --- | --- |
| HTTP(S)、naiveproxy | — | [HTTP(S)](#http-uri) |
| Socks | **版本**: Socks4 / Socks4a / Socks5 | [Socks](#socks-uri) |
| VMess / VLESS | **VMess**: AEAD, alterID=0<br>**传输**: TCP / WS / gRPC / Meek / HTTPUpgrade<br>**TLS**: Reality | [v2rayN](https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2))<br>[DuckSoft](https://github.com/XTLS/Xray-core/discussions/716) |
| Shadowsocks | **加密**: AEAD / Stream Ciphers<br>**插件**: simple-obfs / shadow-tls (SIP003)<br>[插件说明](#shadowsocks-plugins) | [SIP002](https://shadowsocks.org/doc/sip002.html)<br>[SIP008](https://shadowsocks.org/doc/sip008.html) |
| ShadowsocksR | — | — |
| Trojan | Trojan-gfw / Trojan-go | [trojan/trojan-go](https://p4gefau1t.github.io/trojan-go/developer/url/) |
| Tuic | **版本**: v5 | [Tuic](https://github.com/daeuniverse/dae/discussions/182) |
| Juicity | — | [Juicity](https://github.com/juicity/juicity?tab=readme-ov-file#link-format) |
| Hysteria2 | — | [Hysteria2](https://v2.hysteria.network/docs/developers/URI-Scheme) |
| AnyTLS | — | [AnyTLS](https://github.com/anytls/anytls-go/blob/main/docs/uri_scheme.md) |
| 代理链（灵活协议） | — | [Proxy chain](https://github.com/daeuniverse/dae/discussions/236) |

表中协议均已支持。“—”表示原文未列出细分信息或 URI 参考链接。

## URI 示例

### HTTP(S) {#http-uri}

  ```
  https://[[user:]pass@]hostname:port/
  ```

### Socks {#socks-uri}

  ```
  socks4://[[user:]pass@]hostname:port/
  socks5://[[user:]pass@]hostname:port/
  ```

## ShadowTLS 与 Shadowsocks 插件 {#shadowsocks-plugins}

原文未勾选 v2ray-plugin，但勾选了其 Websocket（+TLS）子项；此处保留这两个状态。

ShadowTLS v3 链接也可直接与 `shadowtls://` 一起使用。
对于需要浏览器式 TLS 指纹的节点，请设置 `global.tls_implementation: utls`，并保留 `global.utls_imitate` 的默认值 `chrome_auto`，或在链接查询中附加 `tlsImplementation=utls&utlsImitate=chrome`。
如果提供商要求不使用自定义 SNI，请省略 `sni`，或明确保持为空。

## 外部代理程序

对于其他需求，可通过使用外部代理程序扩展协议支持。以下是使用外部 naiveproxy 的示例。

虽然 dae 和其他代理程序支持 HTTPS 协议，但使用它们不会使用 chromium 网络栈，因而会削弱 naiveproxy 的伪装效果。因此建议使用外部 naiveproxy 程序。

1. 启动 naiveproxy：

   本示例使用 naiveproxy 开启 HTTP 监听端口。请注意，HTTP 代理不支持代理 UDP 流量；因此，若使用外部代理程序，建议优先使用 socks5 端口。

   ```bash
   naiveproxy --listen=http://127.0.0.1:1090 --proxy=https://yourlink
   ```

2. 在 dae 配置中与节点相关的部分添加以下行：`http://127.0.0.1:1090`，并记得在所用组中使用此节点。

3. 若已绑定 WAN 接口，即填写了 `global.wan_interface` 字段，请在 routing 部分顶部附近添加以下行，以防流量经 naiveproxy 后回流到 dae 而造成循环：

   ```shell
   pname(naiveproxy) -> must_direct
   ```

   此处 `pname` 指进程名。可通过查看启动命令、运行时执行 `ps -ef` 命令，或查看 dae 日志确定 naiveproxy 的进程名。`must_direct` 表示允许包括 DNS 查询在内的全部流量直接通过，不重定向至 dae。

   仅绑定 LAN 接口的用户无需执行此步骤。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/proxy-protocols.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
