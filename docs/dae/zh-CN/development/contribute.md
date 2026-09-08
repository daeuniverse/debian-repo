---
title: "参与贡献"
---

<div v-pre lang="zh-CN">

# 参与贡献

如果你想为项目作出贡献并让它变得更好，非常欢迎你的帮助。贡献也是深入了解 GitHub 上的社交编码、新技术及其生态系统、如何提出建设性且有帮助的错误报告和功能请求，以及最崇高的贡献——优秀、整洁的拉取请求——的绝佳方式。

## 错误报告和功能请求

如果你发现 错误 或有 功能请求，请先搜索，以确认是否已经存在类似议题。如果没有，请在此仓库中创建一个 [issue](https://github.com/daeuniverse/dae/issues/new)

## 代码

如果你想修复错误或实现功能，请 `fork` 此仓库并 创建拉取请求。

在发起任何拉取请求前，如果你对需求或实现有任何疑问，建议你先 创建议题 进行讨论。这样你可以确认维护者同意要改什么以及如何修改，之后也有望快速合并。

只有在所有状态检查均为绿色时，才能合并 拉取请求。

## 提交前钩子

此仓库使用 [pre-commit hook](https://github.com/pre-commit/pre-commit-hooks)，在将提交写入本地 Git 历史前应用 lint 检查。要设置 pre-commit，请执行以下操作：

```bash
# install pre-commit
pip3 install pre-commit
# install pre-commit hooks
pre-commit install
```

## 如何创建整洁的拉取请求

- 在 GitHub 上创建项目的 个人 fork。
- 在本地计算机上克隆该 fork。你在 GitHub 上的远程仓库称为 `origin`。
- 将原始仓库添加为名为 `upstream` 的远程仓库。
- 如果你在一段时间前创建了 fork，请务必将上游变更拉取到本地仓库。
- 创建一个新分支来工作！从 `main` 分支创建。
- 实现或修复功能，并为代码添加注释。
- 遵循项目的代码风格，包括缩进。
- 如果项目有测试，请运行它们！对于常规单元测试，使用 `go test -tags dae_stub_ebpf ./...`。对于 eBPF 测试，使用 `make ebpf-test`。
- 根据需要编写或调整测试。
- 根据需要添加或修改文档。
- 使用 Git 的[交互式变基](https://help.github.com/articles/interactive-rebase)将提交压缩为单个提交。必要时创建新分支。
- 将分支推送到 GitHub 上 fork 对应的远程仓库 `origin`。
- 从你的 fork 在正确分支中打开拉取请求。目标为项目的 `main` 分支。
- 拉取请求获批并合并后，你可以将变更从 `upstream` 拉取到本地仓库，并删除多余分支。

最后但同样重要的是：始终使用现在时编写提交消息。提交消息应描述该提交应用后对代码产生的作用，而不是你对代码做了什么。

## 再次请求审查

请勿通过在新评论中提及审查者来提醒他们。请改用再次请求审查功能。更多信息请阅读 [GitHub 文档：再次请求审查](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request#re-requesting-a-review)。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/development/contribute.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
