# Debian / Ubuntu

For Debian, Ubuntu and other APT-based distributions.

The commands below assume sudo is configured for your account.

## 1. Install `curl`

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-1.md-->

## 2. Add the repository

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-2.md-->

## 3. Import the GPG key

<!--@include: @/.vitepress/snippets/repositories/en-US/debian-3.md-->

## 4. Install dae

::: code-group

```sh [sudo]
sudo apt update
sudo apt install dae
```

```sh [root]
apt update
apt install dae
```

:::

The package includes a systemd service. The example is `/etc/dae/example.dae`; save your configuration as `/etc/dae/config.dae`.

After completing [Minimal configuration](/dae/start/minimal-configuration), see [Service management](/dae/start/service-management) to start, enable, reload or restart dae.
