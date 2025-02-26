# Cloudmark

[![AGPL LICENSE](https://img.shields.io/badge/LICENSE-AGPL-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.html)
[![Try It Online](https://img.shields.io/badge/TryIt-Online-orange.svg)](https://cloudmark.site)

[English](README.md)

## 项目简介

Cloudmark 是一个通用的云端书签管理工具，让您能够从任何地方轻松保存和访问您的书签。无需登录或注册，只需创建您的个性化书签集合，即可开始使用。

在线体验：[cloudmark.site](https://cloudmark.site)

## 主要特性

- 🔑 **无需注册**：使用唯一标识符访问您的书签集合
- 🔖 **一键保存**：通过书签小工具（bookmarklet）快速保存当前网页
- 🏷️ **分类管理**：为书签添加自定义分类，轻松整理
- 🌐 **跨设备访问**：在任何设备上访问您的书签
- 📝 **详细描述**：为书签添加个性化描述
- 🌍 **多语言支持**：支持英文和中文界面
- ✨ **现代化界面**：响应式设计，适配所有设备

## 快速开始

1. 访问 [cloudmark.site](https://cloudmark.site)
2. 生成一个唯一标识符（mark）或使用自定义标识符
3. 安装书签小工具（bookmarklet）到您的浏览器
4. 浏览网页时，点击书签小工具保存当前页面
5. 随时访问 `cloudmark.site/您的标识符` 查看和管理您的书签

## 本地开发

### 前提条件

- Node.js 15+ 和 pnpm
- Cloudflare 账户（用于预览和部署）

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看结果。

### 本地预览 Cloudflare Pages

```bash
pnpm preview
```

### 构建和部署

```bash
pnpm deploy
```

## Cloudflare 配置

### KV 命名空间

Cloudmark 使用 Cloudflare KV 存储书签数据。您需要：

1. 在 Cloudflare Dashboard 创建一个 KV 命名空间
2. 更新 `wrangler.jsonc` 文件：
   ```json
   "kv_namespaces": [
      {
        "binding": "cloudmark",
        "id": "您的KV命名空间ID"
      }
   ]
   ```

### 环境变量

- `NEXT_PUBLIC_BASE_URL` - 网站的基础 URL（可选，默认为当前域名）

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [Cloudflare Pages](https://pages.cloudflare.com/) - 托管和服务端功能
- [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/) - 数据存储
- [Tailwind CSS](https://tailwindcss.com/) - 样式
- [Next-Intl](https://next-intl-docs.vercel.app/) - 国际化

## 许可证

本项目基于 [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html) 许可证开源。

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 联系方式

如有问题，请通过 GitHub Issues 联系我们。
