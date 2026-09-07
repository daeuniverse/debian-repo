<div v-pre lang="zh-TW">

<!-- installation-0:start -->
# Arch Linux / Manjaro

可直接從官方儲存庫安裝 dae。

或者，可從 [AUR](https://aur.archlinux.org) 或 [archlinuxcn](https://github.com/archlinuxcn/repo) 取得最新的 AVX2 最佳化二進位套件或最新 git 版本。

## 官方儲存庫

::: code-group

```shell [sudo]
sudo pacman -S dae
```

```shell [root]
pacman -S dae
```

:::

## AUR

### 最新發行版（適用於 x86-64 v3 / AVX2 的最佳化二進位檔）

::: code-group

```shell [yay]
yay -S dae-avx2-bin
```

```shell [paru]
paru -S dae-avx2-bin
```

:::

### 最新 Git 版本

::: code-group

```shell [yay]
yay -S dae-git
```

```shell [paru]
paru -S dae-git
```

:::

## archlinuxcn

### 最新發行版（適用於 x86-64 v3 / AVX2 的最佳化二進位檔）

::: code-group

```shell [sudo]
sudo pacman -S dae-avx2-bin
```

```shell [root]
pacman -S dae-avx2-bin
```

:::

### 最新 Git 版本

::: code-group

```shell [sudo]
sudo pacman -S dae-git
```

```shell [root]
pacman -S dae-git
```

:::

完成[最小設定](/zh-TW/dae/start/minimal-configuration)後，請參閱[服務管理](/zh-TW/dae/start/service-management)，啟動 dae、設定開機啟動、重載或重新啟動服務。

<!-- installation-0:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
