# Debian / Ubuntu

從 Dae Universe 套件來源安裝 daed。

適用於 Debian、Ubuntu 及其他使用 APT 的發行版。

以下指令要求目前使用者已設定 sudo。

## 1. 安裝 `curl`

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-1.md-->

## 2. 新增套件來源

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-2.md-->

## 3. 匯入 GPG 公鑰

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-3.md-->

## 4. 安裝 daed

::: code-group

```sh [sudo]
sudo apt update
sudo apt install daed
```

```sh [root]
apt update
apt install daed
```

:::

套件提供 `daed.service`，設定目錄為 `/etc/daed/`。

[上游設定說明](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md) · [服務管理](/zh-TW/daed/service-management)
