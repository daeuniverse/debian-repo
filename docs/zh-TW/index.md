---
layout: home
hero:
  name: Dae Universe
  text: "dae 安裝與使用指南"
  tagline: "檢查核心需求，安裝 dae，設定 DNS、路由與服務。"
  image:
    src: /daeuniverse-hero.png
    alt: Dae Universe
  actions:
    - theme: brand
      text: "快速開始"
      link: /zh-TW/dae/
    - theme: alt
      text: "安裝 daed"
      link: /zh-TW/daed/
    - theme: alt
      text: "v2rayA 與其他軟體"
      link: /zh-TW/guide/packages
features:
  - title: "核心需求"
    details: "安裝前檢查核心版本及所需設定項目。"
    link: /zh-TW/dae/start/requirements
    linkText: "檢查執行環境"
  - title: "DNS 設定"
    details: "設定上游 DNS，依使用情境選擇 DNS 分流範本。"
    link: /zh-TW/dae/configuration/dns
    linkText: "設定 DNS"
  - title: "路由設定"
    details: "依網域、IP、行程與網路分流，選擇出站分組。"
    link: /zh-TW/dae/configuration/routing
    linkText: "撰寫分流規則"
  - title: "疑難排解"
    details: "排查網路、DNS、防火牆及 eBPF 載入問題。"
    link: /zh-TW/dae/troubleshooting
    linkText: "查閱排查步驟"
  - title: "honk"
    details: "Rust 撰寫的 eBPF 代理引擎，借鏡 dae 與 sing-box，仍在早期開發。"
    link: /zh-TW/honk
    linkText: "了解 honk"
  - title: "kdae"
    details: "走在 dae 主線前面的分支，重構架構並最佳化效能。"
    link: /zh-TW/kdae
    linkText: "了解 kdae"
---
