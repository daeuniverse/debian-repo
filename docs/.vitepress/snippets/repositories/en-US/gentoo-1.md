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

::: tip Already configured
If gentoo-zh is already configured, run only the synchronization command. Mirror selection and manual configuration are covered in the [gentoo-zh overlay guide](https://gentoozh.org/overlay/).
:::
