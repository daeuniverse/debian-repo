# openSUSE

適用於 openSUSE。

以下指令要求目前使用者已設定 sudo。

## 1. 新增套件來源

<!--@include: @/.vitepress/snippets/repositories/zh-TW/opensuse-1.md-->

## 2. 安裝 dae

::: code-group

```sh [sudo]
sudo zypper install dae
```

```sh [root]
zypper install dae
```

:::

套件包含 systemd 服務。設定範例位於 `/etc/dae/example.dae`，實際設定檔應儲存為 `/etc/dae/config.dae`。

完成[最小設定](/zh-TW/dae/start/minimal-configuration)後，請參閱[服務管理](/zh-TW/dae/start/service-management)，啟動 dae、設定開機啟動、重載或重新啟動服務。
