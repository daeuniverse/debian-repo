---
title: "Reload and suspend"
---

<div v-pre lang="en-US">

# Reload and suspend

dae supports reloading configuration and temporarily suspending traffic processing.

## Reload

Generally, dae won't interrupt connections when reloading configuration. And reloading is much faster than restarting. Reloading will also manually update all subscriptions simultaneously.

Usage:

::: code-group

```shell [sudo]
sudo dae reload
```

```shell [root]
dae reload
```

:::

## Suspend

Suspend dae temporarily:

::: code-group

```shell [sudo]
sudo dae suspend
```

```shell [root]
dae suspend
```

:::

## Resume

If you want to recover, use reload:

::: code-group

```shell [sudo]
sudo dae reload
```

```shell [root]
dae reload
```

:::

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/reload-and-suspend.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
