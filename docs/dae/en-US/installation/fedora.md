# Fedora / RHEL

For Fedora and RHEL.

The commands below assume sudo is configured for your account.

## 1. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/fedora-1.md-->

## 2. Install dae

::: code-group

```sh [sudo]
sudo dnf install dae
```

```sh [root]
dnf install dae
```

:::

:::: details Alternative: Fedora Copr

<div v-pre lang="en-US">

<!-- installation-4:start -->
For Fedora only. Use this instead of the Dae Universe repository above. [`zhullyb/v2rayA`](https://copr.fedorainfracloud.org/coprs/zhullyb/v2rayA/package/dae) is the Copr project name; the package installed is `dae`.

::: code-group

```shell [sudo]
sudo dnf copr enable zhullyb/v2rayA
sudo dnf install dae
```

```shell [root]
dnf copr enable zhullyb/v2rayA
dnf install dae
```

:::
<!-- installation-4:end -->

</div>

::::

The package includes a systemd service. The example is `/etc/dae/example.dae`; save your configuration as `/etc/dae/config.dae`.

After completing [Minimal configuration](/dae/start/minimal-configuration), see [Service management](/dae/start/service-management) to start, enable, reload or restart dae.


---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
