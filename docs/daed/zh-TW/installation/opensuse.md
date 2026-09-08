# openSUSE

從 Dae Universe 套件來源安裝 daed。

適用於 openSUSE。

以下指令要求目前使用者已設定 sudo。

## 1. 新增套件來源

<!--@include: @/.vitepress/snippets/repositories/zh-TW/opensuse-1.md-->

## 2. 安裝 daed

::: code-group

```sh [sudo]
sudo zypper install daed
```

```sh [root]
zypper install daed
```

:::

套件提供 `daed.service`，設定目錄為 `/etc/daed/`。

[上游設定說明](https://github.com/daeuniverse/daed/blob/main/docs/getting-started.md) · [服務管理](/zh-TW/daed/service-management)
