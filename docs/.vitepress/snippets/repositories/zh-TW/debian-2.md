從套件來源下載設定檔。

依 APT 版本選擇一種設定，不要同時新增兩種。

::: code-group

```sh [APT ≥ 3.0 · sudo]
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
```

```sh [APT ≥ 3.0 · root]
curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
```

```sh [APT < 3.0 · sudo]
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

```sh [APT < 3.0 · root]
curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

:::
