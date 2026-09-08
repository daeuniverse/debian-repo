<div v-pre lang="zh-CN">

<!-- installation-1:start -->
# Docker

预构建镜像及相关文档位于 <https://hub.docker.com/r/daeuniverse/dae>。

或者，可以使用 `docker compose`：

启动容器前，在主机上完成 `/etc/dae/config.dae` 配置。Compose 文件会将 `/etc/dae` 挂载到容器内。参见[最小配置](/zh-CN/dae/start/minimal-configuration)。

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

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
