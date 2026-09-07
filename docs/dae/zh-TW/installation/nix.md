# Nix / NixOS

以下依上游 README 收錄安裝、版本選擇、維護指令碼、本地建置與快取範例。請合併至現有 NixOS flake，保留原有 Nixpkgs、系統與硬體設定。

## 1. 匯入 NixOS 模組

將 `HOSTNAME` 替換為設定名稱。此範例匯入 dae 模組。

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

## 2. 啟用 dae

如需安裝 daed，請參閱獨立的 [daed Nix / NixOS](/zh-TW/daed/installation/nix) 文件。

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

使用 dae 時，必須且只能設定 `configFile` 或 `config` 其中一項。在 `services.dae` 內加入以下外部檔案設定，並在套用設定前準備好檔案：

```nix
configFile = "/etc/dae/config.dae";
```

內嵌 `config` 會存入所有使用者可讀的 Nix store。防火牆連接埠應與 `tproxy_port` 一致。請參閱[最小設定](/zh-TW/dae/start/minimal-configuration)及 [dae](https://github.com/daeuniverse/flake.nix/blob/main/dae/module.nix) 模組選項。

## 3. 套用系統設定

在系統 flake 目錄中，將 `HOSTNAME` 替換為設定名稱後執行：

::: code-group

```shell [sudo]
sudo nixos-rebuild switch --flake .#HOSTNAME
```

```shell [root]
nixos-rebuild switch --flake .#HOSTNAME
```

:::

模組管理 systemd 開機啟動，無需另外執行 `systemctl enable`。

## 其他安裝方式：全域套件

此方式與服務模組二選一。啟用 `services.dae` 時，不要再透過 `environment.systemPackages` 安裝另一份 dae。依架構將 `x86_64-linux` 調整為 `aarch64-linux`。

```nix
# nixos configuration module
{
  environment.systemPackages =
    with inputs.daeuniverse.packages.x86_64-linux;
      [ dae ]; # or dae-unstable dae-experient
}
```

上游註解中的 `dae-experient` 與正文名稱 `dae-experiment` 不一致。選擇版本前，請檢查實際輸出。

## 版本選擇

| 套件 | 用途 |
| --- | --- |
| `dae`／`dae-release` | 發行版本，`dae` 是 `dae-release` 的別名 |
| `dae-unstable` | 跟隨 dae main 分支 |
| `dae-experiment` | 上游說明的實驗版本 |

```shell
nix flake show github:daeuniverse/flake.nix
```

歷史版本可使用標籤，如 `refs/tags/dae-v0.8.0`。實驗版本可能存在缺陷。

## 維護用途：更新套件

以下範例用於維護 flake 倉庫，需在倉庫目錄及其開發環境中執行。`./main.nu` 可顯示說明。下方保留上游範本；預留值及 `or` 分隔的候選值必須先替換，不能整行照抄。

```
# usage
commands: [sync] <PROJECT> [<VERSION>] [--rev <REVISION>]
```

### 更新 release 與 unstable

```
./main.nu sync dae release unstable # or leave the last 2 args empty
```

### 更新單一版本

```
./main.nu sync dae release # or unstable
```

### 加入版本

```
./main.nu sync dae sth-new --rev 'rev_hash' or refs/heads/<branch> or refs/tags/v0.0.0
# after this will produce a new package called dae-sth-new
```

版本名稱不是 `release` 或 `unstable` 時，指令碼讀取 `--rev`，透過 `nix-prefetch-git` 取得原始碼資訊，加入 metadata 記錄並更新 `vendorHash`。revision 可使用 SHA-1、分支引用或標籤。

## 本地建置

在倉庫目錄執行。以下上游範本中的 `{project}` 與 `{{ pkg }}` 需替換為目標套件，如 dae。

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

### 檢查二進位檔案

```bash
./result/bin/{{ pkg }} --version
```

## 可選：二進位快取

上游 garnix 快取提供 x86_64-linux 與 aarch64-linux 建置。將以下設定合併至 NixOS 設定。

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
