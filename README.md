# 事件通知系统

> 一款基于 Cloudflare Workers 的轻量级事件通知系统。帮助您轻松跟踪各类订阅服务的到期时间，并通过多种渠道（微信、Telegram、邮件等）发送及时提醒。
>
> **本项目基于 [wangwangit/SubsTracker](https://github.com/wangwangit/SubsTracker) 项目进行二次开发，在原作者的优秀工作基础上，进行了功能增强和体验优化。在此向原作者表示诚挚的感谢！**

<img width="1560" height="573" alt="Image" src="https://github.com/user-attachments/assets/123628da-5ec1-4682-b88e-4abcbfa7a833" />

<img width="1524" height="801" alt="Image" src="https://github.com/user-attachments/assets/fe2dff3f-f0d8-4638-9bad-150c5b87b90c" />

<img width="1008" height="1062" alt="Image" src="https://github.com/user-attachments/assets/77d989c6-457b-4391-bb88-3e8bfb12d6d0" />

![Image](https://github.com/user-attachments/assets/8f33f9c3-85fa-48c5-a0dd-3872f16f292e)

![Image](https://github.com/user-attachments/assets/f4991bd0-a138-462a-9f6e-fd45cba508d0)

## ✨ 功能特色

### 🎯 核心功能
- **事件管理**：轻松添加、编辑、删除各类事件服务。
- **智能提醒**：支持自动计算下一个续订日期。
- **状态管理**：自动识别并标记“已过期”状态，支持手动启用/停用订阅。
- **手机浏览器优化**：方便在手机编辑管理。

### 📱 多渠道通知
- **WXPusher**：WXPusher app推送。
- **息知**：集成  实现微信消息推送
- **NotifyX**：支持通过 NotifyX 发送通知。
- **邮件**：支持域名邮箱发送。
- **Telegram**：通过您的个人 Telegram Bot 发送通知。
- **bark**：ios多个推送选择。

### 📱 加入黑夜模式

<img width="1533" height="669" alt="Image" src="https://github.com/user-attachments/assets/43b1caa5-5b0d-4a1f-9437-2e76b7625ee0" />

### 🎨 优秀的用户体验
- **响应式设计**：完美适配桌面和移动设备，随时随地轻松管理。
- **备注优化**：长备注内容自动截断，鼠标悬停即可查看全文。
- **实时预览**：日期选择器会实时显示对应的农历日期。
- **用户偏好**：系统会记住您的显示偏好

---
## ✨ 更新
- **加入bark通知**：20250712
- **到期时间加入时分**：默认到期日当天8点推送，方便除了订阅以外精确的事件推送 20250712（建议cf的执行时间改成每分钟调度，方便更多事件提醒）


## 🚀 快速部署

### 方式一：全新部署（推荐）

1.  **Fork 本仓库**到您自己的 GitHub 账户。
2.  点击您仓库中的 "Deploy to Cloudflare Workers" 按钮进行一键部署。

    [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cometzhang/notify-worker)  3.  在 Cloudflare 的部署配置页面，**必须**设置 KV 命名空间绑定。
    > ⚠️ **重要提示**：在 "KV Namespace Bindings" 设置中，变量名称 (`Variable Name`) **必须**填写为 `SUBSCRIPTIONS_KV`，并选择或创建一个 KV 仓库作为值 (`KV Namespace`)。
    >
    mg width="1506" height="912" alt="Image" src="https://github.com/user-attachments/assets/0e0b4d0a-44aa-406f-a526-956a99a84557" />
    > 
### 方式二：更新现有部署
对于已部署过的用户，直接在 Cloudflare 后台的 Worker 编辑器中，将本项目最新的 JS 代码内容完整复制并替换旧代码即可。

## 部署完之后务必设置kv空间和设定执行时间，具体可以看下面的手动部署指南


## 🚀 手动部署指南
前提条件
Cloudflare账户
可以直接将代码丢给AI,帮助查漏补缺
部署步骤
1.登陆cloudflare,创建worker,粘贴本项目中的js代码,点击部署

<img width="957" height="774" alt="Image" src="https://github.com/user-attachments/assets/f4f77e11-8095-426f-a88f-67feecb112ac" />

<img width="1212" height="1032" alt="Image" src="https://github.com/user-attachments/assets/d1f3e2b5-aac6-461f-9f75-9635e0f3809a" />

<img width="1236" height="1068" alt="Image" src="https://github.com/user-attachments/assets/3fb23efd-eab8-425d-ad42-747199aa784d" />

代码在index.js里面，直接复制替代原来的就行

<img width="1509" height="1130" alt="Image" src="https://github.com/user-attachments/assets/8b48b1ce-bbf0-40d3-89da-f1330a64b653" />

2.创建KV键值 SUBSCRIPTIONS_KV

<img width="1506" height="912" alt="Image" src="https://github.com/user-attachments/assets/8ae9005b-4bd2-4320-957d-45cd9bacfab1" />

<img width="1167" height="636" alt="Image" src="https://github.com/user-attachments/assets/19bd05cd-5747-4318-ba8f-cf0f27d72e51" />

3、在worker项目里面绑定kv键值对

<img width="1446" height="894" alt="Image" src="https://github.com/user-attachments/assets/6dd26d8e-cac5-4271-af4b-4cc3e3311210" />

<img width="1521" height="939" alt="Image" src="https://github.com/user-attachments/assets/187faae7-9a67-4fec-991a-feb37ccddeb3" />

<img width="1454" height="1053" alt="Image" src="https://github.com/user-attachments/assets/52934a07-d004-4fed-bfc4-c37ca7dbb28d" />

<img width="1304" height="758" alt="Image" src="https://github.com/user-attachments/assets/85e3f7f3-1b5e-49ff-9ce4-b21cd83ec1dc" />

3.绑定自定义域名（才能在国内网络访问）最后设定设置定时执行时间!设定设置定时执行时间!设定设置定时执行时间! 才能正常推送。推荐设置* * * * *每分钟执行一次

<img width="1527" height="1101" alt="Image" src="https://github.com/user-attachments/assets/ec6a3fa8-9e47-4476-9590-f5e75794f82f" />

<img width="1236" height="774" alt="Image" src="https://github.com/user-attachments/assets/4fecc7b7-12d3-4d26-b82a-eeda4d7b386c" />

4.打开worker提供的域名地址或者自定义域名,输入默认账号密码: admin password. 登录进入点右上角配置,修改账号密码,以及配置通知方式的信息

<img width="1524" height="801" alt="Image" src="https://github.com/user-attachments/assets/07b226bc-f4f2-4329-a48e-1d1c691797cf" />

6.配置完成可以点击测试通知,查看是否能够正常通知,然后就可以正常添加订阅使用了!


## 🔧 通知渠道配置详解

### WXPusher
- 前往 WXPusher 官网获取您的 `appToken` 和 `uid`。

### 邮件通知
- **推送 URL**: 参考https://resend.com/login，绑定域名，申请api key填入

### Telegram Bot
- **Bot Token**: 从 [@BotFather](https://t.me/BotFather) 获取。
- **Chat ID**: 从 [@userinfobot](https://t.me/userinfobot) 获取您的个人 Chat ID。

### bark  ios app
- **复制填入即可
- **<img width="720" height="1305" alt="Image" src="https://github.com/user-attachments/assets/ba7a684e-95f3-477a-987a-e15b2485d5dc" />




## 🙏 致谢

本项目是在 [wangwangit/SubsTracker](https://github.com/wangwangit/SubsTracker) 的基础上进行的二次开发。感谢原作者为社区带来的优秀项目，为本项目提供了坚实的基础和灵感。
