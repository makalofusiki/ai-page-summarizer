const elements = {
  summarizeBtn: document.getElementById('summarizeBtn'),
  loading: document.getElementById('loading'),
  result: document.getElementById('result'),
  empty: document.getElementById('empty'),
  error: document.getElementById('error'),
  errorMessage: document.getElementById('errorMessage'),
  pageTitle: document.getElementById('pageTitle'),
  pageUrl: document.getElementById('pageUrl'),
  summaryContent: document.getElementById('summaryContent'),
  copyBtn: document.getElementById('copyBtn'),
};

function showLoading() {
  elements.loading.classList.remove('hidden');
  elements.result.classList.add('hidden');
  elements.empty.classList.add('hidden');
  elements.error.classList.add('hidden');
  elements.copyBtn.disabled = true;
  elements.summarizeBtn.disabled = true;
  elements.summarizeBtn.textContent = '正在总结...';
}

function hideLoading() {
  elements.loading.classList.add('hidden');
  elements.summarizeBtn.disabled = false;
  elements.summarizeBtn.innerHTML = '<span class="btn-icon">&#9889;</span> 总结当前页面';
}

function showError(msg) {
  hideLoading();
  elements.error.classList.remove('hidden');
  elements.result.classList.add('hidden');
  elements.empty.classList.add('hidden');
  elements.errorMessage.textContent = msg;
  elements.copyBtn.disabled = true;
}

function showResult(meta, summary) {
  hideLoading();
  elements.empty.classList.add('hidden');
  elements.error.classList.add('hidden');
  elements.result.classList.remove('hidden');
  elements.copyBtn.disabled = false;

  elements.pageTitle.textContent = meta.title;
  elements.pageUrl.textContent = meta.url;
  elements.pageUrl.onclick = () => chrome.tabs.create({ url: meta.url });
  elements.summaryContent.textContent = summary;
}

async function summarize() {
  showLoading();

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      showError('无法获取当前标签页');
      return;
    }

    chrome.runtime.sendMessage({ type: 'summarize' }, (response) => {
      if (chrome.runtime.lastError) {
        showError('连接失败：' + chrome.runtime.lastError.message);
        return;
      }
      if (response?.error) {
        showError(response.error);
        return;
      }
      showResult(
        { title: response.title, url: response.url },
        response.summary
      );
    });
  } catch (err) {
    showError(err.message || '未知错误');
  }
}

async function copySummary() {
  const text = elements.summaryContent.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    elements.copyBtn.innerHTML = '<span class="btn-icon-sm">&#10003;</span> 已复制';
    setTimeout(() => {
      elements.copyBtn.innerHTML = '<span class="btn-icon-sm">&#128203;</span> 复制摘要';
    }, 2000);
  } catch {
    elements.copyBtn.innerHTML = '<span class="btn-icon-sm">&#10007;</span> 复制失败';
    setTimeout(() => {
      elements.copyBtn.innerHTML = '<span class="btn-icon-sm">&#128203;</span> 复制摘要';
    }, 2000);
  }
}

elements.summarizeBtn.addEventListener('click', summarize);
elements.copyBtn.addEventListener('click', copySummary);
