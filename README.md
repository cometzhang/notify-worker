# 事件通知系统

> 一款基于 Cloudflare Workers 的轻量级事件通知系统。帮助您轻松跟踪各类订阅服务的到期时间，并通过多种渠道（微信、Telegram、邮件等）发送及时提醒。
>
> **本项目基于 [wangwangit/SubsTracker](https://github.com/wangwangit/SubsTracker) 项目进行二次开发，在原作者的优秀工作基础上，进行了功能增强和体验优化。在此向原作者表示诚挚的感谢！**
> https://tu.icomet.cc/file/1752228235931_1.png

## ✨ 功能特色

### 🎯 核心功能
- **事件管理**：轻松添加、编辑、删除各类事件服务。
- **智能提醒**：支持自动计算下一个续订日期。
- **状态管理**：自动识别并标记“已过期”状态，支持手动启用/停用订阅。

### 📱 多渠道通知
- **WXPusher**：WXPusher app推送。
- **息知**：集成  实现微信消息推送
- **NotifyX**：支持通过 NotifyX 发送通知。
- **邮件**：支持域名邮箱发送。
- - **Telegram**：通过您的个人 Telegram Bot 发送通知。
  - 
### 📱 手机页面优化

### 📱 加入黑夜模式


### 🎨 优秀的用户体验
- **响应式设计**：完美适配桌面和移动设备，随时随地轻松管理。
- **备注优化**：长备注内容自动截断，鼠标悬停即可查看全文。
- **实时预览**：日期选择器会实时显示对应的农历日期。
- **用户偏好**：系统会记住您的显示偏好

---

## 🚀 快速部署

### 方式一：全新部署（推荐）

1.  **Fork 本仓库**到您自己的 GitHub 账户。
2.  点击您仓库中的 "Deploy to Cloudflare Workers" 按钮进行一键部署。

    [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cometzhang/notify-worker)  3.  在 Cloudflare 的部署配置页面，**必须**设置 KV 命名空间绑定。
    > ⚠️ **重要提示**：在 "KV Namespace Bindings" 设置中，变量名称 (`Variable Name`) **必须**填写为 `SUBSCRIPTIONS_KV`，并选择或创建一个 KV 仓库作为值 (`KV Namespace`)。
    >
    > ![KV 命名空间绑定示例](https://raw.githubusercontent.com/cometzhang/notify-worker/main/image.png) ### 方式二：更新现有部署
对于已部署过的用户，直接在 Cloudflare 后台的 Worker 编辑器中，将本项目最新的 JS 代码内容完整复制并替换旧代码即可。

---

## 📋 开始使用（三步走）

1.  **首次登录与初始化**
    - 访问您部署后的域名（例如 `xxx.your-name.workers.dev`）。
    - 默认用户名：`admin`
    - 默认密码：`password`

2.  **基础配置**
    - **修改密码**：登录后，请立即进入“系统配置”页面修改默认密码。
    - **配置通知渠道**：在“系统配置”中至少选择并配置一个您希望使用的通知渠道。

3.  **添加事件**
    - 返回主页，开始添加您的订阅项目，设置到期时间和提醒规则。
    - 系统将根据您的设置，在订阅到期前发送提醒。

> 💡 **系统提示**: 系统默认根据cf的事件触发设置，对满足提醒条件的订阅发送通知。

---

## 🔧 通知渠道配置详解

### WXPusher
- 前往 WXPusher 官网获取您的 `appToken` 和 `uid`。

### 邮件通知
- **推送 URL**: 参考https://resend.com/login，绑定域名，申请api key填入

### Telegram Bot
- **Bot Token**: 从 [@BotFather](https://t.me/BotFather) 获取。
- **Chat ID**: 从 [@userinfobot](https://t.me/userinfobot) 获取您的个人 Chat ID。



🚀 手动部署指南
前提条件
Cloudflare账户
Telegram Bot (用于发送通知)
可以直接将代码丢给AI,帮助查漏补缺
部署步骤
1.登陆cloudflare,创建worker,粘贴本项目中的js代码,点击部署

image

2.创建KV键值 SUBSCRIPTIONS_KV

image

3.给worker绑定上键值对,以及设置定时执行时间!

image

4.打开worker提供的域名地址,输入默认账号密码: admin password (或者admin admin123),可以在代码中查看默认账号密码!

image

5.前往系统配置,修改账号密码,以及配置tg通知的信息

image

6.配置完成可以点击测试通知,查看是否能够正常通知,然后就可以正常添加订阅使用了!

image


---

## 🙏 致谢

本项目是在 [wangwangit/SubsTracker](https://github.com/wangwangit/SubsTracker) 的基础上进行的二次开发。感谢原作者为社区带来的优秀项目，为本项目提供了坚实的基础和灵感。
