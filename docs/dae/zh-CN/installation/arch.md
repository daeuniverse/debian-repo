<div v-pre lang="zh-CN">

<!-- installation-0:start -->
# Arch Linux / Manjaro

可以直接从官方仓库安装 dae。

或者，从 [AUR](https://aur.archlinux.org) 或 [archlinuxcn](https://github.com/archlinuxcn/repo) 获取最新的 AVX2 优化二进制软件包或最新 git 版本。

## 官方仓库

::: code-group

```shell [sudo]
sudo pacman -S dae
```

```shell [root]
pacman -S dae
```

:::

## AUR

### 最新发行版（针对 x86-64 v3 / AVX2 优化的二进制文件）

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

### 最新发行版（针对 x86-64 v3 / AVX2 优化的二进制文件）

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

完成[最小配置](/zh-CN/dae/start/minimal-configuration)后，请参阅[服务管理](/zh-CN/dae/start/service-management)，启动 dae、设置开机启动、重载或重新启动服务。

<!-- installation-0:end -->

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
