<div v-pre lang="zh-TW">

<!-- installation-1:start -->
# Docker

預建映像檔及相關文件位於 <https://hub.docker.com/r/daeuniverse/dae>。

或者，可使用 `docker compose`：

啟動容器前，在主機上完成 `/etc/dae/config.dae` 設定。Compose 檔案會將 `/etc/dae` 掛載至容器內。請參閱[最小設定](/zh-TW/dae/start/minimal-configuration)。

```shell
git clone --depth=1 https://github.com/daeuniverse/dae
cd dae
```

::: code-group

```shell [sudo]
sudo docker compose up -d --build
```

```shell [root]
docker compose up -d --build
```

:::
<!-- installation-1:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
