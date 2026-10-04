import type { PageContent } from './jev';
import { extractBlockedUrl, requestHostPermission } from './permissions';

function waitForExtraction(timeoutMs = 5000): Promise<PageContent> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      browser.runtime.onMessage.removeListener(listener);
      reject(new Error('Timed out reading the page content.'));
    }, timeoutMs);

    function listener(message: any) {
      if (message?.type === 'page-extracted') {
        clearTimeout(timer);
        browser.runtime.onMessage.removeListener(listener);
        resolve(message.payload as PageContent);
      } else if (message?.type === 'page-extracted-error') {
        clearTimeout(timer);
        browser.runtime.onMessage.removeListener(listener);
        reject(new Error(message.payload));
      }
    }

    browser.runtime.onMessage.addListener(listener);
  });
}

async function injectExtractor(tabId: number, alreadyRetried = false): Promise<void> {
  try {
    await browser.scripting.executeScript({ target: { tabId }, files: ['/extractor.js'] });
  } catch (error) {
    const blockedUrl = extractBlockedUrl(error);
    if (!alreadyRetried && blockedUrl) {
      const granted = await requestHostPermission(blockedUrl);
      if (granted) return injectExtractor(tabId, true);
      throw new Error('Permission to read this page was denied.');
    }
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function extractActiveTabContent(): Promise<PageContent> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error('No active tab found.');

  const extraction = waitForExtraction();
  await injectExtractor(tab.id);
  return extraction;
}
