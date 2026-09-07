---
title: "提交信息规范"
---

<div v-pre lang="zh-CN">

# 提交信息规范

## 采用这些约定的原因

- 自动生成变更日志
- 便于浏览 Git 历史（例如忽略样式变更）

了解对提交消息风格作出的小改动如何让你成为更出色的开发者。

## 格式

```
`<type>(<scope>): <subject>`

`<scope>` is optional
```

## 示例

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

`<type>` 的示例值：

- `feat`：（面向用户的新功能，而非构建脚本的新功能）
- `fix`：（面向用户的错误修复，而非构建脚本的修复）
- `docs`：（文档变更）
- `style`：（格式化、缺少分号等；不更改生产代码）
- `refactor`：（重构生产代码，例如重命名变量）
- `test`：（添加缺失测试、重构测试；不更改生产代码）
- `chore`：（更新 grunt 任务等；不更改生产代码，例如升级依赖项）
- `perf`：（性能改进变更，例如更好的并发性能）
- `ci`：（更新 CI 配置文件和脚本，例如 `.gitHub/workflows/*.yml`）

`<Scope>` 的示例值：

- `init`
- `runner`
- `watcher`
- `config`
- `web-server`
- `proxy`

`<scope>` 可以为空（例如变更是全局性的，或难以归属给单个组件），此时省略括号。在较小的项目中，例如 Karma 插件，`<scope>` 为空。

## 消息主题（第一行）

第一行不能超过 `72` 个字符，且其后应有一个空行。类型和范围始终应使用小写，如下所示

## 消息正文

与 `<subject>` 一样，使用祈使现在时：“change”，而不是“changed”或“changes”。消息正文应包含变更动机，以及与先前行为的对比。

## 消息页脚

### 引用议题

已关闭的议题应在页脚中单独列出，并以 “Closes” 关键字作为前缀，如下所示：

```
Closes #234
```

或在存在多个议题时：

```
Closes #123, #245, #992
```

## 参考资料

- <https://www.conventionalcommits.org/>
- <https://seesparkbox.com/foundry/semantic_commit_messages>
- <http://karma-runner.github.io/1.0/dev/git-commit-msg.html>
- <https://wadehuanglearning.blogspot.com/2019/05/commit-commit-commit-why-what-commit.html>

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/development/commit-msg-guide.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
