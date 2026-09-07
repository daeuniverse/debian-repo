---
title: "Run as a service"
---

<div v-pre lang="en-US">

# Run as a service

This guide applies to systems using [systemd](https://wiki.debian.org/systemd). It covers starting dae as a service and enabling it at boot.

## Prerequisites

### Optional Geo Data Files

For more convenient traffic split, dae relies on the following data sources, [geoip.dat](https://github.com/v2fly/geoip/releases/latest) and [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest).

::: code-group

```shell [sudo]
sudo mkdir -p /usr/local/share/dae/
pushd /usr/local/share/dae/
sudo curl -L -o geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat
sudo curl -L -o geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat
popd
```

```shell [root]
mkdir -p /usr/local/share/dae/
pushd /usr/local/share/dae/
curl -L -o geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat
curl -L -o geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat
popd
```

:::

### Configuration File

> **Note**: The config file is recommended to save under `/etc/dae`

Download the sample config file:

::: code-group

```shell [sudo]
sudo mkdir -p /etc/dae
sudo curl -L -o /etc/dae/config.dae https://github.com/daeuniverse/dae/raw/main/example.dae
sudo chmod 600 /etc/dae/config.dae
```

```shell [root]
mkdir -p /etc/dae
curl -L -o /etc/dae/config.dae https://github.com/daeuniverse/dae/raw/main/example.dae
chmod 600 /etc/dae/config.dae
```

:::

Before starting the service, edit `/etc/dae/config.dae` to set the network interfaces and subscription or node values. See [Minimal configuration](/dae/start/minimal-configuration).

## Download pre-compiled binaries

Releases are available in <https://github.com/daeuniverse/dae/releases>

> **Note**: If you would like to get a taste of new features, there are nightly (latest) builds available. Most of the time, newly proposed changes will be included in `PRs` and will be exported as cross-platform executable binaries in builds (GitHub Action Workflow Build). Noted that newly introduced features are sometimes buggy, do it at your own risk. However, we still highly encourage you to check out our latest builds as it may help us further analyze features stability and resolve potential bugs accordingly.

Nightly builds are available in <https://github.com/daeuniverse/dae/actions/workflows/build-nightly.yml>

::: code-group

```shell [sudo]
sudo chmod +x ./dae
sudo install -Dm755 dae /usr/bin/
```

```shell [root]
chmod +x ./dae
install -Dm755 dae /usr/bin/
```

:::

### Check the binary

```shell
# helper
dae --help
# check version
dae version
```

## Setup

::: code-group

```shell [sudo]
# download the sample systemd.service
sudo curl -L -o /etc/systemd/system/dae.service https://github.com/daeuniverse/dae/raw/main/install/dae.service
```

```shell [root]
# download the sample systemd.service
curl -L -o /etc/systemd/system/dae.service https://github.com/daeuniverse/dae/raw/main/install/dae.service
```

:::

### Start and enable the service

::: code-group

```shell [sudo]
sudo systemctl daemon-reload
sudo systemctl enable dae --now
sudo systemctl status dae
```

```shell [root]
systemctl daemon-reload
systemctl enable dae --now
systemctl status dae
```

:::

## Check System Logs

::: code-group

```shell [sudo]
sudo journalctl -xefu dae
```

```shell [root]
journalctl -xefu dae
```

:::

After completing [Minimal configuration](/dae/start/minimal-configuration), see [Service management](/dae/start/service-management) to start, enable, reload or restart dae.

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/run-as-daemon.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
