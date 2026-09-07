---
title: "提交訊息規範"
---

<div v-pre lang="zh-TW">

# 提交訊息規範

## 採用這些慣例的原因

- 自動產生變更日誌
- 便於瀏覽 Git 歷史紀錄（例如忽略樣式變更）

瞭解對提交訊息樣式作出的小改動如何讓你成為更出色的開發者。

## 格式

```
`<type>(<scope>): <subject>`

`<scope>` is optional
```

## 範例

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

`<type>` 的範例值：

- `feat`：（面向使用者的新功能，而非建置指令碼的新功能）
- `fix`：（面向使用者的錯誤修正，而非建置指令碼的修正）
- `docs`：（文件變更）
- `style`：（格式化、遺漏分號等；不變更正式環境程式碼）
- `refactor`：（重構正式環境程式碼，例如重新命名變數）
- `test`：（新增遺漏的測試、重構測試；不變更正式環境程式碼）
- `chore`：（更新 grunt 工作等；不變更正式環境程式碼，例如升級相依套件）
- `perf`：（效能改善變更，例如更好的並行效能）
- `ci`：（更新 CI 設定檔和指令碼，例如 `.gitHub/workflows/*.yml`）

`<Scope>` 的範例值：

- `init`
- `runner`
- `watcher`
- `config`
- `web-server`
- `proxy`

`<scope>` 可以為空（例如變更是全域性的，或難以歸屬給單一元件），此時省略括號。在較小的專案中，例如 Karma 外掛，`<scope>` 為空。

## 訊息主旨（第一行）

第一行不能超過 `72` 個字元，且其後應有一個空行。類型和範圍應一律使用小寫，如下所示

## 訊息內文

與 `<subject>` 一樣，使用祈使現在式：「change」，而非「changed」或「changes」。訊息內文應包含變更動機，以及與先前行為的對照。

## 訊息頁尾

### 參照議題

已關閉的議題應在頁尾中另列一行，並以 "Closes" 關鍵字作為前綴，如下所示：

```
Closes #234
```

或在有多個議題時：

```
Closes #123, #245, #992
```

## 參考資料

- <https://www.conventionalcommits.org/>
- <https://seesparkbox.com/foundry/semantic_commit_messages>
- <http://karma-runner.github.io/1.0/dev/git-commit-msg.html>
- <https://wadehuanglearning.blogspot.com/2019/05/commit-commit-commit-why-what-commit.html>

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/development/commit-msg-guide.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
