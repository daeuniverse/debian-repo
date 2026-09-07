---
title: "升級核心"
---

<div v-pre lang="zh-TW">

# 升級核心

`kernel` 是所有作業系統的核心。在開始將 Linux 稱為作業系統前，你需要瞭解基本概念和 Linux 的誕生歷史。**_Linux 不是作業系統；Linux 主要是一個核心_**。

## 如何在各種發行版上升級 Linux 核心

### 免責聲明

升級 Linux 核心並不容易；僅當你發現安全錯誤或硬體互動問題時才必須這樣做。如果系統當機，可能必須還原整個系統。大多數 Linux 發行版都附帶最新升級的核心。升級 Linux 核心不會刪除或移除先前的核心；它會保留在系統中。

> **注意**：除非你需要某些特定驅動程式支援，否則不應手動升級核心。你可以從 Linux 系統的復原選單回復到舊核心。但是，你可能需要因硬體問題或安全問題而升級核心。

### 準備工作

開始升級 Linux 核心前，必須知道主機上正在執行的核心 目前版本。你可以透過 `uname -r` 取得該資訊。對於 `eBPF`，最低要求版本為 `>= 5.17`

各種 Linux 發行版升級 Linux 核心的方法不同。本指南涵蓋了在大多數 `Armbian Linux`、`Debian-based Linux`、`RedHat, Fedora based Linux` 和 `Arch-based Linux` 發行版上將核心升級到所需版本的方法。

> **注意**：由於 `dae` 使用 `eBPF` 建置，主機必須符合最低核心版本 `>= 5.17`，dae 才能正常執行。

### 在 Armbian Linux 上升級至 BTF 核心

對於 Armbian 使用者，我們已編譯啟用 BTF 的核心。

請參閱 [daeuniverse/armbian-btf-kernel](https://github.com/daeuniverse/armbian-btf-kernel)。

### 在基於 Debian 的 Linux 上升級核心

像 armbian 這樣基於 Debian 的發行版可以在系統上安裝特定版本的核心。你可以在 Linux 終端機中執行下列命令列，在 Linux 系統上安裝任意特定版本的核心。安裝完成後，重新啟動系統以在 Linux 系統上使用所需核心。

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

重新啟動以生效：

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

系統重新啟動後，檢查目前核心版本：

```shell
uname -r
```

（僅 Debian）：如果你想升級至最新核心（積極升級），請遵循下列命令：

> **警告**：Debian 官方支援的最新核心位於 `unstable release`。Debian Unstable（也稱為代號 "SID"）並非嚴格意義上的發行版，而是 Debian 發行版的滾動開發版本，其中包含已引入 Debian 的最新套件。升級至最新核心可能會為系統帶來破壞性變更，因此請自行承擔風險。

參考資料：[https://www.itsfoss.net/installing-linux-5-14-kernel-on-debian-11/](https://www.itsfoss.net/installing-linux-5-14-kernel-on-debian-11)

> **注意**：如果你的系統不是 Debian11，請修改下列行：`Pin: release a=bullseye`，例如 `Pin: release a=buster`（Debian10）

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

重新啟動以生效：

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

系統重新啟動後，檢查目前核心版本：

```shell
uname -r
```

### 在 RedHat 和 Fedora Linux 上升級核心

Fedora、RedHat 及基於 RedHat 的 Linux 發行版使用者可以透過從儲存庫下載核心來手動升級 Linux 核心。

Fedora 和 RedHat Linux 使用者可以在系統上安裝特定版本的核心。你可以在 Linux 終端機中執行下列命令列，以安裝任意特定版本的核心。安裝完成後，重新啟動系統即可使用所需核心。

::: code-group

```shell [sudo]
sudo yum install kernel
```

```shell [root]
yum install kernel
```

:::

重新啟動以生效：

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

系統重新啟動後，檢查目前核心版本：

```shell
uname -r
```

### 在基於 Arch 的 Linux 上升級核心

Arch 和基於 Arch 的 Linux 發行版具有 `dynamic` 的 Linux 核心變體。Arch Linux 定期更新其安全修補程式；因此，你會看到 Arch Linux 有顯著的核心和修補程式更新可用。此處將介紹兩種在 Arch Linux 上升級核心的方法。

Manjaro 和其他 Arch Linux 發行版通常透過傳統更新管理員提供核心更新和升級。當你在 Linux 系統上執行系統更新程式時，它會檢查最新核心。你可以使用下列 `pacman` 命令檢查 Arch Linux 發行版上的最新核心。

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

同意安裝後，請在安裝完成後重新啟動系統。然後，你可以檢查核心版本，以確認核心是否已升級。

::: code-group

```shell [sudo]
sudo reboot
```

```shell [root]
reboot
```

:::

系統重新啟動後，檢查目前核心版本：

```shell
uname -r
```

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/kernel-upgrade.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
