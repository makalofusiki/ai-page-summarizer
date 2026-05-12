# AI Page Summarizer

Chrome 浏览器扩展（Manifest V3），使用 AI 自动总结网页内容，快速获取核心信息。

## 功能

- 点击扩展图标打开侧边栏，一键总结当前页面
- 支持多种 AI 提供商：
  - **OpenAI** — GPT-4o Mini
  - **Claude** — Claude Sonnet 4
  - **DeepSeek** — DeepSeek Chat
  - **Chrome 内置 AI** — 无需 API Key，免费使用
- 结构化输出：内容概述 → 核心要点 → 关键细节 → 总结
- 复制摘要到剪贴板
- 深色主题，简洁 Notion 风格界面

## 安装

### 从源码加载

1. 克隆仓库：

```bash
git clone https://github.com/makalofusiki/ai-page-summarizer.git
```

2. 打开 Chrome，进入 `chrome://extensions`
3. 开启右上角 **"开发者模式"**
4. 点击 **"加载已解压的扩展程序"**
5. 选择项目文件夹

### 配置

1. 右键扩展图标 → **选项**
2. 选择 AI 提供商：
   - **OpenAI / Claude / DeepSeek** — 输入你的 API Key
   - **Chrome 内置 AI** — 无需配置，直接使用
3. 点击 **保存**

> Chrome 内置 AI 需要 Chrome ≥ 128，并在 `chrome://flags/#summarization-api-for-gemini` 中启用。

## AI 提供商说明

### OpenAI

- **端点**: `https://api.openai.com/v1/chat/completions`
- **模型**: `gpt-4o-mini`
- **API Key**: 在 [platform.openai.com/api-keys](https://platform.openai.com/api-keys) 获取
- **计费**: 按 token 计费，gpt-4o-mini 价格较低

### Claude

- **端点**: `https://api.anthropic.com/v1/messages`
- **模型**: `claude-sonnet-4-20250514`
- **API Key**: 在 [console.anthropic.com](https://console.anthropic.com) 获取
- **计费**: 按 token 计费

### DeepSeek

- **端点**: `https://api.deepseek.com/v1/chat/completions`
- **模型**: `deepseek-chat`
- **API Key**: 在 [platform.deepseek.com/api-keys](https://platform.deepseek.com/api-keys) 获取
- **计费**: 价格极低（约 OpenAI 的 1/10），适合高频使用
- **兼容性**: API 格式与 OpenAI 完全兼容，响应速度快

### Chrome 内置 AI（实验性）

- **无需 API Key**，完全免费，本地运行
- 利用 Chrome 内置的 Gemini 模型进行摘要
- **启用方法**:
  1. 确保 Chrome 版本 ≥ 128
  2. 在地址栏打开 `chrome://flags/#summarization-api-for-gemini`
  3. 设置为 **Enabled**
  4. 重启浏览器
  5. 首次使用时浏览器会自动下载 AI 模型
- **限制**:
  - 依赖 Chrome 版本和平台支持
  - 首次使用需要下载模型
  - 摘要长度和格式由内置 API 控制，不支持自定义提示词

## 使用

1. 打开任意网页
2. 点击 Chrome 工具栏中的扩展图标
3. 侧边栏打开后，点击 **"总结当前页面"**
4. 等待 AI 生成结构化摘要
5. 点击底部 **"复制摘要"** 复制结果

## 项目结构

```
ai-page-summarizer/
├── manifest.json      # Manifest V3 清单
├── background.js      # Service Worker（AI 调用编排）
├── content.js         # 内容脚本（提取页面文字）
├── sidepanel.html     # 侧边栏界面
├── sidepanel.css      # 侧边栏样式
├── sidepanel.js       # 侧边栏逻辑
├── options.html       # 设置页面
├── options.js         # 设置逻辑
├── icons/             # 扩展图标
└── README.md
```

## 技术栈

- **Manifest V3** — 最新 Chrome 扩展规范
- **Service Worker** — 后台消息处理和 API 调用
- **Side Panel API** — Chrome 侧边栏面板
- **Storage API** — 本地配置存储

## 许可

MIT
