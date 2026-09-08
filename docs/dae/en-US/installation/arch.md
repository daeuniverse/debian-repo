<div v-pre lang="en-US">

<!-- installation-0:start -->
# Arch Linux / Manjaro

You can install dae directly from the official repository.

Alternatively, get the latest AVX2-optimized binary package or the latest git version from [AUR](https://aur.archlinux.org) or [archlinuxcn](https://github.com/archlinuxcn/repo).

## Official Repository

::: code-group

```shell [sudo]
sudo pacman -S dae
```

```shell [root]
pacman -S dae
```

:::

## AUR

### Latest Release (Optimized Binary for x86-64 v3 / AVX2)

::: code-group

```shell [yay]
yay -S dae-avx2-bin
```

```shell [paru]
paru -S dae-avx2-bin
```

:::

### Latest Git Version

::: code-group

```shell [yay]
yay -S dae-git
```

```shell [paru]
paru -S dae-git
```

:::

## archlinuxcn

### Latest Release (Optimized Binary for x86-64 v3 / AVX2)

::: code-group

```shell [sudo]
sudo pacman -S dae-avx2-bin
```

```shell [root]
pacman -S dae-avx2-bin
```

:::

### Latest Git Version

::: code-group

```shell [sudo]
sudo pacman -S dae-git
```

```shell [root]
pacman -S dae-git
```

:::

After completing [Minimal configuration](/dae/start/minimal-configuration), see [Service management](/dae/start/service-management) to start, enable, reload or restart dae.

<!-- installation-0:end -->

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
