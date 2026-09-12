# DaedNext <Badge type="warning" text="實驗性" />

DaedNext 是 daed 的 Rust 版本，把 daed 的 Web 面板與 [DaeNext](https://github.com/ksong008/DaeNext) 的 dae 核心打包成一個 `daed` 二進位檔。DaeNext 用 Rust 重寫了守護行程、路由、DNS、設定解析與出站協定堆疊，並透過 Aya 原生載入 eBPF 資料面；面板沿用 daed 的 MIT 授權條款，核心以 AGPL-3.0-only 發布。

::: warning 尚未發布
兩個儲存庫都還沒有發布版本，介面、設定與打包方式隨時變動，不建議用於生產環境。
:::

本站不提供 DaedNext 的安裝與設定說明。建置方式、功能範圍與目前進度以上游為準：

[DaedNext 專案首頁](https://github.com/ksong008/DaedNext)
