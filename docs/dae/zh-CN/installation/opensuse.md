# openSUSE

适用于 openSUSE。

以下命令要求当前用户已配置 sudo。

## 1. 添加软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/opensuse-1.md-->

## 2. 安装 dae

```sh
sudo zypper install dae
```

软件包包含 systemd 服务。配置示例位于 `/etc/dae/example.dae`，实际配置文件应保存为 `/etc/dae/config.dae`。

完成[最小配置](/zh-CN/dae/start/minimal-configuration)后，请参阅[服务管理](/zh-CN/dae/start/service-management)，启动 dae、设置开机启动、重载或重新启动服务。
