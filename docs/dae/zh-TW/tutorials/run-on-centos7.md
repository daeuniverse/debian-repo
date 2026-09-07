---
title: "CentOS 7"
---

<div v-pre lang="zh-TW">

# CentOS 7

::: warning 歷史相依資源已失效
文中的 `mount-cgroup2.service` 連結已回傳 HTTP 404，目前 `mailbox.repo` 預設亦未啟用核心套件庫。不能將這些歷史命令視為已驗證可用的升級流程。
:::
> [!WARNING]
> CentOS 7 與 RHEL 6.5/7 並未原生支援 eBPF；換言之，必須自行建置並安裝核心（>= 5.17）。

## 簡介

CentOS 7 是資深的 Linux 發行版，雖然其生命週期不長，但應仍有一些使用者。本文件說明在 CentOS 7 或 RHEL 6.5 上執行 dae 的步驟。

## 升級流程

### 更新核心

更新支援 `BTF` 的核心

```bash
curl -s https://repo.cooluc.com/mailbox.repo > /etc/yum.repos.d/mailbox.repo
yum makecache
yum update kernel
```

> [!NOTE]
> 核心以 Linux 6.1 LTS 為基礎重建，以支援 `BBRv2`，並啟用 `eBPF` 支援。也可自行編譯；原始碼套件位於 <https://repo.cooluc.com/kernel/7/SRPMS/>。

### 掛載 BPF

```bash
curl -s https://repo.cooluc.com/kernel/files/sys-fs-bpf.mount > /etc/systemd/system/sys-fs-bpf.mount
systemctl enable sys-fs-bpf.mount
```

### 掛載 Control Group v2

```bash
curl -s https://repo.cooluc.com/kernel/mount-cgroup2.service > /etc/systemd/system/mount-cgroup2.service
systemctl enable mount-cgroup2.service
```

### 重新啟動系統以使核心生效

> [!NOTE]
> 檢查核心版本。若版本為 `6.1.xx-1.el7.x86_64`，表示操作成功。

```bash
uname -r
```

若核心版本未變更，表示核心先前已更新，必須重建 grub2 開機載入程式，讓新核心成為最高優先順序。

將最新核心設為預設值：

```bash
grub2-set-default 0
```

重建核心開機載入程式設定：

```bash
grub2-mkconfig -o /boot/grub2/grub.cfg
```

### 執行 dae

現在可下載 dae 並如常執行：

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

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/tutorials/run-on-centos7.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。

上游範例使用 dae v0.2.2 與第三方核心套件庫。本頁保留歷史步驟，不將該版本作為目前的安裝建議。
