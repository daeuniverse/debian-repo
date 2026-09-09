从软件源下载配置文件，其中带有 GPG 公钥地址。首次使用时 zypper 会询问是否信任该公钥。

::: code-group

```sh [sudo]
sudo curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [root]
curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

:::
