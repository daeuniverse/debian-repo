# Fedora / RHEL

适用于 Fedora 和 RHEL。

以下命令要求当前用户已配置 sudo。

## 1. 添加软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/fedora-1.md-->

## 2. 安装 dae

```sh
sudo dnf install dae
```

:::: details 其他安装方式：Fedora Copr

<div v-pre lang="zh-CN">

<!-- installation-4:start -->
仅适用于 Fedora，可替代上方的 Dae Universe 软件源。[`zhullyb/v2rayA`](https://copr.fedorainfracloud.org/coprs/zhullyb/v2rayA/package/dae) 是 Copr 项目名，安装的软件包仍是 `dae`。

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

软件包包含 systemd 服务。配置示例位于 `/etc/dae/example.dae`，实际配置文件应保存为 `/etc/dae/config.dae`。

完成[最小配置](/zh-CN/dae/start/minimal-configuration)后，请参阅[服务管理](/zh-CN/dae/start/service-management)，启动 dae、设置开机启动、重载或重新启动服务。


---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
