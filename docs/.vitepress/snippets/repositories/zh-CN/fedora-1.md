从软件源下载配置文件，其中带有 GPG 公钥地址。首次使用时 DNF 会询问是否导入公钥。

::: code-group

```sh [sudo]
sudo curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [root]
curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

:::
