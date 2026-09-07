::: code-group

```sh [sudo]
sudo emerge --ask app-eselect/eselect-repository dev-vcs/git
sudo eselect repository add gentoo-zh git https://github.com/gentoo-zh/overlay.git
sudo emaint sync -r gentoo-zh
```

```sh [root]
emerge --ask app-eselect/eselect-repository dev-vcs/git
eselect repository add gentoo-zh git https://github.com/gentoo-zh/overlay.git
emaint sync -r gentoo-zh
```

:::

::: tip 已配置 overlay
如果已经配置 gentoo-zh，只需执行同步命令。镜像选择和手动配置方法见 [gentoo-zh overlay 文档](https://gentoozh.org/overlay/)。
:::
