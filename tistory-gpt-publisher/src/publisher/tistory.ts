import { chromium, BrowserContext, Page } from 'playwright';
import { markdownToHtml } from '../lib/markdown';

export type TistoryPublishInput = {
  title: string;
  bodyMarkdown?: string | null;
  bodyHtml?: string | null;
  category?: string | null;
  tags?: string[];
  publishMode: 'PRIVATE' | 'PUBLIC' | 'DRAFT';
};

export type TistoryPublishResult = {
  status: 'drafted' | 'published';
  url?: string;
};

function parseCookieJson() {
  const raw = process.env.TISTORY_COOKIE_JSON;
  if (!raw) throw new Error('TISTORY_COOKIE_JSON is not configured');
  const cookies = JSON.parse(raw);
  if (!Array.isArray(cookies)) throw new Error('TISTORY_COOKIE_JSON must be a JSON cookie array');
  return cookies;
}

async function createContext(): Promise<BrowserContext> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36'
  });
  await context.addCookies(parseCookieJson());
  return context;
}

async function clickIfVisible(page: Page, selectors: string[]) {
  for (const selector of selectors) {
    const loc = page.locator(selector).first();
    if (await loc.count()) {
      try {
        if (await loc.isVisible({ timeout: 1500 })) {
          await loc.click({ timeout: 3000 });
          return true;
        }
      } catch {}
    }
  }
  return false;
}

async function fillFirst(page: Page, selectors: string[], value: string) {
  for (const selector of selectors) {
    const loc = page.locator(selector).first();
    if (await loc.count()) {
      try {
        await loc.fill(value, { timeout: 3000 });
        return true;
      } catch {
        try {
          await loc.click({ timeout: 3000 });
          await page.keyboard.insertText(value);
          return true;
        } catch {}
      }
    }
  }
  return false;
}

async function setEditorHtml(page: Page, html: string) {
  const editorSelectors = [
    'iframe[title*="에디터"]',
    'iframe[id*="editor"]',
    '.toastui-editor-contents',
    '.ProseMirror',
    '[contenteditable="true"]',
    'textarea'
  ];

  for (const selector of editorSelectors) {
    const loc = page.locator(selector).first();
    if (!(await loc.count())) continue;

    if (selector.startsWith('iframe')) {
      const frame = await loc.elementHandle().then((h) => h?.contentFrame());
      if (frame) {
        const body = frame.locator('body').first();
        await body.click({ timeout: 3000 });
        await body.evaluate((el, value) => {
          el.innerHTML = value;
          el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertHTML', data: value }));
        }, html);
        return;
      }
    } else if (selector === 'textarea') {
      await loc.fill(html, { timeout: 5000 });
      return;
    } else {
      await loc.click({ timeout: 5000 });
      await loc.evaluate((el, value) => {
        el.innerHTML = value;
        el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertHTML', data: value }));
      }, html);
      return;
    }
  }

  throw new Error('Could not find Tistory editor area. Update selectors in src/publisher/tistory.ts');
}

async function ensureLoggedIn(page: Page) {
  const blogName = process.env.TISTORY_BLOG_NAME;
  if (!blogName) throw new Error('TISTORY_BLOG_NAME is not configured');

  await page.goto(`https://${blogName}.tistory.com/manage`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(2000);

  if (page.url().includes('login') || page.url().includes('kakao')) {
    throw new Error('Tistory session expired. Refresh TISTORY_COOKIE_JSON.');
  }
}

export async function checkTistorySession() {
  const context = await createContext();
  const page = await context.newPage();
  try {
    await ensureLoggedIn(page);
    return { ok: true, url: page.url() };
  } finally {
    await context.browser()?.close();
  }
}

export async function publishToTistory(input: TistoryPublishInput): Promise<TistoryPublishResult> {
  const blogName = process.env.TISTORY_BLOG_NAME;
  if (!blogName) throw new Error('TISTORY_BLOG_NAME is not configured');

  const html = input.bodyHtml || markdownToHtml(input.bodyMarkdown || '');
  const context = await createContext();
  const page = await context.newPage();

  try {
    await ensureLoggedIn(page);
    await page.goto(`https://${blogName}.tistory.com/manage/newpost`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(2500);

    page.on('dialog', async (dialog) => {
      await dialog.dismiss().catch(() => undefined);
    });

    const titleFilled = await fillFirst(
      page,
      ['textarea[placeholder*="제목"]', 'input[placeholder*="제목"]', 'textarea[name="title"]', 'input[name="title"]'],
      input.title
    );
    if (!titleFilled) throw new Error('Could not find title input. Update title selectors.');

    await setEditorHtml(page, html);

    if (input.tags?.length) {
      await fillFirst(
        page,
        ['input[placeholder*="태그"]', 'input[name*="tag"]', '.tag_input input'],
        input.tags.join(',')
      );
    }

    await clickIfVisible(page, ['button:has-text("완료")', 'button:has-text("발행")', 'button:has-text("저장")']);
    await page.waitForTimeout(1500);

    if (input.publishMode !== 'PUBLIC') {
      await clickIfVisible(page, [
        'label:has-text("비공개")',
        'button:has-text("비공개")',
        'input[value="private"]'
      ]);
    } else {
      await clickIfVisible(page, [
        'label:has-text("공개")',
        'button:has-text("공개")',
        'input[value="public"]'
      ]);
    }

    await clickIfVisible(page, ['button:has-text("발행")', 'button:has-text("저장")', 'button:has-text("완료")']);
    await page.waitForTimeout(4000);

    return {
      status: input.publishMode === 'PUBLIC' ? 'published' : 'drafted',
      url: page.url()
    };
  } finally {
    await context.browser()?.close();
  }
}
