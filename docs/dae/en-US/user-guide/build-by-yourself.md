---
title: "Build from source"
---

<div v-pre lang="en-US">

# Build from source

## Build

### Make Dependencies

```text
clang >= 10
llvm >= 10 (optional)
golang >= 1.26.0
make
```

Toolchain requirements depend on the source revision. This snapshot uses Go 1.26.0; consult its [go.mod](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/go.mod) and [build workflow](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/.github/workflows/seed-build.yml).

### Compilation

```shell
git clone https://github.com/daeuniverse/dae.git
cd dae
git submodule update --init
```

Choose one build method:

::: code-group

```shell [Minimal dependencies]
## Minimal dependency build
make GOFLAGS="-buildvcs=false" \
  CLANG=clang
```

```shell [Normal build]
## Normal build
make
```

```shell [ARMv7]
## Cross compile
# To armv7 CPU architect:
make CGO_ENABLED=0 GOARCH=arm GOARM=7
```

```shell [MIPS]
# To mips CPU architect:
make CGO_ENABLED=0 GOARCH=mips
```

:::

## Run

### Runtime Dependencies

For traffic splitting, dae relies on the following data sources, [geoip.dat](https://github.com/v2fly/geoip/releases/latest) and [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest).

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

### Run

Download the example config file:

```shell
curl -L -o example.dae https://github.com/daeuniverse/dae/raw/main/example.dae
```

See [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae).

After fine tuning, run dae:

::: code-group

```shell [sudo]
sudo ./dae run -c example.dae
```

```shell [root]
./dae run -c example.dae
```

:::

> **Note**: Alternatively, you may run dae as a daemon (systemd) service. Check out more details [HERE](/dae/user-guide/run-as-daemon).

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/build-by-yourself.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
