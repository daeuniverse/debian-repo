# Fedora / RHEL

適用於 Fedora 與 RHEL。

以下指令要求目前使用者已設定 sudo。

## 1. 新增套件來源

<!--@include: @/.vitepress/snippets/repositories/zh-TW/fedora-1.md-->

## 2. 安裝 dae

::: code-group

```sh [sudo]
sudo dnf install dae
```

```sh [root]
dnf install dae
```

:::

:::: details 其他安裝方式：Fedora Copr

<div v-pre lang="zh-TW">

<!-- installation-4:start -->
僅適用於 Fedora，可替代上方的 Dae Universe 軟體源。[`zhullyb/v2rayA`](https://copr.fedorainfracloud.org/coprs/zhullyb/v2rayA/package/dae) 是 Copr 專案名稱，安裝的套件仍是 `dae`。

::: code-group

```shell [sudo]
sudo dnf copr enable zhullyb/v2rayA
sudo dnf install dae
```

```shell [root]
dnf copr enable zhullyb/v2rayA
dnf install dae
```

:::
<!-- installation-4:end -->

</div>

::::

套件包含 systemd 服務。設定範例位於 `/etc/dae/example.dae`，實際設定檔應儲存為 `/etc/dae/config.dae`。

完成[最小設定](/zh-TW/dae/start/minimal-configuration)後，請參閱[服務管理](/zh-TW/dae/start/service-management)，啟動 dae、設定開機啟動、重載或重新啟動服務。


---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
