# honk <Badge type="warning" text="實驗性" />

honk 是 Rust 撰寫的 Linux 透明代理引擎，核心路徑沿用 dae 的 eBPF 資料面與 `dae0`／`daens` 模型，使用者空間的出站分組、多協定撥號與 Clash 相容 API 借鏡 sing-box。它不是任一方的移植，而是把兩者的設計合到一個行程裡，以 GPL-3.0 發布。

::: warning 尚未穩定
上游將 honk 標註為 experimental，版本仍處於 `v0.0.1` 預發布階段，介面、設定與功能隨時變動，不建議用於生產環境。
:::

本站不提供 honk 的安裝與設定說明。功能範圍、設定格式與目前進度以上游為準：

[honk 專案首頁](https://github.com/daeuniverse/honk)
