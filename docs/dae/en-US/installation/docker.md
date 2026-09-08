<div v-pre lang="en-US">

<!-- installation-1:start -->
# Docker

Pre-built image and related docs can be found at <https://hub.docker.com/r/daeuniverse/dae>.

Alternatively, you can use `docker compose`:

Before starting the container, configure `/etc/dae/config.dae` on the host. The Compose file mounts `/etc/dae` into the container. See [Minimal configuration](/dae/start/minimal-configuration).

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

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
