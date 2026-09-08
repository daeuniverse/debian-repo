# 安裝指南

依系統選擇安裝入口。安裝前請檢查[核心需求](/zh-TW/dae/start/requirements)；僅安裝套件並不等於完成代理設定。

## Dae Universe APT／RPM 套件來源

| 系統 | 套件管理器 | 安裝入口 |
| --- | --- | --- |
| Debian | APT | [安裝 dae](/zh-TW/dae/installation/debian) |
| Ubuntu | APT | [安裝 dae](/zh-TW/dae/installation/debian) |
| Fedora | DNF | [安裝 dae](/zh-TW/dae/installation/fedora) |
| RHEL | DNF | [安裝 dae](/zh-TW/dae/installation/fedora) |
| openSUSE | Zypper | [安裝 dae](/zh-TW/dae/installation/opensuse) |

## 發行版與社群安裝方式

| 系統 | 安裝來源 | 安裝入口 |
| --- | --- | --- |
| Arch Linux | 官方套件庫、AUR、archlinuxcn | [安裝說明](/zh-TW/dae/installation/arch) |
| Manjaro | AUR / archlinuxcn | [安裝說明](/zh-TW/dae/installation/arch) |
| Gentoo | gentoo-zh overlay | [安裝說明](/zh-TW/dae/installation/gentoo) |
| Calculate | gentoo-zh overlay | [安裝說明](/zh-TW/dae/installation/gentoo) |
| NixOS | daeuniverse/flake.nix | [安裝說明](/zh-TW/dae/installation/nix) |

Fedora 另有 [Copr](/zh-TW/dae/installation/fedora) 安裝方式。

## 容器與手動安裝

- [Docker](/zh-TW/dae/installation/docker)
- [手動安裝](/zh-TW/dae/installation/manual-installation)
- [OPNsense](/zh-TW/dae/tutorials/dae-with-opnsense)
- [CentOS 7](/zh-TW/dae/tutorials/run-on-centos7)

CentOS 7 與 macOS 教學包含歷史相依資源，請先閱讀對應頁面的說明，再使用其中的命令。

<!-- installation-5:start -->
## Alpine

請參閱[在 Alpine 上執行](/zh-TW/dae/tutorials/run-on-alpine)。
<!-- installation-5:end -->

<!-- installation-6:start -->
## macOS

我們提供在 macOS 上執行 dae 的權宜方法。請參閱[在 macOS 上執行](/zh-TW/dae/tutorials/run-on-macos)。
<!-- installation-6:end -->

## 安裝之後

[最小設定](/zh-TW/dae/start/minimal-configuration) → [服務管理](/zh-TW/dae/start/service-management) → [疑難排解](/zh-TW/dae/troubleshooting)

## 其他可用套件

本站以 dae 文件為主。套件來源亦提供 daed、v2rayA 等套件，下表列出套件來源的完整套件列表。

版本號來自套件來源的建置結果；單獨建置文件時，從 [status 分支](https://github.com/daeuniverse/repo-for-linux/tree/status)補充版本資料。

| 軟體 | 版本 | 專案 | 授權條款 |
| --- | --- | --- | --- |
<!--@include: @/.vitepress/generated/package-rows.md-->

### 安裝軟體

<!--@include: @/.vitepress/snippets/packages/zh-TW/install.md-->

daed 的安裝步驟見 [daed](/zh-TW/daed/)；套件來源套件的說明見[其他可用套件](/zh-TW/guide/packages)。


---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
