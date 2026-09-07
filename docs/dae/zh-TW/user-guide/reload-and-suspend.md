---
title: "重新載入與暫停"
---

<div v-pre lang="zh-TW">

# 重新載入與暫停

dae 支援重新載入設定和暫停流量處理。

## 重新載入

通常，dae 在重新載入設定的過程中不會中斷既有連線。重新載入的速度也比重新啟動快得多。重新載入還會同時手動更新全部訂閱。

用法：

::: code-group

```shell [sudo]
sudo dae reload
```

```shell [root]
dae reload
```

:::

## 暫停

暫停 dae：

::: code-group

```shell [sudo]
sudo dae suspend
```

```shell [root]
dae suspend
```

:::

## 恢復

如果想復原，請使用重新載入：

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

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/reload-and-suspend.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
