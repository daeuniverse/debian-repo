---
title: "导览"
---

<div v-pre lang="zh-CN">

# 导览

从检查系统要求开始，依次完成 dae 安装、配置与服务启动。本页按使用顺序整理文档入口，也可直接查找配置和故障排查内容。

## 首次部署

| 步骤 | 要完成的事项 | 文档 |
| --- | --- | --- |
| 1 | 检查内核版本与必需配置项 | [内核要求](/zh-CN/dae/start/requirements) |
| 2 | 按系统选择安装方式 | [安装指南](/zh-CN/dae/installation/) |
| 3 | 设置网络接口、订阅或节点 | [最小配置](/zh-CN/dae/start/minimal-configuration) |
| 4 | 启动 dae 并设置开机启动 | [服务管理](/zh-CN/dae/start/service-management) |

使用 PPPoE 接口时，还需参阅[PPPoE 接口设置](/zh-CN/dae/start/pppoe)。

## 配置流量处理

| 需要完成的配置 | 文档 |
| --- | --- |
| DNS 服务器与 DNS 分流 | [DNS 配置](/zh-CN/dae/configuration/dns) · [外部 DNS](/zh-CN/dae/configuration/external-dns) |
| 域名、IP 与游戏分流 | [路由规则](/zh-CN/dae/configuration/routing) · [游戏路由](/zh-CN/dae/configuration/gaming-oriented-routing) |
| 组织配置文件 | [拆分配置文件](/zh-CN/dae/configuration/separate-config) |

## 运行与排查

- [服务管理](/zh-CN/dae/start/service-management)：使用 systemd 或 OpenRC 启动、设置开机启动、重载与重新启动。
- [重载与暂停](/zh-CN/dae/user-guide/reload-and-suspend)：重载配置或暂时停止处理流量。
- [故障排查](/zh-CN/dae/troubleshooting)：排查网络、DNS、防火墙与 eBPF 问题。

## 了解原理与参与开发

[工作原理](/zh-CN/dae/how-it-works) · [代理协议](/zh-CN/dae/proxy-protocols) · [从源码构建](/zh-CN/dae/user-guide/build-by-yourself) · [参与贡献](/zh-CN/dae/development/contribute)

安装已下载的二进制文件或使用安装脚本，请参阅[手动安装](/zh-CN/dae/installation/manual-installation)。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
