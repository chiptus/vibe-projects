import { Readability } from '@mozilla/readability';

const MAX_CHARS = 30000;

export default defineUnlistedScript(() => {
  try {
    const docClone = document.cloneNode(true) as Document;
    const article = new Readability(docClone).parse();
    const text = (article?.textContent ?? document.body.innerText ?? '').trim().slice(0, MAX_CHARS);

    browser.runtime.sendMessage({
      type: 'page-extracted',
      payload: { url: location.href, title: document.title, text },
    });
  } catch (error) {
    browser.runtime.sendMessage({
      type: 'page-extracted-error',
      payload: String(error),
    });
  }
});
