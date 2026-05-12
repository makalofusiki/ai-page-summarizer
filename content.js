chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getPageContent') {
    sendResponse({
      title: document.title,
      url: location.href,
      content: document.body.innerText,
    });
  }
});
