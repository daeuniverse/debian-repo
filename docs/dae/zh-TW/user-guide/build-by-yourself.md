---
title: "從原始碼建置"
---

<div v-pre lang="zh-TW">

# 從原始碼建置

## 建置

### 建置相依套件

```text
clang >= 10
llvm >= 10 (optional)
golang >= 1.26.0
make
```

工具鏈需求取決於原始碼版本。本次收錄版本使用 Go 1.26.0，請核對對應的 [go.mod](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/go.mod) 與[建置工作流程](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/.github/workflows/seed-build.yml)。

### 編譯

```shell
git clone https://github.com/daeuniverse/dae.git
cd dae
git submodule update --init
```

選擇一種建置方式：

::: code-group

```shell [最少相依套件]
## Minimal dependency build
make GOFLAGS="-buildvcs=false" \
  CLANG=clang
```

```shell [一般建置]
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

## 執行

### 執行階段相依套件

為了進行流量分流，dae 仰賴下列資料來源：[geoip.dat](https://github.com/v2fly/geoip/releases/latest) 和 [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest)。

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

### 執行

下載範例設定檔：

```shell
curl -L -o example.dae https://github.com/daeuniverse/dae/raw/main/example.dae
```

請參閱 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

完成微調後，執行 dae：

::: code-group

```shell [sudo]
sudo ./dae run -c example.dae
```

```shell [root]
./dae run -c example.dae
```

:::

> **注意**：或者，你可以將 dae 作為常駐程式（systemd）服務執行。請查看[常駐程式服務指南](/zh-TW/dae/user-guide/run-as-daemon)瞭解詳情。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/build-by-yourself.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
