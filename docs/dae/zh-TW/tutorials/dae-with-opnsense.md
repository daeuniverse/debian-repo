---
title: "OPNsense"
---

<div v-pre lang="zh-TW">

# OPNsense

本教學說明如何以旁路方式搭配 OPNsense 使用 dae。dae 安裝於另一個 Linux 系統，並透過乙太網路連接至 OPNsense（實體連線、Linux bridge 或 SR-IOV）。

## 介面

應為 dae 與 OPN 之間的介面指派與 OPN LAN 不同子網路的位址。若將此介面稱為 wan_proxy，設定如下：

```
OPN LAN: 192.168.1.1/24
OPN wan_proxy: 192.168.2.2 Gateway Auto Detect
dae enp1s0: 192.168.2.1 Gateway 192.168.2.2
```

## 流量分流

1. 設定 GeoIP 清單

   > 在 `Firewall: Aliases: GeoIP Settings` 新增，請參閱 [OPN 文件](https://docs.opnsense.org/manual/how-tos/maxmind_geo_ip.html)。

2. 設定 GeoIP 別名

   > 在 `Firewall: Aliases: Aliases` 新增名為 proxyip 的別名，選取 GeoIP 類型，並在顯示的區域 Asia 中選取 China（或自己的國家）。

3. 新增額外 IP 位址清單（選用）

   > 在 `Firewall: Aliases: Aliases` 新增名為 proxyip_ex 的別名，選取 URL Table 類型；可加入他人維護之 IP 清單的連結，檔案內容為每行一個以 CIDR 表示的 IP 位址。

4. 設定保留位址別名

   > 在 `Firewall: Aliases: Aliases` 新增名為 \_\_private_network 的別名，選取 Network 類型，加入所有保留位址（或僅加入網路中使用的保留位址），請參閱 [保留 IP 位址](https://www.wikiwand.com/zh-hant/保留IP地址)。

5. 彙整上述別名

   > 在 `Firewall: Aliases: Aliases` 新增名為 proxyroute 的別名，選取 Network group 類型，選取 proxyip、proxyip_ex（若有）、\_\_private_network 及系統內建的 \_\_lo0_network 別名，並將其彙整。

6. 新增閘道

   > 在 `System: Gateways: Single` 新增名為 proxy 的閘道，選取 dae 之間的 wan_proxy 介面，IP 為 dae 的 IP。依上述介面範例，這裡填入 192.168.2.1；優先順序必須低於預設閘道，例如預設閘道設為 254 時，這裡設為 255。

7. 流量分流規則

   > 在 `Firewall: Rules: Floating` 新增規則，設定如下：

   | 項目 | 設定 |
   | - | - |
   | Action | Pass |
   | Quick | √ |
   | Interface | LAN |
   | Direction | in |
   | TCP/IP Version | IPv4 |
   | Protocol | TCP/UDP |
   | Destination/Invert | √ |
   | Destination | proxyroute |
   | Gateway | proxy |

   > 此外，可透過 Source/Invert 排除 LAN 裝置，使其流量不會傳送至 dae。

8. 允許 dae 流量進入 OPN

   > 在 `Firewall: Rules: wan_proxy` 建立新規則，保留所有預設值並儲存。

9. OPN 自身的代理（選用）

   > 若需要讓 OPN 自身的部分流量經過代理，例如使用 Google Drive 備份設定，建議在 `System: Routes: Configuration` 新增靜態路由規則，將需要代理的 IP 網段閘道設為 proxy。不建議在 floating 規則中處理 WAN 流量，這可能造成迴圈。

## dae 相關設定

本節不涉及 dae 設定檔內容，僅說明如何設定 DNS 請求通過 dae，以及代理正常但直接連線無法運作的常見問題之解決方式。關於下文提到的 `domain` 與 `ip` 模式，以及如何設定 dae 的 `dns` 與 `routing` 規則，請參閱 dae 文件。

要使用 dae 進行透明代理，為使基於網域名稱的流量分流規則正常運作，DNS 請求在 `domain` 與 `domain+` 模式中必須通過 dae（請注意，DNS 伺服器未設為 dae 位址，dae 不監聽連接埠 53）。若 DNS 請求未通過 dae，則必須使用 dae 的 `domain++` 模式（根據嗅探到的網域名稱再次比對流量分流規則，其效能不如 domain 模式）。若使用 `domain++` 模式，或不需要依網域名稱分流而使用 `ip` 模式，則可忽略以下設定。

1. DNS 轉送設定
   > 在 `Services: Unbound DNS: Query Forwarding` 中設定，將 DNS 請求轉送至指定伺服器，例如設定 OpenDNS 的 208.67.222.222。下一步需要設定靜態路由規則，將此位址的閘道設為 dae；因此請勿使用上游提供的 DNS，以便在排查 DNS 問題時，仍可正常使用 dig 或 nslookup 查詢上游提供的 DNS 伺服器進行測試。

2. 靜態路由設定
   > 在 `System: Routes: Configuration` 新增靜態路由規則，將網路設為 208.67.222.222/32，並將閘道設為 proxy。

完成上述設定後，DNS 請求可通過 dae，並由 dae 劫持處理。此處設定的 DNS 伺服器並非最終查詢伺服器。DNS 查詢的目標伺服器會由 dae 根據 dae 設定中的 dns 規則重寫，然後傳送 DNS 查詢請求。

請注意，Unbound 轉送用戶端 DNS 請求時會附加 EDNS 相關參數，可能導致上游伺服器傳回過大的 DNS 回應（偶爾大於 2000），使 dae 處理 udp DNS 的緩衝區溢位（基於效能考量，dae 不使用較大的緩衝區；tcp 的 DNS 不會溢位），最終用戶端無法取得 DNS 回應，甚至可能導致 dae 當機。若要解決此問題，可改用 Dnsmasq，或在 `Services: Unbound DNS: General` 停用 EDNSSEC 支援並寫入下列 Unbound 設定，這可有效縮小傳回 DNS 回應的大小。

``` yaml
# saved as /usr/local/etc/unbound.opnsense.d/disableedns.conf
server:
    disable-edns-do: yes 
```

此外，由於 dae 不執行 snat，若代理正常但直接連線無法運作[此處指 dae `routing` 中的 direct，不是 OPN 未分流至 dae 而直接從 WAN 連接埠送出的流量。例如，依前節設定的流量分流規則，OPN 會將 steam 的流量分流並經 dae；dae 已在 `routing` 中設定 domain(geosite:steam@cn) -> direct，但 steam 無法正常登入或下載]，請在安裝 dae 的系統中設定 nat。

## 效能最佳化

將 OPN 與 dae 之間的 MTU 值從預設 1500 改為 9000（需要修改兩個介面及中間連線），可降低負載。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/tutorials/dae-with-opnsense.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
