---
title: "外部 DNS"
---

<div v-pre lang="zh-TW">

# 外部 DNS

> **注意**
> DNS 請求應由 dae 轉送，才能依網域分流。本指南說明如何將 dae 設定為使用外部 DNS。

若使用 AdGuardHome 等外部 DNS，可參考以下指南。

## 本機上的外部 DNS

若在本機部署外部 DNS，可能希望代理對 `dns.google` 的 DNS 查詢。例如，若 AdGuardHome 有以下設定：

```
Listen on: the same machine with dae, port 53.

China mainland: udp://223.5.5.5:53
Others: https://dns.google/dns-query
```

應按以下方式設定 dae：

1. 在`global`區段補齊 `wan_interface`，以代理 AdguardHome 的請求。

2. 將以下規則插入`routing`區段的第一行，以避免迴圈。

   ```python
   pname(AdGuardHome) && l4proto(udp) && dport(53) -> must_direct
   ```

   並確保路由規則會代理網域 `dns.google`。

3. 在`dns`區段新增 upstream 和 request。

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

4. 繫結 WAN 時，確保 `/etc/resolv.conf` 不直接使用本機外部 DNS。例如，可設定為 `nameserver 119.29.29.29`；封包經由網路介面傳送時，DNS 流量會被 dae 劫持。

   重新啟動後，dnsmasq 等 DNS 服務可能還原 `/etc/resolv.conf`。遇到此情況，原文建議解除安裝這些服務，或將該檔案設為不可修改：

   ::: code-group

   ```shell [sudo]
   sudo chattr +i /etc/resolv.conf
   ```

   ```shell [root]
   chattr +i /etc/resolv.conf
   ```

   :::

5. 若繫結至 LAN，請確保 DHCP 伺服器將 dae 作為 DNS 伺服器發放（DNS 請求應由 dae 轉送，才能依網域分流）。

6. 若仍有 DNS 問題且沒有 warn/error 日誌，必須將外部 DNS（此處為 AdGuardHome）的監聽連接埠從 53 改為非 53 連接埠。請參閱 [#31](https://github.com/daeuniverse/dae/issues/31#issuecomment-1467358364)。

7. 若使用 PVE，請參閱 [#37](https://github.com/daeuniverse/dae/discussions/37)。

## LAN 中另一台機器上的外部 DNS

若在 LAN 中另一台機器部署外部 DNS，可能希望代理對 `dns.google` 的 DNS 查詢。例如，若 `AdguardHome` 有以下設定：

```
Listen on: 192.168.30.3:53 (mac address: 8c:16:45:36:1c:5a)

China mainland: udp://223.5.5.5:53
Others: https://dns.google/dns-query
```

應按以下方式設定 dae：

1. 在`global`區段填入 `lan_interface`，以代理 AdguardHome 的請求。

2. 將以下規則插入`routing`區段的第一行，以避免迴圈。

   ```python
   sip(192.168.30.3) && l4proto(udp) && dport(53) -> must_direct
   # Or use MAC address if in the same link:
   # mac(8c:16:45:36:1c:5a) && l4proto(udp) && dport(53) -> must_direct
   ```

   並確保路由規則會代理網域 `dns.google`。

3. 在`dns`區段新增 upstream 和 request。

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

4. 若繫結至 LAN，請確保 DHCP 伺服器將 dae 作為 DNS 伺服器發放（DNS 請求應由 dae 轉送，才能依網域分流）。

5. 若仍有 DNS 問題且沒有 warn/error 日誌，必須將外部 DNS（此處為 AdGuardHome）的監聽連接埠從 53 改為非 53 連接埠。請參閱 [#31](https://github.com/daeuniverse/dae/issues/31#issuecomment-1467358364)。

6. 若使用 PVE，請參閱 [#37](https://github.com/daeuniverse/dae/discussions/37)。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/configuration/external-dns.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
