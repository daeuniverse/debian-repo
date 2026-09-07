# Nix / NixOS

The examples below cover the upstream README, including installation, package selection, maintenance, builds and caches. Use an existing NixOS flake configuration; retain your current Nixpkgs, system and hardware modules.

## 1. Import NixOS modules

Replace `HOSTNAME` with your configuration name. This example imports the dae module.

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

## 2. Enable dae

For daed, see the separate [daed Nix / NixOS](/daed/installation/nix) guide.

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

For dae, set exactly one of `configFile` and `config`. Add this external-file option inside `services.dae`, then prepare the file before applying the configuration:

```nix
configFile = "/etc/dae/config.dae";
```

Inline `config` is readable by all users through the Nix store. The firewall port must match `tproxy_port`. See [Minimal configuration](/dae/start/minimal-configuration) and the [dae](https://github.com/daeuniverse/flake.nix/blob/main/dae/module.nix) options.

## 3. Apply the system configuration

In the system flake directory, replace `HOSTNAME` and run:

::: code-group

```shell [sudo]
sudo nixos-rebuild switch --flake .#HOSTNAME
```

```shell [root]
nixos-rebuild switch --flake .#HOSTNAME
```

:::

The module manages systemd boot enablement; no separate `systemctl enable` is needed.

## Alternative: global packages

This is an alternative to the service module. Do not install another dae through `environment.systemPackages` while enabling `services.dae`. Replace `x86_64-linux` with `aarch64-linux` when appropriate.

```nix
# nixos configuration module
{
  environment.systemPackages =
    with inputs.daeuniverse.packages.x86_64-linux;
      [ dae ]; # or dae-unstable dae-experient
}
```

The upstream comment spells `dae-experient`; the README calls this variant `dae-experiment`. Inspect the actual outputs before selecting a variant.

## Package variants

| Package | Purpose |
| --- | --- |
| `dae` / `dae-release` | Release; `dae` aliases `dae-release` |
| `dae-unstable` | Tracks the dae main branch |
| `dae-experiment` | Experimental revision described upstream |

```shell
nix flake show github:daeuniverse/flake.nix
```

Historical tags include `refs/tags/dae-v0.8.0`. Experimental versions may contain defects.

## Maintainers: update packages

Run these examples from a checkout of the flake repository with its development tools available. `./main.nu` displays help. The blocks below preserve upstream templates; placeholders and the alternatives separated by `or` must be replaced before execution.

```
# usage
commands: [sync] <PROJECT> [<VERSION>] [--rev <REVISION>]
```

### Update release and unstable

```
./main.nu sync dae release unstable # or leave the last 2 args empty
```

### Update one version

```
./main.nu sync dae release # or unstable
```

### Add a version

```
./main.nu sync dae sth-new --rev 'rev_hash' or refs/heads/<branch> or refs/tags/v0.0.0
# after this will produce a new package called dae-sth-new
```

A version other than `release` or `unstable` reads `--rev`, fetches source information through `nix-prefetch-git`, adds metadata and updates `vendorHash`. The revision can be a SHA-1, branch ref or tag.

## Build locally

Run from the repository directory. These upstream templates require replacing `{project}` and `{{ pkg }}` with the intended package, such as dae.

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

### Check the binary

```bash
./result/bin/{{ pkg }} --version
```

## Optional: binary cache

The upstream garnix cache serves x86_64-linux and aarch64-linux builds. Merge these settings into the NixOS configuration.

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
