從套件來源下載設定檔，其中帶有 GPG 公鑰位址。首次使用時 DNF 會詢問是否匯入公鑰。

::: code-group

```sh [sudo]
sudo curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [root]
curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

:::
