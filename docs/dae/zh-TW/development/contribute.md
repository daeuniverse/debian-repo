---
title: "參與貢獻"
---

<div v-pre lang="zh-TW">

# 參與貢獻

如果你想為專案作出貢獻並讓它變得更好，非常歡迎你的協助。貢獻也是深入瞭解 GitHub 上的社交編碼、新技術及其生態系、如何提出具建設性且有幫助的錯誤報告和功能請求，以及最崇高的貢獻——優秀、整潔的提取請求——的絕佳方式。

## 錯誤報告和功能請求

如果你發現 錯誤 或有 功能請求，請先搜尋，以確認是否已經有類似議題。如果沒有，請在此儲存庫中建立一個 [issue](https://github.com/daeuniverse/dae/issues/new)

## 程式碼

如果你想修正錯誤或實作功能，請 `fork` 此儲存庫並 建立提取請求。

在發起任何提取請求前，如果你對需求或實作有任何疑問，建議你先 建立議題 進行討論。這樣你可以確認維護者同意要變更什麼以及如何變更，之後也有望快速合併。

只有在所有狀態檢查均為綠色時，才能合併 提取請求。

## 提交前掛鉤

此儲存庫使用 [pre-commit hook](https://github.com/pre-commit/pre-commit-hooks)，在將提交寫入本機 Git 歷史紀錄前套用 lint 檢查。要設定 pre-commit，請執行下列操作：

```bash
# install pre-commit
pip3 install pre-commit
# install pre-commit hooks
pre-commit install
```

## 如何建立整潔的提取請求

- 在 GitHub 上建立專案的 個人 fork。
- 在本機電腦上複製該 fork。你在 GitHub 上的遠端儲存庫稱為 `origin`。
- 將原始儲存庫新增為名為 `upstream` 的遠端儲存庫。
- 如果你在一段時間前建立了 fork，請務必將上游變更拉取到本機儲存庫。
- 建立一個新分支來工作！從 `main` 分支建立。
- 實作或修正功能，並為程式碼加上註解。
- 遵循專案的程式碼風格，包括縮排。
- 如果專案有測試，請執行它們！對於一般單元測試，使用 `go test -tags dae_stub_ebpf ./...`。對於 eBPF 測試，使用 `make ebpf-test`。
- 依需要編寫或調整測試。
- 依需要新增或修改文件。
- 使用 Git 的[互動式 rebase](https://help.github.com/articles/interactive-rebase)將提交壓縮為單一提交。必要時建立新分支。
- 將分支推送到 GitHub 上 fork 對應的遠端儲存庫 `origin`。
- 從你的 fork 在正確分支中開啟提取請求。目標為專案的 `main` 分支。
- 提取請求獲准並合併後，你可以將變更從 `upstream` 拉取到本機儲存庫，並刪除多餘分支。

最後但同樣重要的是：一律使用現在式編寫提交訊息。提交訊息應描述該提交套用後對程式碼產生的作用，而非你對程式碼做了什麼。

## 再次請求審查

請勿透過在新留言中提及審查者來提醒他們。請改用再次請求審查功能。更多資訊請閱讀 [GitHub 文件：再次請求審查](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request#re-requesting-a-review)。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/development/contribute.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
