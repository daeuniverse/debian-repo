---
title: "CentOS 7"
---

<div v-pre lang="zh-CN">

# CentOS 7

::: warning 历史依赖已失效
文中的 `mount-cgroup2.service` 链接已返回 HTTP 404，当前 `mailbox.repo` 默认也未启用内核仓库。不能将这些历史命令视为已验证可用的升级流程。
:::
> [!WARNING]
> CentOS 7 和 RHEL 6.5/7 不开箱支持 eBPF；换言之，必须自行构建内核（>= 5.17）并安装。

## 简介

CentOS 7 是一个老牌 Linux 发行版，尽管其生命周期不长，但应该仍有人在使用。本文记录在 CentOS 7 或 RHEL 6.5 上运行 dae 的步骤。

## 升级流程

### 更新内核

更新支持 `BTF` 的内核。

```bash
curl -s https://repo.cooluc.com/mailbox.repo > /etc/yum.repos.d/mailbox.repo
yum makecache
yum update kernel
```

> [!NOTE]
> 该内核基于 Linux 6.1 LTS，重新构建以支持 `BBRv2`，并启用 `eBPF` 支持。也可以自行编译，源软件包位于 <https://repo.cooluc.com/kernel/7/SRPMS/>。

### 挂载 BPF

```bash
curl -s https://repo.cooluc.com/kernel/files/sys-fs-bpf.mount > /etc/systemd/system/sys-fs-bpf.mount
systemctl enable sys-fs-bpf.mount
```

### 挂载 Control Group v2

```bash
curl -s https://repo.cooluc.com/kernel/mount-cgroup2.service > /etc/systemd/system/mount-cgroup2.service
systemctl enable mount-cgroup2.service
```

### 重启系统使内核生效

> [!NOTE]
> 检查内核版本。若版本为 `6.1.xx-1.el7.x86_64`，表示操作成功。

```bash
uname -r
```

若内核版本未变，表示此前已更新过内核，需要重新构建 grub2 引导程序，使新内核具有最高优先级。

要将最新内核设为默认：

```bash
grub2-set-default 0
```

要重新构建内核引导程序配置：

```bash
grub2-mkconfig -o /boot/grub2/grub.cfg
```

### 运行 dae

现在可以照常下载并运行 dae。

```bash
mkdir -p /opt/dae && cd /opt/dae
wget https://github.com/daeuniverse/dae/releases/download/v0.2.2/dae-linux-x86_64.zip
unzip dae-linux-x86_64.zip && rm -f dae-linux-x86_64.zip
cp example.dae config.dae
chmod 600 config.dae
DAE_LOCATION_ASSET=$(pwd) ./dae-linux-x86_64 run -c config.dae
```

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/tutorials/run-on-centos7.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。

上游示例使用 dae v0.2.2 和第三方内核仓库。本页保留历史步骤，不将该版本作为当前安装建议。
