# Debian / Ubuntu

所有套件共用套件來源設定。已新增套件來源時，可直接選擇軟體安裝。以下指令統一使用 sudo。

## 1. 安裝 `curl`

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-1.md-->

## 2. 新增套件來源

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-2.md-->

## 3. 匯入 GPG 公鑰

<!--@include: @/.vitepress/snippets/repositories/zh-TW/debian-3.md-->

## 4. 選擇軟體

::: code-group

```sh [dae]
sudo apt update
sudo apt install dae
```

```sh [daed]
sudo apt update
sudo apt install daed
```

```sh [v2rayA]
sudo apt update
sudo apt install v2raya
```

```sh [v2ray]
sudo apt update
sudo apt install v2ray
```

```sh [Xray]
sudo apt update
sudo apt install xray
```

```sh [Juicity]
sudo apt update
sudo apt install juicity
```

```sh [Juicity-rs]
sudo apt update
sudo apt install juicity-rs
```

```sh [v2ray-rules-dat]
sudo apt update
sudo apt install v2ray-rules-dat
```

:::
