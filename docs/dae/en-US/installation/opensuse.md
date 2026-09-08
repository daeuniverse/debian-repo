# openSUSE

For openSUSE.

The commands below assume sudo is configured for your account.

## 1. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/opensuse-1.md-->

## 2. Install dae

::: code-group

```sh [sudo]
sudo zypper install dae
```

```sh [root]
zypper install dae
```

:::

The package includes a systemd service. The example is `/etc/dae/example.dae`; save your configuration as `/etc/dae/config.dae`.

After completing [Minimal configuration](/dae/start/minimal-configuration), see [Service management](/dae/start/service-management) to start, enable, reload or restart dae.
