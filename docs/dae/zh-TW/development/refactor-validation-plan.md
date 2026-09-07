---
title: "重構驗證計畫"
---

<div v-pre lang="zh-TW">

# 重構驗證計畫

本文件將「重構路線」落實為可執行的驗證清單，避免後續變更僅停留在架構討論層面。

目標有三項：

- 在實際重構前，先以契約測試固定高風險邊界。
- 將新增與既有測試對應至具體階段，降低回歸風險。
- 為每個階段提供最小可執行的測試命令，以便逐步推進。

## 驗證原則

- 先驗證錯誤邊界，再驗證生命週期邊界，最後驗證模型邊界。
- 每個階段至少保留一組可獨立執行的 targeted tests，不依賴完整的 `go test ./...`。
- 新增測試優先涵蓋重構前後都必須保持穩定的行為，不涵蓋一次性實作細節。
- 不要在同一階段混合行為重構與結構重構；先以測試鎖定行為，再移動程式碼。

## 階段 1：收緊 Config 邊界

目標：

- 將高層 `panic` 路徑改為回傳 `error`。
- 固定 `FunctionOrString` / `FunctionListOrString` 的契約行為。
- 讓 builder / policy 收到非法 union 值時回傳錯誤，而不是崩潰。

新增測試：

- [config/function_union_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/config/function_union_test.go)
  - `TestFunctionOrStringToFunction`
  - `TestFunctionListOrStringToFunctionList`
  - `TestPatchMustOutboundFallback`
- [component/dns/fallback_contract_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/dns/fallback_contract_test.go)
  - `TestRequestMatcherBuilderRejectsInvalidFallbackType`
  - `TestResponseMatcherBuilderRejectsInvalidFallbackType`
- [component/outbound/dialer_selection_policy_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer_selection_policy_test.go)
  - `TestNewDialerSelectionPolicyFromGroupParamRejectsInvalidPolicyType`
- [control/routing_matcher_builder_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/routing_matcher_builder_test.go)
  - `TestRoutingMatcherBuilderRejectsInvalidFallbackType`

既有輔助測試：

- [config/marshal_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/config/marshal_test.go)
- [pkg/config_parser/config_parser_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/pkg/config_parser/config_parser_test.go)

建議命令：

```bash
go test ./config/... ./pkg/config_parser/... ./component/dns/... ./component/outbound/... ./control/... -run 'FunctionOrString|FunctionListOrString|FallbackType|SelectionPolicy'
```

通過標準：

- 所有非法 union 輸入都回傳 `error`。
- 不再依賴 `panic` 表示設定層的高階錯誤。

## 階段 2：分離 DNS 長短期狀態

目標：

- 分離 `DnsController` 中的長期狀態與 generation runtime。
- 繼續支援在 reload 期間復用 DNS cache / forwarder warm state。
- 避免舊 generation context 取消後，復用的 worker 異常結束。

既有關鍵測試：

- [control/dns_controller_reload_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_controller_reload_test.go)
  - `TestDnsController_RuntimeWorkersSurviveContextCancel`
- [control/dns_forwarder_cache_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_forwarder_cache_test.go)
- [control/dns_singleflight_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_singleflight_test.go)
- [control/dns_control_cache_cleanup_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_control_cache_cleanup_test.go)
- [control/dns_cache_scope_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_cache_scope_test.go)

建議命令：

```bash
go test ./control/... -run 'DnsController|dns.*reload|dns.*forwarder|dns.*singleflight|dns.*cache'
```

通過標準：

- DNS runtime 更新後，取消舊 context 不會終止共用 worker。
- DNS cache / forwarder 的生命週期語意維持不變。

## 階段 3：將 ControlPlane 降級為 facade

目標：

- 從 `ControlPlane` 抽離 datapath janitor 與 DNS runtime handoff。
- 維持 reload / retirement / drain 語意不變。

既有關鍵測試：

- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_drain_test.go)
  - `TestReuseDNSControllerFromUpdatesRuntime`
  - `TestReuseDNSListenerFromTransfersOwnership`
  - `TestReuseDNSListenerFromRejectsProtocolMismatch`
- [control/control_plane_janitor_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_janitor_test.go)
- [control/control_plane_shutdown_udp_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_shutdown_udp_test.go)
- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_drain_test.go)

建議命令：

```bash
go test ./control/... ./cmd/... -run 'ReuseDNS|Drain|Janitor|Shutdown|Retirement'
```

通過標準：

- `ControlPlane` 拆分後，新舊 generation handoff 語意維持不變。
- janitor 停止與 retirement cleanup 仍可如預期完成。

## 階段 4：從 cmd/run 下沉 Runner / ReloadManager

目標：

- 將 staged reload、handoff 與 retirement 排隊邏輯從 CLI 進入點下沉。
- 維持外部 CLI 行為不變。

既有關鍵測試：

- [cmd/run_shutdown_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/run_shutdown_test.go)
- [cmd/reload_progress_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/reload_progress_test.go)
- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_drain_test.go)

建議命令：

```bash
go test ./cmd/... ./control/... -run 'Reload|Progress|Shutdown|Handoff'
```

通過標準：

- CLI 行為維持不變。
- reload busy / handoff / retirement 的狀態轉換維持不變。

## 階段 5：Routing IR

目標：

- 引入統一的 normalized rule IR。
- 讓各 matcher / backend 從 IR lowering，而不是各自直接解讀 parser rules。

既有關鍵測試：

- [component/routing/optimizer_contract_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/routing/optimizer_contract_test.go)
- [component/dns/request_rule_split_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/dns/request_rule_split_test.go)
- [component/daedns/router_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/daedns/router_test.go)
- [control/routing_matcher_builder_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/routing_matcher_builder_test.go)

建議命令：

```bash
go test ./component/routing/... ./component/dns/... ./component/daedns/... ./control/... -run 'Routing|Rule|Matcher|Optimizer'
```

通過標準：

- 規則正規化後，DNS/request/response/control backend 的語意不漂移。
- 相同規則輸入在不同 backend 上的 fallback / outbound 行為維持一致。

## 階段 6：明確化 Dialer 健康模型

目標：

- 以明確的 health domain API 封裝內部索引模型。
- 維持 UDP data fallback、reload snapshot 與 recovery backoff 語意不變。

既有關鍵測試：

- [component/outbound/dialer/recovery_bugs_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer/recovery_bugs_test.go)
- [component/outbound/dialer_group_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer_group_test.go)
- [control/dial_family_fallback_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dial_family_fallback_test.go)
- [control/udp_dial_guard_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/udp_dial_guard_test.go)

建議命令：

```bash
go test ./component/outbound/... ./component/outbound/dialer/... ./control/... -run 'Recovery|Snapshot|DialerGroup|UDP.*fallback|dial.*guard'
```

通過標準：

- `ReloadHealthSnapshot` / `RestoreHealthSnapshot` 語意維持不變。
- UDP data-plane fallback 仍可回退至 DNS UDP / TCP 健康域。

## 建議執行順序

建議依下列順序推進，完成每個階段後都保留可長期停留的穩定點：

1. 階段 1：收緊 Config 邊界
2. 階段 2：分離 DNS 長短期狀態
3. 階段 3：將 ControlPlane 降級為 facade
4. 階段 4：下沉 Runner / ReloadManager
5. 階段 5：Routing IR
6. 階段 6：明確化 Dialer 健康模型

## 審閱檢查表

每個重構 PR 在審閱時至少回答下列問題：

- 這次變更是否引入新的狀態擁有者？
- 如果有復用物件，復用的是「物件」還是「狀態」？
- 既有 targeted tests 是否涵蓋變更邊界？
- 是否在同一提交混合行為變更與結構變更？
- 是否留下新的雙重狀態來源或新的隱性生命週期耦合？

## 目前已完成的第一步

本次已完成：

- 將 config union helper 從 `panic` 改為回傳 `error`
- 為 fallback / policy / routing builder 新增非法 union 輸入的契約測試
- 建立本驗證文件，作為後續重構的執行與回歸基準

## 目前已完成的第二步

本次繼續完成：

- 刪除 `DnsController` 的 legacy runtime 欄位與 fallback 讀取路徑，統一以 `runtimeState` 作為單一真相來源
- 新增 [control/dns_runtime_test_helpers_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_runtime_test_helpers_test.go) 作為測試期間的 runtime 建構輔助，避免測試繼續依賴已移除的 legacy 欄位
- 將 DNS 相關測試遷移至 `runtimeState` 建構方式，並以 `go test ./control/...` 驗證行為沒有回歸

## 目前已完成的第三步

本次繼續完成：

- 在 [control/dns_control.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_control.go) 中抽出 `dnsControllerStore`，將 `dnsCache`、`dnsForwarderCache`、janitor/evictor 狀態、BPF update worker 狀態，以及 preference wait registry 統一收斂為長期狀態擁有者
- 調整 [control/dns_preference_wait_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_preference_wait_test.go)、[control/dns_lru_e2e_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_lru_e2e_test.go)、[control/dns_control_cache_cleanup_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_control_cache_cleanup_test.go)、[control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_drain_test.go) 與 [control/control_plane_real_domain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_real_domain_test.go) 等測試，使其明確初始化 `dnsControllerStore`，固定長期狀態歸屬遷移後的建構方式
- 在 [control/dns_runtime_test_helpers_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_runtime_test_helpers_test.go) 中新增 `newTestDnsControllerStore`，為後續繼續分離 DNS 長期狀態與 generation runtime 提供統一測試進入點
- 以以下命令驗證此步驟只變更狀態歸屬，不變更行為：

```bash
go test ./control/...
go test ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

## 目前已完成的第四步

本次繼續完成：

- 在 [control/dns_control.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_control.go) 中，將 `DnsController` 對 `dnsControllerStore` 的持有從值語意切換為共用指標語意，並新增 `sharedStoreFacade()`，讓後續 reload 可建立新的 controller facade，同時繼續復用長期 DNS state
- 在 [control/control_plane.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane.go) 中，將 `ReuseDNSControllerFrom` 改為「重新整理舊 facade runtime，再建立共用 store 的新 facade 並交給新 generation」，不再繼續於新舊 generation 間直接轉移同一個 `DnsController` 物件
- 在 [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_drain_test.go) 中固定新的 handoff 契約：
  - 新舊 generation 共用 active DNS controller facade
  - 新 facade 與舊 facade 不是同一個物件
  - 兩者共用同一個 `dnsControllerStore`
  - 舊 facade 的 runtime 也會先更新至新 generation，避免 reload 交接窗口內的舊參照繼續持有舊 runtime
- 將 [control/dns_runtime_test_helpers_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_runtime_test_helpers_test.go) 的預設測試 store 調整為最小形式，避免預設測試建構誤引入未啟動的 evictor queue，並維持原有同步 callback 語意
- 以以下命令驗證 facade 分離後行為沒有回歸：

```bash
go test ./control/...
go test ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

本輪補充驗證：

```bash
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

## 目前已完成的第五步

本次繼續完成：

- 在 [control/dns_control.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_control.go) 中，將 `DnsController` 的 generation-local 行為設定重新整理納入 `UpdateRuntime` / `ReuseForReload`：
  - `qtypePrefer`
  - `optimisticCacheEnabled`
  - `optimisticCacheTtl`
  - `maxCacheSize`
- 將上述行為設定改為原子讀寫，修正 reload 更新與 janitor / lookup 並行存取時的 data race，避免「runtime 指標已切換，但行為設定仍沿用舊 generation 值」的隱性不一致
- 讓 `UpdateRuntime` 與 `ReuseForReload` 對非法 `IpVersionPrefer` 明確回傳 `error`，而不是靜默接受無效 runtime 設定
- 為此補充並更新下列測試：
  - [control/dns_controller_reload_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_controller_reload_test.go)：新增 reload 後行為設定同步重新整理的契約測試，以及非法 `IpVersionPrefer` 的失敗契約測試
  - [control/dns_cache_race_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_cache_race_test.go)：將 `singleflight` 並行場景收斂為確定性 barrier，固定 `-race` 下的 singleflight 契約，避免測試本身因時序過鬆而誤報
  - [control/dns_preference_wait_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_preference_wait_test.go)、[control/dns_lru_e2e_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_lru_e2e_test.go)、[control/dns_control_cache_cleanup_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_control_cache_cleanup_test.go)：更新為原子欄位存取方式，確保測試建構與 runtime 實作一致

本輪最終驗證：

```bash
go test ./control/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

結論：

- 目前這輪圍繞 config 邊界、`DnsController` 狀態分層、reload facade handoff 與 runtime 行為設定同步的重構已完整完成。
- 一般回歸與 `-race` 回歸均已通過，可作為下一批 `ControlPlane` facade 化或更深層 routing / dialer 重構前的穩定基準。

## 目前已完成的第六步

本次繼續完成：

- 新增 [control/dns_runtime.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_runtime.go)，將原先散落在 `ControlPlane` 根物件上的 DNS orchestration 狀態正式收斂為 `controlPlaneDNSRuntime`：
  - `dnsController`
  - `dnsRouting`
  - `dnsFixedDomainTtl`
  - `dnsListener`
  - prepared start/reuse hook
  - upstream ready/available channel 與 once
  - deferred DNS listener start 狀態
- 在 [control/control_plane.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane.go) 中，將下列 DNS 生命週期方法改為委派至 runtime：
  - `CloneDnsCache`
  - `ActiveDnsController`
  - `DetachDnsController`
  - `StopDNSListener`
  - `RestartDNSListener`
  - `ReuseDNSListenerFrom`
  - `ReuseDNSControllerFrom`
  - `SetPreparedDNSStartHook`
  - `SetPreparedDNSReuseHook`
  - `WaitDNSUpstreamsReady`
  - `WaitDNSUpstreamAvailable`
  - `StartPreparedDNSListener`
- 將 `releaseRetainedState` 中 DNS 相關清理切換為由 runtime 統一釋放，減少 `ControlPlane` 根物件直接持有與逐項回收 DNS 子系統狀態
- 維持外部行為不變，只調整狀態 owner 與方法歸屬，為後續繼續將 `ControlPlane` 降級為 facade 做準備

本次同步調整的測試：

- [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_drain_test.go)：更新為明確建構 `controlPlaneDNSRuntime`，固定 DNS listener/controller handoff 與 prepared start/reuse hook 的新 owner 邊界

本輪驗證：

```bash
go test ./control/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

結論：

- `ControlPlane` 已開始從「直接持有所有 DNS 細節」的大型物件，轉向「組合內部 DNS runtime 並委派生命週期操作」的形式。
- 此步驟仍是純粹的邊界重排，未引入新的 DNS 執行語意；一般回歸與 `-race` 回歸均已通過。

## 目前已完成的第七步

本次繼續完成：

- 新增 [config/decode.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/config/decode.go)，將 `Config.New()` 根部的 section 分派從「反射走訪整個 `Config` 結構」改為明確的 decoder registry：
  - `global`
  - `subscription`
  - `node`
  - `group`
  - `routing`
  - `dns`
- 在 [config/config.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/config/config.go) 中明確化根部必填 section 驗證與 parse 順序，讓後續逐節替換反射 parser 時，不再需要先變更 `Config.New()` 的主要控制流程
- 保留既有 section 級 `SectionParser` / `ParamParser` 行為，因此此步驟只是在根進入點收緊邊界，不變更 DSL 語意
- 新增 [config/decode_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/config/decode_test.go)，固定明確的 section decoder 分派路徑與 unknown section 錯誤邊界

本輪驗證：

```bash
go test ./config/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

結論：

- `Config.New()` 已不再依賴根部反射掃描決定 section 解析進入點。
- 關鍵 section 的 decoder 邊界已明確化，為後續繼續替換 `routing` / `dns` / `group` 的內部反射解析奠定基礎。

## 目前已完成的第八步

本次繼續完成：

- 新增 [control/generation_state.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/generation_state.go)，將 `ControlPlane` 中明顯屬於 generation 生命週期的狀態收斂為 `controlPlaneGenerationState`：
  - `outbounds`
  - `referencedOutbounds`
  - `dialMode`
  - `routingMatcher`
  - `bootstrapResolvers`
- 新增 [control/datapath_janitor.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/datapath_janitor.go)，將 datapath janitor 的 owner 狀態收斂為 `controlPlaneDatapathJanitor`：
  - stop/done/once/started 狀態
  - cleanup mutex
  - janitor scratch buffers
- 在 [control/control_plane.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane.go) 中將上述狀態改為內部物件持有，並讓 `releaseRetainedState()`、scratch 取得與初始化路徑統一委派至新 owner
- 更新 [control/control_plane_drain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_drain_test.go)、[control/control_plane_janitor_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_janitor_test.go)、[control/control_plane_real_domain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane_real_domain_test.go)、[control/dscp_routing_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dscp_routing_test.go)、[control/mac_routing_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/mac_routing_test.go)、[control/metadata_routing_chain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/metadata_routing_chain_test.go)、[control/dial_family_fallback_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dial_family_fallback_test.go)、[control/udp_reuse_simulation_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/udp_reuse_simulation_test.go) 的建構方式，使測試明確呈現新的 owner 邊界

本輪驗證：

```bash
go test ./config/... ./control/...
go test ./...
go test -race ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

結論：

- `ControlPlane` 已進一步從「所有 generation / datapath 狀態都直接堆疊在根物件」的形式，推進至「根物件組合 generation state、dns runtime、datapath janitor」的形式。
- 此步驟仍是所有權與生命週期邊界重排，未引入新的 datapath 清理語意；一般回歸與 `-race` 回歸均已通過。

## 目前已完成的第九步

本次繼續完成：

- 新增 [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/reload_manager.go)，將原先散落在 `cmd/run.go` 的 reload 排隊、staged handoff、retirement、progress/pprof 重新整理邏輯收斂為 `reloadManager`
- 新增 [cmd/runner.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/runner.go)，讓進入層從「一個超大的 `Run` 函式」轉為 `Runner + ReloadManager` 組合；[cmd/run.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/run.go) 現在只負責組裝 `Runner` 並委派執行
- 更新 [cmd/run_shutdown_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/run_shutdown_test.go) 的 reload manager 契約測試，固定：
  - shutdown handoff 會優先消耗 pending staged handoff
  - queued reload request 只保留最新的請求時間戳記

本輪驗證：

```bash
go test ./cmd/... ./control/...
go test ./...
go test -race ./cmd/... ./control/... ./component/dns/... ./component/outbound/... ./config/... ./pkg/config_parser/...
```

結論：

- `cmd/run` 的生命週期狀態機已不再完全寄居於進入函式本體。
- staged reload / handoff / retirement 的 owner 邊界已轉為 `Runner` 與 `ReloadManager` 組合，後續繼續下沉時不必再直接從 CLI 控制流程拆分。

## 目前已完成的第十步

本次繼續完成：

- 新增 [component/routing/ir.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/routing/ir.go) 與 [component/routing/normalize.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/routing/normalize.go)，引入共用的 `routing.NormalizedProgram`
- 新增 [component/dns/routing_program.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/dns/routing_program.go)，將 DNS request routing 的「最佳化 + internal selector split」收斂為 `NormalizedRequestRoutingProgram`
- 在下列 builder 新增 `FromProgram` 進入點，讓 backend 從共用 program lowering，而不是各自直接解讀 parser rules：
  - [component/dns/request_routing.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/dns/request_routing.go)
  - [component/dns/response_routing.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/dns/response_routing.go)
  - [control/routing_matcher_builder.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/routing_matcher_builder.go)
- 將下列呼叫點遷移至 program 進入點：
  - [component/dns/dns.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/dns/dns.go)
  - [component/daedns/router.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/daedns/router.go)
  - [control/control_plane.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/control_plane.go)
- 新增 [component/routing/normalize_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/routing/normalize_test.go) 與 [component/dns/routing_program_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/dns/routing_program_test.go)，固定：
  - program 建構會 clone 原始規則，不會反向污染輸入
  - request routing program 會穩定拆分 DNS / sub / node / subnode 規則

本輪驗證：

```bash
go test ./component/routing/... ./component/dns/... ./control/... ./component/outbound/... ./cmd/...
go test ./...
```

結論：

- routing 層已有共用的 normalize/program 邊界。
- DNS request、DNS response、control matcher 三個 backend 已從「各自取得 parser rules 解讀」推進為「從共同的 normalized program lowering」。

## 目前已完成的第十一步

本次繼續完成：

- 新增 [component/outbound/dialer/health_domain.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer/health_domain.go)，引入明確的 `HealthDomain` / `HealthKey` API，並開始在下列路徑取代散落的硬編碼 index：
  - [component/outbound/dialer/connectivity_check.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer/connectivity_check.go)：`NetworkType.Index()` 現在透過 `HealthKey` 正規化對應
  - [component/outbound/dialer_group.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer_group.go)：標準 selection network types 與 alive set 建構改為以 `StandardHealthKeys()` 為基礎
- 新增 [component/outbound/dialer/recovery_state.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer/recovery_state.go)，將 recovery/backoff/timer/punishment 狀態機提升為 `dialerRecoveryManager`
- 在 [component/outbound/dialer/dialer.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer/dialer.go) 中保留 `Dialer` 作為 facade，健康快照、restore、recovery trigger/cancel/backoff/stability 相關方法統一委派至 recovery manager
- 新增 [component/outbound/dialer/health_domain_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer/health_domain_test.go)，固定：
  - TCP DNS 語意仍對應至共用 TCP 健康域
  - canonical health keys 仍涵蓋既有六個標準 collection

本輪驗證：

```bash
go test ./component/outbound/... ./component/outbound/dialer/... ./control/...
go test ./...
```

結論：

- dialer 健康模型已從「外圍呼叫端直接依賴內部 idx 約定」推進為「具有明確 health domain API 與 recovery manager owner」的形式。
- 既有測試持續涵蓋 recovery snapshot / restore / backoff 行為；新增 API 僅明確化邊界，未變更既有語意。

## 審閱修正記錄

本次依未提交變更的審閱結果補充修正：

- 恢復 [config/config.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/config/config.go) 中 `FunctionOrStringToFunction` 與 `FunctionListOrStringToFunctionList` 的歷史匯出簽名，避免破壞外部 API；新增 `ParseFunctionOrString` 與 `ParseFunctionListOrString` 供內部回傳 error 的呼叫鏈使用。
- 為 [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/reload_manager.go) 中跨 goroutine 讀寫的 reload 狀態加鎖，包括 `reloadingErr`、pending staged handoff、pending retirement channel 與 reload 時間戳記，並讓 [cmd/run.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/run.go) 統一使用 `finishReloadSuccess()` 清理成功路徑。
- 在 [control/dns_control.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_control.go) 與 [control/dns_runtime.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/control/dns_runtime.go) 補充 DNS reload ownership model 註解，明確「獨立 facade + 共用 store + handoff bridge」關係。
- 調整 [component/dns/routing_program.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/dns/routing_program.go)，`NormalizedRequestRoutingProgram` 建構不再先建立後丟棄中間 program，而是在一次最佳化後拆分 DNS / sub / node / subnode 規則。
- 將 DNS controller 業務路徑的 store 檢查從靜默建立空 store 改為明確斷言，避免測試或手動建構 controller 時掩蓋初始化錯誤；reload 相容橋仍會明確初始化缺失 store。
- 補充 [component/routing/normalize_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/routing/normalize_test.go) 的 `Lower` 邊界測試，涵蓋空規則、nil parser 與 fallback 錯誤傳遞。
- 刪除 [component/outbound/dialer/dialer.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer/dialer.go) 中與 `triggerRecoveryDetection` 完全等價的 `triggerRecoveryDetectionInternal` 死程式碼。

本輪驗證：

```bash
go test ./config/... ./component/dns/... ./component/routing/... ./component/outbound/... ./control/... ./cmd/...
go test ./...
go test -race ./...
make ebpf
```

結論：

- 一般完整測試與完整競態偵測測試均已通過。
- 此輪修正消除了審閱指出的匯出 API 破壞、reload manager 未同步的共用欄位、重複清理進入點、routing program 中間包裝浪費、`Lower` 邊界測試不足與 dialer 死程式碼問題。

## 後續審閱修正記錄

本次依新增審閱點繼續修正：

- 為 [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/reload_manager.go) 的 `startControlPlaneRetirement` 補充單元測試，涵蓋 retirement channel 發布、退休 goroutine 完成，以及舊 generation cancel 呼叫。
- 將 DNS 設定比較從 `reflect.DeepEqual` 改為穩定 fingerprint 比較，避免 [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/reload_manager.go) 的 staged DNS reuse 判斷依賴反射深度比較。
- 調整 [component/dns/routing_program.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/dns/routing_program.go)，僅在沒有 optimizer 時執行 `DeepCloneRules`；有 optimizer 時直接使用 `ApplyRulesOptimizers` 內部 clone 結果，避免重複深層複製。
- 在 [component/outbound/dialer/health_domain.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer/health_domain.go) 新增 `HealthKeyFromCollectionIndex`，使 [component/outbound/dialer/dialer.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/component/outbound/dialer/dialer.go) 的 collection index 反查不再走訪六個標準 key。

本輪驗證：

```bash
go test ./cmd/... ./component/dns/... ./component/outbound/...
go test ./...
go test -race ./...
```

結論：

- 新增 retirement 單元測試通過。
- 一般完整測試及完整競態偵測測試皆已通過。

## DNS Fingerprint 涵蓋範圍修正記錄

本次依新增審閱點繼續修正：

- 在 [cmd/reload_manager.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/reload_manager.go) 的 `dnsConfigFingerprint` 補充維護註解，明確此函式必須與 `config.Dns` 頂層欄位保持同步。
- 在 [cmd/run_shutdown_test.go](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/cmd/run_shutdown_test.go) 新增 `TestDNSConfigFingerprintCoversAllDnsFields`，透過反射驗證 `config.Dns` 頂層欄位涵蓋率。後續新增 DNS 設定欄位但未更新 fingerprint 時，測試將失敗。

本輪驗證：

```bash
go test ./cmd/...
go test ./...
go test -race ./...
```

結論：

- 一般完整測試與完整 race 測試均已通過。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/zh/development/refactor-validation-plan.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
