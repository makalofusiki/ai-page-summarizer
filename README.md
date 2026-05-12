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
