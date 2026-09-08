---
title: "導覽"
---

<div v-pre lang="zh-TW">

# 導覽

從檢查系統需求開始，依序完成 dae 安裝、設定與服務啟動。本頁依使用順序整理文件入口，也可直接查找設定與疑難排解內容。

## 首次部署

| 步驟 | 要完成的事項 | 文件 |
| --- | --- | --- |
| 1 | 檢查核心版本與必要設定項目 | [核心需求](/zh-TW/dae/start/requirements) |
| 2 | 依系統選擇安裝方式 | [安裝指南](/zh-TW/dae/installation/) |
| 3 | 設定網路介面、訂閱或節點 | [最小設定](/zh-TW/dae/start/minimal-configuration) |
| 4 | 啟動 dae 並設定開機啟動 | [服務管理](/zh-TW/dae/start/service-management) |

使用 PPPoE 介面時，還需參閱[PPPoE 介面設定](/zh-TW/dae/start/pppoe)。

## 設定流量處理

| 需要完成的設定 | 文件 |
| --- | --- |
| DNS 伺服器與 DNS 分流 | [DNS 設定](/zh-TW/dae/configuration/dns) · [外部 DNS](/zh-TW/dae/configuration/external-dns) |
| 網域名稱、IP 與遊戲分流 | [路由規則](/zh-TW/dae/configuration/routing) · [遊戲路由](/zh-TW/dae/configuration/gaming-oriented-routing) |
| 組織設定檔 | [拆分設定檔](/zh-TW/dae/configuration/separate-config) |

## 執行與排查

- [服務管理](/zh-TW/dae/start/service-management)：使用 systemd 或 OpenRC 啟動、設定開機啟動、重載與重新啟動。
- [重載與暫停](/zh-TW/dae/user-guide/reload-and-suspend)：重載設定或暫時停止處理流量。
- [疑難排解](/zh-TW/dae/troubleshooting)：排查網路、DNS、防火牆與 eBPF 問題。

## 了解原理與參與開發

[運作原理](/zh-TW/dae/how-it-works) · [代理協定](/zh-TW/dae/proxy-protocols) · [從原始碼建置](/zh-TW/dae/user-guide/build-by-yourself) · [參與貢獻](/zh-TW/dae/development/contribute)

安裝已下載的二進位檔案或使用安裝指令碼，請參閱[手動安裝](/zh-TW/dae/installation/manual-installation)。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
