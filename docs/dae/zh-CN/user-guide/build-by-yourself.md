---
title: "从源代码构建"
---

<div v-pre lang="zh-CN">

# 从源代码构建

## 构建

### 构建依赖

```text
clang >= 10
llvm >= 10 (optional)
golang >= 1.26.0
make
```

工具链要求取决于源码版本。本次收录版本使用 Go 1.26.0，请核对对应的 [go.mod](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/go.mod) 与[构建工作流](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/.github/workflows/seed-build.yml)。

### 编译

```shell
git clone https://github.com/daeuniverse/dae.git
cd dae
git submodule update --init
```

选择一种构建方式：

::: code-group

```shell [最小依赖]
## Minimal dependency build
make GOFLAGS="-buildvcs=false" \
  CLANG=clang
```

```shell [普通构建]
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

## 运行

### 运行时依赖

为了进行流量分流，dae 依赖以下数据源：[geoip.dat](https://github.com/v2fly/geoip/releases/latest) 和 [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest)。

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

### 运行

下载示例配置文件：

```shell
curl -L -o example.dae https://github.com/daeuniverse/dae/raw/main/example.dae
```

请参阅 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

完成微调后，运行 dae：

::: code-group

```shell [sudo]
sudo ./dae run -c example.dae
```

```shell [root]
./dae run -c example.dae
```

:::

> **注意**：或者，你可以将 dae 作为守护进程（systemd）服务运行。请查看[守护进程服务指南](/zh-CN/dae/user-guide/run-as-daemon)了解详情。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/build-by-yourself.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
