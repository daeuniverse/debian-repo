---
title: "重载与暂停"
---

<div v-pre lang="zh-CN">

# 重载与暂停

dae 支持重载配置和临时暂停流量处理。

## 重载

一般情况下，dae 在重载配置的过程中不会中断现有连接。重载的速度也比重启快得多。重载还会同时手动更新全部的订阅。

用法：

::: code-group

```shell [sudo]
sudo dae reload
```

```shell [root]
dae reload
```

:::

## 挂起

临时暂停 dae：

::: code-group

```shell [sudo]
sudo dae suspend
```

```shell [root]
dae suspend
```

:::

## 恢复

如果想恢复，请使用重载：

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

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/reload-and-suspend.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
