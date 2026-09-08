---
title: "作为服务运行"
---

<div v-pre lang="zh-CN">

# 作为服务运行

本指南适用于使用 [systemd](https://wiki.debian.org/systemd) 的系统，说明如何启动 dae 服务并设置开机自动启动。

## 前提条件

### 可选的 Geo 数据文件

为了更方便地进行流量分流，dae 依赖以下数据源：[geoip.dat](https://github.com/v2fly/geoip/releases/latest) 和 [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest)。

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

### 配置文件

> **注意**：建议将配置文件保存在 `/etc/dae` 下

下载示例配置文件：

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

启动服务前，编辑 `/etc/dae/config.dae`，设置网络接口、订阅或节点。参见[最小配置](/zh-CN/dae/start/minimal-configuration)。

## 下载预编译二进制文件

发布版本位于 <https://github.com/daeuniverse/dae/releases>

> **注意**：如果你想体验新功能，可以使用夜间（最新）构建。大多数时候，新提出的变更会包含在 `PRs` 中，并会在构建（GitHub Action Workflow Build）中导出为跨平台可执行二进制文件。请注意，新引入的功能有时存在错误，风险由你自行承担。不过，我们仍强烈鼓励你查看最新构建，因为这可能有助于我们进一步分析功能稳定性并相应地解决潜在错误。

夜间构建位于 <https://github.com/daeuniverse/dae/actions/workflows/build-nightly.yml>

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

### 检查可执行文件

```shell
# helper
dae --help
# check version
dae version
```

## 设置

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

### 启动并启用服务

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

## 检查系统日志

::: code-group

```shell [sudo]
sudo journalctl -xefu dae
```

```shell [root]
journalctl -xefu dae
```

:::

完成[最小配置](/zh-CN/dae/start/minimal-configuration)后，请参阅[服务管理](/zh-CN/dae/start/service-management)，启动 dae、设置开机启动、重载或重新启动服务。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/run-as-daemon.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
