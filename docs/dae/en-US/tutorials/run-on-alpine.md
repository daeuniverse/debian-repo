---
title: "Alpine Linux"
---

<div v-pre lang="en-US">

# Alpine Linux

The commands below use OpenRC. Select sudo if it is configured for your account, or root when already in a root shell.
**Note:** 
1. Alpine Linux 3.18 or newer verison has full eBPF support out-of-box, older version of Alpine Linux need to build kernel by yourself.
2. From version 3.20, Alpine Linux has officially disabled some features dae needed beacuse of Alpine Linux's cross CPU architectures compatibility, so only `linux-virt` can be used to run dae defaultly. For `linux-lts` or `linux-edge`, you should build the kernel by yourself.
3. This tutorial is for Alpine Linux 3.20 and newer.

## Enable Community Repo

Run `setup-apkrepos` command, then you'll get a menu list like this:

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

Then input `c` to enable community repo.

## Enable CGroups

Enable `cgroups` service:

::: code-group

```sh [sudo]
sudo rc-update add cgroups boot
```

```sh [root]
rc-update add cgroups boot
```

:::

## Mount bpf

Edit `/etc/init.d/sysfs`:

::: code-group

```sh [sudo]
sudo vi /etc/init.d/sysfs
```

```sh [root]
vi /etc/init.d/sysfs
```

:::

Add the following to the `mount_misc` section:

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

Be careful that the format of the script `/etc/init.d/sysfs` must be correct, or `sysfs` service will be failed.

## Apply the boot configuration

Restart after configuring cgroups and sysfs so their boot-time mounts take effect before starting dae.

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

## Install dae

Installer: <https://github.com/daeuniverse/dae-installer/>

This installer offered an OpenRC service script of dae, after installation, you should add a config file to `/usr/local/etc/dae/config.dae`, then set its permission to 600 or 640:

::: code-group

```sh [sudo]
sudo chmod 640 /usr/local/etc/dae/config.dae
```

```sh [root]
chmod 640 /usr/local/etc/dae/config.dae
```

:::

After completing [Minimal configuration](/dae/start/minimal-configuration), see [Service management](/dae/start/service-management) to start, enable, reload or restart dae.

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/tutorials/run-on-alpine.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
