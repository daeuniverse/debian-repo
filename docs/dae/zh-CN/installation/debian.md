# Debian / Ubuntu

适用于 Debian、Ubuntu 及其他使用 APT 的发行版。

以下命令要求当前用户已配置 sudo。

## 1. 安装 `curl`

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-1.md-->

## 2. 添加软件源

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-2.md-->

## 3. 导入 GPG 公钥

<!--@include: @/.vitepress/snippets/repositories/zh-CN/debian-3.md-->

## 4. 安装 dae

```sh
sudo apt update
sudo apt install dae
```

软件包包含 systemd 服务。配置示例位于 `/etc/dae/example.dae`，实际配置文件应保存为 `/etc/dae/config.dae`。

完成[最小配置](/zh-CN/dae/start/minimal-configuration)后，请参阅[服务管理](/zh-CN/dae/start/service-management)，启动 dae、设置开机启动、重载或重新启动服务。
