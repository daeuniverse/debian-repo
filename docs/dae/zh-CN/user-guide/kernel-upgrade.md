---
title: "升级内核"
---

<div v-pre lang="zh-CN">

# 升级内核

`kernel` 是所有操作系统的核心。在开始将 Linux 称为操作系统前，你需要了解基本概念和 Linux 的诞生历史。**_Linux 不是操作系统；Linux 主要是一个内核_**。

## 如何在各种发行版上升级 Linux 内核

### 免责声明

升级 Linux 内核并不容易；仅当你发现安全错误或硬件交互问题时才必须这样做。如果系统崩溃，可能必须恢复整个系统。大多数 Linux 发行版都附带最新升级的内核。升级 Linux 内核不会删除或移除先前的内核；它会保留在系统中。

> **注意**：除非你需要某些特定驱动程序支持，否则不应手动升级内核。你可以从 Linux 系统的恢复菜单回滚到旧内核。但是，你可能需要因硬件问题或安全问题而升级内核。

### 准备工作

开始升级 Linux 内核前，必须知道主机上正在运行的内核 当前版本。你可以通过 `uname -r` 获取该信息。对于 `eBPF`，最低要求版本为 `>= 5.17`

各种 Linux 发行版升级 Linux 内核的方法不同。本指南涵盖了在大多数 `Armbian Linux`、`Debian-based Linux`、`RedHat, Fedora based Linux` 和 `Arch-based Linux` 发行版上将内核升级到所需版本的方法。

> **注意**：由于 `dae` 使用 `eBPF` 构建，主机必须满足最低内核版本 `>= 5.17`，dae 才能正常运行。

### 在 Armbian Linux 上升级到 BTF 内核

对于 Armbian 用户，我们已编译启用 BTF 的内核。

请参阅 [daeuniverse/armbian-btf-kernel](https://github.com/daeuniverse/armbian-btf-kernel)。

### 在基于 Debian 的 Linux 上升级内核

像 armbian 这样的基于 Debian 的发行版可以在系统上安装特定版本的内核。你可以在 Linux 终端中运行以下命令行，在 Linux 系统上安装任意特定版本的内核。安装完成后，重启系统以在 Linux 系统上使用所需内核。

::: code-group

```shell [sudo]
# Sync databases.
sudo apt update
# Search available kernel versions.
apt-cache search ^linux-image
# Install specific image.
sudo apt install <specific-linux-image>
```

```shell [root]
# Sync databases.
apt update
# Search available kernel versions.
apt-cache search ^linux-image
# Install specific image.
apt install <specific-linux-image>
```

:::

重启以生效：

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

系统重新启动后，检查当前内核版本：

```shell
uname -r
```

（仅 Debian）：如果你想升级到最新内核（激进升级），请遵循以下命令：

> **警告**：Debian 官方支持的最新内核位于 `unstable release`。Debian Unstable（也称为代号“SID”）并非严格意义上的发行版，而是 Debian 发行版的滚动开发版本，其中包含已引入 Debian 的最新软件包。升级到最新内核可能会给系统带来破坏性变更，因此请自行承担风险。

参考资料：[https://www.itsfoss.net/installing-linux-5-14-kernel-on-debian-11/](https://www.itsfoss.net/installing-linux-5-14-kernel-on-debian-11)

> **注意**：如果你的系统不是 Debian11，请修改以下行：`Pin: release a=bullseye`，例如 `Pin: release a=buster`（Debian10）

::: code-group

```shell [sudo]
# Add unstable source
cat <<EOF | sudo tee -a /etc/apt/sources.list
deb http://deb.debian.org/debian unstable main contrib non-free
deb-src http://deb.debian.org/debian unstable main contrib non-free
EOF

# Create apt preferences
cat <<EOF | sudo tee /etc/apt/preferences
Package: *
Pin: release a=bullseye
Pin-Priority: 500

Package: linux-image-amd64
Pin: release a=unstable
Pin-Priority: 1000

Package: *
Pin: release a=unstable
Pin-Priority: 100
EOF

# Sync databases.
sudo apt update

# Perform full dist-upgrade
sudo apt dist-upgrade
```

```shell [root]
# Add unstable source
cat <<EOF | tee -a /etc/apt/sources.list
deb http://deb.debian.org/debian unstable main contrib non-free
deb-src http://deb.debian.org/debian unstable main contrib non-free
EOF

# Create apt preferences
cat <<EOF | tee /etc/apt/preferences
Package: *
Pin: release a=bullseye
Pin-Priority: 500

Package: linux-image-amd64
Pin: release a=unstable
Pin-Priority: 1000

Package: *
Pin: release a=unstable
Pin-Priority: 100
EOF

# Sync databases.
apt update

# Perform full dist-upgrade
apt dist-upgrade
```

:::

重启以生效：

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

系统重新启动后，检查当前内核版本：

```shell
uname -r
```

### 在 RedHat 和 Fedora Linux 上升级内核

Fedora、RedHat 及基于 RedHat 的 Linux 发行版用户可以通过从仓库下载内核来手动升级 Linux 内核。

Fedora 和 RedHat Linux 用户可以在系统上安装特定版本的内核。你可以在 Linux 终端中运行以下命令行，以安装任意特定版本的内核。安装完成后，重启系统即可使用所需内核。

::: code-group

```shell [sudo]
sudo yum install kernel
```

```shell [root]
yum install kernel
```

:::

重启以生效：

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

系统重新启动后，检查当前内核版本：

```shell
uname -r
```

### 在基于 Arch 的 Linux 上升级内核

Arch 和基于 Arch 的 Linux 发行版具有 `dynamic` 的 Linux 内核变体。Arch Linux 定期更新其安全补丁；因此，你会看到 Arch Linux 有显著的内核和补丁更新可用。此处将介绍两种在 Arch Linux 上升级内核的方法。

Manjaro 和其他 Arch Linux 发行版通常通过传统更新管理器提供内核更新和升级。当你在 Linux 系统上运行系统更新程序时，它会检查最新内核。你可以使用以下 `pacman` 命令检查 Arch Linux 发行版上的最新内核。

::: code-group

```shell [sudo]
# Search available kernel images.
pacman -Ss ^linux$
# Install specific kernel image.
sudo pacman -S <specific-linux-image>
```

```shell [root]
# Search available kernel images.
pacman -Ss ^linux$
# Install specific kernel image.
pacman -S <specific-linux-image>
```

:::

同意安装后，请在安装完成后重启系统。然后，你可以检查内核版本，以确认内核是否已升级。

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

系统重新启动后，检查当前内核版本：

```shell
uname -r
```

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/kernel-upgrade.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
