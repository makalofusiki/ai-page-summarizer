const SYSTEM_PROMPT = `你是一个专业的网页内容总结助手。请用中文对以下网页内容进行结构化总结，遵循以下格式：

## 📋 内容概述
用 2-3 句话概括网页的核心主题和主要内容。

## 🔑 核心要点
列出 3-6 个关键要点，每个要点用一句话表述：
- 要点一（概括核心结论或发现）
- 要点二
- 要点三
- ...

## 💡 关键细节
补充重要的数据、引用、或具体论据，如果没有可跳过此项。

## 🏁 总结
用 1-2 句话给出整体评价或核心 takeaways。

注意：
- 使用中文输出，保持客观准确
- 不要添加原文没有的信息
- 如文章有明确的结论或观点，在总结中体现`;

const PROVIDERS = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    buildBody: (content, title, url) => ({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `网页标题：${title}\n网页URL：${url}\n\n网页内容：\n${content}` },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
    parseResponse: (data) => data.choices?.[0]?.message?.content,
  },
  claude: {
    url: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514',
    buildBody: (content, title, url) => ({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: `网页标题：${title}\n网页URL：${url}\n\n网页内容：\n${content}` },
      ],
    }),
    parseResponse: (data) => data.content?.[0]?.text,
  },
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    buildBody: (content, title, url) => ({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `网页标题：${title}\n网页URL：${url}\n\n网页内容：\n${content}` },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
    parseResponse: (data) => data.choices?.[0]?.message?.content,
  },
};

async function summarizeWithBuiltinAI(content, title, url) {
  const availability = await Summarizer.availability();
  if (availability !== 'readily-available') {
    if (availability === 'after-download') {
      throw new Error('AI 模型需要先下载，请稍后重试');
    }
    throw new Error('当前浏览器不支持内置 AI 摘要功能');
  }

  const summarizer = await Summarizer.create({
    type: 'key-points',
    format: 'markdown',
    length: 'medium',
  });

  const text = `网页标题：${title}\n网页URL：${url}\n\n网页内容：\n${content}`;
  const summary = await summarizer.summarize(text);
  return summary;
}

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'summarize') {
    handleSummarize(sender.tab?.id)
      .then((result) => sendResponse(result))
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }
});

async function handleSummarize(tabId) {
  if (!tabId) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    tabId = tab?.id;
  }
  if (!tabId) throw new Error('无法获取当前标签页');

  const page = await chrome.tabs.sendMessage(tabId, { type: 'getPageContent' });
  if (!page?.content) throw new Error('无法获取页面内容，请刷新后重试');

  const { apiKey, provider } = await chrome.storage.local.get({
    apiKey: '',
    provider: 'openai',
  });

  if (provider === 'builtin') {
    const summary = await summarizeWithBuiltinAI(page.content, page.title, page.url);
    return { summary, title: page.title, url: page.url };
  }

  if (!apiKey) throw new Error('请先在设置页面配置 API Key');

  const prov = PROVIDERS[provider] || PROVIDERS.openai;
  const body = prov.buildBody(page.content, page.title, page.url);

  const headers = { 'Content-Type': 'application/json' };
  if (provider === 'claude') {
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
  } else {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const res = await fetch(prov.url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || `API 请求失败 (${res.status})`);
  }

  const data = await res.json();
  const summary = prov.parseResponse(data);
  if (!summary) throw new Error('AI 返回内容为空');

  return { summary, title: page.title, url: page.url };
}
