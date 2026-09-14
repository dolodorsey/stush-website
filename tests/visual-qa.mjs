import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:3000';
const outDir = process.env.VISUAL_QA_DIR || 'artifacts/visual-qa';

const desktopRoutes = [
  ['home', '/'],
  ['shop', '/shop'],
  ['collections', '/collections'],
  ['lookbook', '/lookbook'],
  ['journal', '/journal'],
];
const mobileRoutes = [
  ['home-mobile', '/'],
  ['shop-mobile', '/shop'],
];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function openAndAssert(page, route) {
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle', timeout: 90000 });
  if (!response || response.status() >= 400) {
    throw new Error(`${route} returned ${response?.status() ?? 'no response'}`);
  }

  const overflow = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  if (overflow.width > overflow.viewport + 2) {
    throw new Error(`${route} has horizontal overflow: ${overflow.width}px > ${overflow.viewport}px`);
  }
}

async function assertHomepageContract(page) {
  const hero = page.locator('[data-qa="animation-hero"]');
  const postHero = page.locator('[data-qa="post-hero-copy"]');
  const nav = page.locator('nav.nav');

  await hero.waitFor({ state: 'visible' });
  await postHero.waitFor({ state: 'visible' });
  await nav.waitFor({ state: 'visible' });

  const contract = await hero.evaluate((node) => {
    const prohibited = [...node.querySelectorAll('h1,h2,h3,h4,p,a,button,span,label,[role="button"]')];
    const text = node.textContent?.replace(/\s+/g, ' ').trim() || '';
    return {
      text,
      prohibitedCount: prohibited.length,
      childTags: [...node.children].map((child) => child.tagName.toLowerCase()),
    };
  });

  if (contract.text !== '') {
    throw new Error(`Homepage animation contains visible/DOM text: "${contract.text}"`);
  }
  if (contract.prohibitedCount !== 0) {
    throw new Error(`Homepage animation contains ${contract.prohibitedCount} prohibited marketing/interface element(s)`);
  }
  if (!contract.childTags.includes('video')) {
    throw new Error('Homepage animation contract requires a video element');
  }

  const geometry = await page.evaluate(() => {
    const rect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const box = node.getBoundingClientRect();
      return { top: box.top, right: box.right, bottom: box.bottom, left: box.left, width: box.width, height: box.height };
    };
    const mediaNode = document.querySelector('[data-qa="animation-hero"] video');
    const mediaStyle = mediaNode ? getComputedStyle(mediaNode) : null;
    return {
      hero: rect('[data-qa="animation-hero"]'),
      post: rect('[data-qa="post-hero-copy"]'),
      nav: rect('nav.nav'),
      announce: rect('.announce'),
      media: rect('[data-qa="animation-hero"] video'),
      mediaStyle: mediaStyle ? { objectFit: mediaStyle.objectFit, position: mediaStyle.position } : null,
    };
  });

  console.log('Homepage visual geometry:', JSON.stringify(geometry));

  if (!geometry.hero || !geometry.post || !geometry.nav || !geometry.media || !geometry.mediaStyle) {
    throw new Error('Missing homepage QA geometry target');
  }
  if (geometry.nav.bottom > geometry.hero.top + 2) {
    throw new Error(`Navigation overlaps animation: nav bottom ${geometry.nav.bottom}, hero top ${geometry.hero.top}`);
  }
  if (geometry.post.top < geometry.hero.bottom - 2) {
    throw new Error(`Post-hero copy overlaps animation: post top ${geometry.post.top}, hero bottom ${geometry.hero.bottom}`);
  }

  const widthCoverage = geometry.media.width / geometry.hero.width;
  const heightCoverage = geometry.media.height / geometry.hero.height;
  if (widthCoverage < 0.98 || heightCoverage < 0.98 || geometry.mediaStyle.objectFit !== 'cover') {
    throw new Error(`Homepage video coverage failed: width=${widthCoverage.toFixed(3)}, height=${heightCoverage.toFixed(3)}, object-fit=${geometry.mediaStyle.objectFit}`);
  }
}

async function capture(viewport, routes) {
  const context = await browser.newContext({ viewport });
  for (const [name, route] of routes) {
    const page = await context.newPage();
    await openAndAssert(page, route);

    const screenshotPath = path.join(outDir, `${name}-${viewport.width}x${viewport.height}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Captured ${screenshotPath}`);

    if (route === '/') await assertHomepageContract(page);
    await page.close();
  }
  await context.close();
}

try {
  await capture({ width: 1440, height: 1100 }, desktopRoutes);
  await capture({ width: 390, height: 844 }, mobileRoutes);
  console.log(`STUSH visual QA passed. Screenshots written to ${outDir}`);
} finally {
  await browser.close();
}
