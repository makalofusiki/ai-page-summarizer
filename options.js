const elements = {
  provider: document.getElementById('provider'),
  apiKey: document.getElementById('apiKey'),
  apiKeyGroup: document.getElementById('apiKeyGroup'),
  saveBtn: document.getElementById('saveBtn'),
  saveStatus: document.getElementById('saveStatus'),
};

function toggleApiKeyVisibility() {
  if (elements.provider.value === 'builtin') {
    elements.apiKeyGroup.classList.add('hidden');
  } else {
    elements.apiKeyGroup.classList.remove('hidden');
  }
}

async function loadSettings() {
  const { provider, apiKey } = await chrome.storage.local.get({
    provider: 'openai',
    apiKey: '',
  });

  elements.provider.value = provider;
  elements.apiKey.value = apiKey;
  toggleApiKeyVisibility();
}

function showStatus(msg, type) {
  elements.saveStatus.textContent = msg;
  elements.saveStatus.className = type === 'success' ? 'status-success' : 'status-error';
  elements.saveStatus.classList.remove('hidden');
  setTimeout(() => elements.saveStatus.classList.add('hidden'), 3000);
}

async function saveSettings() {
  const provider = elements.provider.value;
  const apiKey = elements.apiKey.value.trim();

  if (provider !== 'builtin' && !apiKey) {
    showStatus('请输入 API Key', 'error');
    return;
  }

  try {
    await chrome.storage.local.set({
      provider: elements.provider.value,
      apiKey,
    });
    showStatus('设置已保存', 'success');
  } catch (err) {
    showStatus('保存失败：' + err.message, 'error');
  }
}

elements.provider.addEventListener('change', toggleApiKeyVisibility);
elements.saveBtn.addEventListener('click', saveSettings);
document.addEventListener('DOMContentLoaded', loadSettings);
