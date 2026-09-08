# Debian / Ubuntu

適用於 Debian、Ubuntu 及其他使用 APT 的發行版。

以下指令要求目前使用者已設定 sudo。

## 1. 安裝 `curl`

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-1.md-->

## 2. 新增套件來源

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-2.md-->

## 3. 匯入 GPG 公鑰

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-3.md-->

## 4. 安裝 dae

::: code-group

```sh [sudo]
sudo apt update
sudo apt install dae
```

```sh [root]
apt update
apt install dae
```

:::

套件包含 systemd 服務。設定範例位於 `/etc/dae/example.dae`，實際設定檔應儲存為 `/etc/dae/config.dae`。

完成[最小設定](/zh-TW/dae/start/minimal-configuration)後，請參閱[服務管理](/zh-TW/dae/start/service-management)，啟動 dae、設定開機啟動、重載或重新啟動服務。
