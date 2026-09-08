---
title: "Proxy protocols"
---

<div v-pre lang="en-US">

# Proxy protocols

> **Note**: dae currently supports the following proxy protocols

| Protocol | Support details | URI format |
| --- | --- | --- |
| HTTP(S), naiveproxy | — | [HTTP(S)](#http-uri) |
| Socks | **Version**: Socks4 / Socks4a / Socks5 | [Socks](#socks-uri) |
| VMess / VLESS | **VMess**: AEAD, alterID=0<br>**Transport**: TCP / WS / gRPC / Meek / HTTPUpgrade<br>**TLS**: Reality | [v2rayN](https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2))<br>[DuckSoft](https://github.com/XTLS/Xray-core/discussions/716) |
| Shadowsocks | **Ciphers**: AEAD / Stream Ciphers<br>**Plugins**: simple-obfs / shadow-tls (SIP003)<br>[Plugin notes](#shadowsocks-plugins) | [SIP002](https://shadowsocks.org/doc/sip002.html)<br>[SIP008](https://shadowsocks.org/doc/sip008.html) |
| ShadowsocksR | — | — |
| Trojan | Trojan-gfw / Trojan-go | [trojan/trojan-go](https://p4gefau1t.github.io/trojan-go/developer/url/) |
| Tuic | **Version**: v5 | [Tuic](https://github.com/daeuniverse/dae/discussions/182) |
| Juicity | — | [Juicity](https://github.com/juicity/juicity?tab=readme-ov-file#link-format) |
| Hysteria2 | — | [Hysteria2](https://v2.hysteria.network/docs/developers/URI-Scheme) |
| AnyTLS | — | [AnyTLS](https://github.com/anytls/anytls-go/blob/main/docs/uri_scheme.md) |
| Proxy chain (flexible protocol) | — | [Proxy chain](https://github.com/daeuniverse/dae/discussions/236) |

All protocols listed above are supported. “—” means the source lists no further details or URI reference.

## URI examples

### HTTP(S) {#http-uri}

  ```
  https://[[user:]pass@]hostname:port/
  ```

### Socks {#socks-uri}

  ```
  socks4://[[user:]pass@]hostname:port/
  socks5://[[user:]pass@]hostname:port/
  ```

## ShadowTLS and Shadowsocks plugins {#shadowsocks-plugins}

The source leaves v2ray-plugin unchecked while checking its Websocket (+TLS) sub-item. These two statuses are preserved here.

ShadowTLS v3 links can also be used directly with `shadowtls://`.
For nodes that require a browser-like TLS fingerprint, set `global.tls_implementation: utls`
and keep `global.utls_imitate` at the default `chrome_auto`, or append
`tlsImplementation=utls&utlsImitate=chrome` in the link query.
If the provider expects no custom SNI, omit `sni` or keep it explicitly empty.

## External proxy programs

For other requirements, one way to expand protocol support is by using external proxy programs. Below is an example of using the external naiveproxy.

Although dae and other proxy programs support the HTTPS protocol, using them does not utilize the chromium networking stack, which weakens the camouflage effect of naiveproxy. Therefore, using an external naiveproxy program is recommended.

1. Start naiveproxy:

   The example uses naiveproxy to open an HTTP listening port. Note that HTTP proxy does not support proxying UDP traffic, so if you are using an external proxy program, it is advisable to prioritize using the socks5 port.

   ```bash
   naiveproxy --listen=http://127.0.0.1:1090 --proxy=https://yourlink
   ```

2. In the section of dae's configuration related to nodes, add the following line: `http://127.0.0.1:1090`, and remember to use this node in the group you are using.

3. If you have bound the WAN interface, meaning you have filled in the `global.wan_interface` field, make sure to add the following line near the top in the routing section to prevent traffic from flowing back to dae after passing through naiveproxy, causing a loop:

   ```shell
   pname(naiveproxy) -> must_direct
   ```

   Here, `pname` refers to the process name. You can determine the process name of naiveproxy by examining the command used to start it, running the `ps -ef` command at runtime, or observing the dae logs. The meaning of `must_direct` is to allow all traffic, including DNS queries, to pass through directly without redirecting to dae.

   Users who only bind the LAN interface do not need to perform this step.

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/proxy-protocols.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
