---
title: "Alpine Linux"
---

<div v-pre lang="zh-CN">

# Alpine Linux

以下命令使用 OpenRC。已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。
**注意：**
1. Alpine Linux 3.18 或更新版本开箱即支持完整 eBPF；较旧的 Alpine Linux 版本需要自行构建内核。
2. 从 3.20 起，因 Alpine Linux 的跨 CPU 架构兼容性，Alpine Linux 已正式禁用 dae 所需的一些功能，因此默认只能使用 `linux-virt` 运行 dae。对于 `linux-lts` 或 `linux-edge`，应自行构建内核。
3. 本教程适用于 Alpine Linux 3.20 及更新版本。

## 启用 Community 仓库

运行 `setup-apkrepos` 命令后，会得到如下菜单列表：

::: code-group

```shell [sudo]
sudo setup-apkrepos
```

```shell [root]
setup-apkrepos
```

:::

```
 (f)    Find and use fastest mirror
 (s)    Show mirrorlist
 (r)    Use random mirror
 (e)    Edit /etc/apk/repositories with text editor
 (c)    Community repo enable
 (skip) Skip setting up apk repositories
```

然后输入 `c` 以启用 Community 仓库。

## 启用 CGroups

启用 `cgroups` 服务：

::: code-group

```sh [sudo]
sudo rc-update add cgroups boot
```

```sh [root]
rc-update add cgroups boot
```

:::

## 挂载 bpf

编辑 `/etc/init.d/sysfs`：

::: code-group

```sh [sudo]
sudo vi /etc/init.d/sysfs
```

```sh [root]
vi /etc/init.d/sysfs
```

:::

在 `mount_misc` 部分添加以下内容：

```sh
        # Setup Kernel Support for bpf file system
        if [ -d /sys/fs/bpf ] && ! mountinfo -q /sys/fs/bpf; then
                if grep -qs bpf /proc/filesystems; then
                ebegin "Mounting eBPF filesystem"
                mount -n -t bpf -o ${sysfs_opts} bpffs /sys/fs/bpf
                eend $?
                fi
        fi
```

请注意，脚本 `/etc/init.d/sysfs` 的格式必须正确，否则 `sysfs` 服务将失败。

## 使启动配置生效

完成 cgroups 和 sysfs 配置后重新启动系统，使开机挂载生效，再启动 dae。

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

## 安装 dae

安装程序：<https://github.com/daeuniverse/dae-installer/>

该安装程序提供 dae 的 OpenRC 服务脚本。安装后，应在 `/usr/local/etc/dae/config.dae` 添加配置文件，再将其权限设为 600 或 640：

::: code-group

```sh [sudo]
sudo chmod 640 /usr/local/etc/dae/config.dae
```

```sh [root]
chmod 640 /usr/local/etc/dae/config.dae
```

:::

完成[最小配置](/zh-CN/dae/start/minimal-configuration)后，请参阅[服务管理](/zh-CN/dae/start/service-management)，启动 dae、设置开机启动、重载或重新启动服务。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/tutorials/run-on-alpine.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
