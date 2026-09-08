# Nix / NixOS

以下按上游 README 收录安装、版本选择、维护脚本、本地构建与缓存案例。请合并到现有 NixOS flake，保留原有 Nixpkgs、系统与硬件配置。

## 1. 导入 NixOS 模块

将 `HOSTNAME` 替换为配置名称。此示例导入 dae 模块。

```nix
# flake.nix

{
  inputs.daeuniverse.url = "github:daeuniverse/flake.nix";
  # ...

  outputs = {nixpkgs, ...} @ inputs: {
    nixosConfigurations.HOSTNAME = nixpkgs.lib.nixosSystem {
      modules = [
        inputs.daeuniverse.nixosModules.dae
      ];
    };
  };
}
```

## 2. 启用 dae

如需安装 daed，请参阅独立的 [daed Nix / NixOS](/zh-CN/daed/installation/nix) 文档。

```nix
# nixos configuration module
{
  # ...

  services.dae = {
      enable = true;

      openFirewall = {
        enable = true;
        port = 12345;
      };

      # `configFile` or `config` must be set

      /* default options

      package = inputs.daeuniverse.packages.x86_64-linux.dae;
      disableTxChecksumIpGeneric = false;
      assets = with pkgs; [ v2ray-geoip v2ray-domain-list-community ];

      */

      # alternative of `assets`, a dir contains geo database.
      # assetsPath = "/etc/dae";
  };
}
```

使用 dae 时，必须且只能设置 `configFile` 或 `config` 中的一项。在 `services.dae` 内添加以下外部文件设置，并在应用配置前准备好文件：

```nix
configFile = "/etc/dae/config.dae";
```

内联 `config` 会存入所有用户可读的 Nix store。防火墙端口应与 `tproxy_port` 一致。参见[最小配置](/zh-CN/dae/start/minimal-configuration)及 [dae](https://github.com/daeuniverse/flake.nix/blob/main/dae/module.nix) 模块选项。

## 3. 应用系统配置

在系统 flake 目录中，将 `HOSTNAME` 替换为配置名称后执行：

::: code-group

```shell [sudo]
sudo nixos-rebuild switch --flake .#HOSTNAME
```

```shell [root]
nixos-rebuild switch --flake .#HOSTNAME
```

:::

模块管理 systemd 开机启动，无需另外执行 `systemctl enable`。

## 其他安装方式：全局软件包

此方式与服务模块二选一。启用 `services.dae` 时，不要再通过 `environment.systemPackages` 安装另一份 dae。按架构将 `x86_64-linux` 调整为 `aarch64-linux`。

```nix
# nixos configuration module
{
  environment.systemPackages =
    with inputs.daeuniverse.packages.x86_64-linux;
      [ dae ]; # or dae-unstable dae-experient
}
```

上游注释中的 `dae-experient` 与正文名称 `dae-experiment` 不一致。选择版本前，请检查实际输出。

## 版本选择

| 软件包 | 用途 |
| --- | --- |
| `dae`／`dae-release` | 发行版本，`dae` 是 `dae-release` 的别名 |
| `dae-unstable` | 跟随 dae main 分支 |
| `dae-experiment` | 上游说明的实验版本 |

```shell
nix flake show github:daeuniverse/flake.nix
```

历史版本可使用标签，如 `refs/tags/dae-v0.8.0`。实验版本可能存在缺陷。

## 维护用途：更新软件包

以下示例用于维护 flake 仓库，需在仓库目录及其开发环境中执行。`./main.nu` 可显示帮助。下方保留上游模板；占位符及 `or` 分隔的候选值必须先替换，不能整行照抄。

```
# usage
commands: [sync] <PROJECT> [<VERSION>] [--rev <REVISION>]
```

### 更新 release 与 unstable

```
./main.nu sync dae release unstable # or leave the last 2 args empty
```

### 更新单个版本

```
./main.nu sync dae release # or unstable
```

### 添加版本

```
./main.nu sync dae sth-new --rev 'rev_hash' or refs/heads/<branch> or refs/tags/v0.0.0
# after this will produce a new package called dae-sth-new
```

版本名不是 `release` 或 `unstable` 时，脚本读取 `--rev`，通过 `nix-prefetch-git` 获取源码信息，添加 metadata 记录并更新 `vendorHash`。revision 可使用 SHA-1、分支引用或标签。

## 本地构建

在仓库目录执行。以下上游模板中的 `{project}` 与 `{{ pkg }}` 需替换为目标软件包，如 dae。

### just

```bash
# Build the package of the latest release version
just build {project}
# e.g. just build dae
# Build the package of the latest unstable version
just build {project}-unstable
# e.g. just build dae-unstable
```

### nix build

```bash
nix build .#{project}
# e.g. nix build .#dae
nix build .#dae-unstable
# e.g. nix build .#dae-unstable
```

### just version

```bash
just version {project}
# e.g. just version dae
```

### 检查二进制文件

```bash
./result/bin/{{ pkg }} --version
```

## 可选：二进制缓存

上游 garnix 缓存提供 x86_64-linux 与 aarch64-linux 构建。将以下设置合并到 NixOS 配置。

```nix
nix.settings = {
  substituters = ["https://cache.garnix.io"];
  trusted-public-keys = [
    "cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g="
  ];
};
```

---

[daeuniverse/flake.nix README](https://github.com/daeuniverse/flake.nix#readme) · [ISC](https://github.com/daeuniverse/flake.nix/blob/main/LICENSE)
