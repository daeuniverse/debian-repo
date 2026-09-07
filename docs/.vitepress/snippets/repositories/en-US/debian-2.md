The source config file is downloaded directly from the repository.

Choose the configuration matching your APT version; use one of these alternatives.

::: code-group

```sh [APT ≥ 3.0]
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
```

```sh [APT < 3.0]
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

:::
