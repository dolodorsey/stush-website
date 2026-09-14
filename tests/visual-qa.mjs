import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:3000';
const outDir = process.env.VISUAL_QA_DIR || 'artifacts/visual-qa';
const categoryKeys = ['women','essentials','outerwear','hoodies','jerseys','tops','bottoms','accessories'];

const desktopRoutes = [
  ['home', '/'], ['shop', '/shop'], ['collections', '/collections'], ['lookbook', '/lookbook'], ['journal', '/journal'],
  ...categoryKeys.map(key => [`category-${key}`, `/collections/${key}`]),
];
const mobileRoutes = [['home-mobile','/'],['shop-mobile','/shop'],['women-mobile','/collections/women'],['essentials-mobile','/collections/essentials']];
const tabletRoutes = [['home-tablet','/'],['shop-tablet','/shop'],['outerwear-tablet','/collections/outerwear']];
const wideRoutes = [['home-wide','/'],['lookbook-wide','/lookbook']];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const manifest = { generatedAt: new Date().toISOString(), baseURL, captures: [], checks: [] };

async function openAndAssert(page, route) {
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle', timeout: 90000 });
  if (!response || response.status() >= 400) throw new Error(`${route} returned ${response?.status() ?? 'no response'}`);
  const overflow = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  if (overflow.width > overflow.viewport + 2) throw new Error(`${route} has horizontal overflow: ${overflow.width}px > ${overflow.viewport}px`);
}

async function warmVisualAssets(page) {
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
  });

  await page.evaluate(async () => {
    const step = Math.max(420, Math.floor(window.innerHeight * .68));
    let max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 90));
      max = Math.max(max, document.documentElement.scrollHeight);
    }
  });

  const imageCount = await page.locator('img').count();
  for (let index = 0; index < imageCount; index += 1) {
    const image = page.locator('img').nth(index);
    await image.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(25);
    await image.evaluate(async img => {
      if (img.complete && img.naturalWidth > 0) return;
      await Promise.race([
        new Promise(resolve => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }),
        new Promise(resolve => setTimeout(resolve, 2500)),
      ]);
      if (img.decode) { try { await img.decode(); } catch {} }
    }).catch(() => {});
  }

  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  await page.waitForFunction(() => window.scrollY === 0, null, { timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(350);
}

async function assertCommerceVisibility(page, route) {
  const commerce = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.stush-product-card')];
    const broken = cards.map((card, index) => {
      const style = getComputedStyle(card);
      const rect = card.getBoundingClientRect();
      const media = card.querySelector('.stush-product-card__media');
      const image = media?.querySelector('img.stush-product-card__img--primary') || media?.querySelector('img');
      const imageStyle = image ? getComputedStyle(image) : null;
      const imageRect = image?.getBoundingClientRect();
      return {
        index,
        title: card.querySelector('.stush-product-card__name')?.textContent?.trim() || '',
        opacity: Number.parseFloat(style.opacity || '1'),
        visibility: style.visibility,
        display: style.display,
        width: rect.width,
        height: rect.height,
        hasImage: Boolean(image),
        complete: image?.complete ?? false,
        naturalWidth: image?.naturalWidth ?? 0,
        naturalHeight: image?.naturalHeight ?? 0,
        currentSrc: image?.currentSrc || image?.src || '',
        imageOpacity: imageStyle ? Number.parseFloat(imageStyle.opacity || '1') : 0,
        imageWidth: imageRect?.width || 0,
        imageHeight: imageRect?.height || 0,
      };
    }).filter(item => item.opacity < .95 || item.visibility === 'hidden' || item.display === 'none' || item.width < 20 || item.height < 20 || !item.hasImage || !item.complete || item.naturalWidth < 50 || item.naturalHeight < 50 || !item.currentSrc || item.imageOpacity < .9 || item.imageWidth < 20 || item.imageHeight < 20);

    const summary = document.querySelector('.collection-browser__summary strong');
    const editFloor = document.querySelector('.edit-product-floor');
    return {
      count: cards.length,
      broken,
      expectedShopCount: summary ? Number.parseInt(summary.textContent || '0', 10) : null,
      expectedEditCount: editFloor ? Number.parseInt(editFloor.dataset.productCount || '0', 10) : null,
    };
  });

  manifest.checks.push({ route, type: 'commerce', count: commerce.count, broken: commerce.broken.length });
  if (commerce.broken.length) throw new Error(`${route} has ${commerce.broken.length} broken commerce image/card(s): ${JSON.stringify(commerce.broken.slice(0, 8))}`);
  if (route === '/shop' && commerce.expectedShopCount !== null && commerce.count !== commerce.expectedShopCount) throw new Error(`/shop renders ${commerce.count} cards but live summary says ${commerce.expectedShopCount}`);
  if (route.startsWith('/collections/') && commerce.expectedEditCount !== null && commerce.count !== commerce.expectedEditCount) throw new Error(`${route} renders ${commerce.count} cards but editorial floor expects ${commerce.expectedEditCount}`);
}

async function assertEditorialImages(page, route) {
  const result = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('.lookbook img,.journal-lead img,.journal-story img,.edit-stage img,.category-landing img,.flag-campaign img,.flag-atelier img')];
    const broken = nodes.map((img, index) => ({
      index,
      alt: img.alt || '',
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      currentSrc: img.currentSrc || img.src || '',
      opacity: Number.parseFloat(getComputedStyle(img).opacity || '1'),
      width: img.getBoundingClientRect().width,
      height: img.getBoundingClientRect().height,
    })).filter(item => !item.complete || item.naturalWidth < 50 || item.naturalHeight < 50 || !item.currentSrc || item.opacity < .1 || item.width < 20 || item.height < 20);
    return { count: nodes.length, broken };
  });
  manifest.checks.push({ route, type: 'editorial-images', count: result.count, broken: result.broken.length });
  if (result.broken.length) throw new Error(`${route} has ${result.broken.length} broken editorial image(s): ${JSON.stringify(result.broken.slice(0, 8))}`);
}

async function assertNoSuspiciousBlankBlocks(page, route) {
  const blanks = await page.evaluate(() => {
    const selectors = ['main section','.collection-browser__grid','.lookbook','.journal-issues__grid','.edit-product-grid'];
    const nodes = [...new Set(selectors.flatMap(selector => [...document.querySelectorAll(selector)]))];
    return nodes.map((node, index) => {
      const rect = node.getBoundingClientRect();
      const text = node.textContent?.replace(/\s+/g,' ').trim() || '';
      const media = [...node.querySelectorAll('img,video')].filter(item => {
        const style = getComputedStyle(item); const box = item.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number.parseFloat(style.opacity || '1') > .1 && box.width > 20 && box.height > 20;
      }).length;
      const controls = node.querySelectorAll('a,button,input').length;
      return { index, className: node.className || node.tagName, height: rect.height, textLength: text.length, media, controls };
    }).filter(item => item.height > 320 && item.textLength < 4 && item.media === 0 && item.controls === 0);
  });
  if (blanks.length) throw new Error(`${route} contains suspicious blank region(s): ${JSON.stringify(blanks.slice(0,5))}`);
}

async function assertHomepageContract(page) {
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  await page.waitForFunction(() => window.scrollY === 0, null, { timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(350);

  const hero = page.locator('[data-qa="animation-hero"]');
  const postHero = page.locator('[data-qa="post-hero-copy"]');
  const nav = page.locator('nav.nav');
  await hero.waitFor({ state: 'visible' }); await postHero.waitFor({ state: 'visible' }); await nav.waitFor({ state: 'visible' });
  const contract = await hero.evaluate(node => ({ text: node.textContent?.replace(/\s+/g,' ').trim() || '', prohibitedCount: node.querySelectorAll('h1,h2,h3,h4,p,a,button,span,label,[role="button"]').length, childTags: [...node.children].map(child => child.tagName.toLowerCase()) }));
  if (contract.text !== '' || contract.prohibitedCount !== 0) throw new Error('Homepage animation contains marketing/interface copy');
  if (!contract.childTags.includes('video')) throw new Error('Homepage animation contract requires a video element');
  const geometry = await page.evaluate(() => {
    const rect = selector => { const node = document.querySelector(selector); if (!node) return null; const box = node.getBoundingClientRect(); return {top:box.top,bottom:box.bottom,width:box.width,height:box.height}; };
    const mediaNode = document.querySelector('[data-qa="animation-hero"] video');
    return { scrollY: window.scrollY, hero:rect('[data-qa="animation-hero"]'), post:rect('[data-qa="post-hero-copy"]'), nav:rect('nav.nav'), media:rect('[data-qa="animation-hero"] video'), objectFit:mediaNode ? getComputedStyle(mediaNode).objectFit : null };
  });
  console.log('Homepage geometry at QA top:', JSON.stringify(geometry));
  if (!geometry.hero || !geometry.post || !geometry.nav || !geometry.media) throw new Error('Missing homepage QA geometry target');
  if (geometry.scrollY === 0 && geometry.nav.bottom > geometry.hero.top + 4) throw new Error(`Navigation overlaps homepage animation: ${JSON.stringify(geometry)}`);
  if (geometry.post.top < geometry.hero.bottom - 2) throw new Error('Post-hero copy overlaps homepage animation');
  if (geometry.media.width / geometry.hero.width < .98 || geometry.media.height / geometry.hero.height < .98 || geometry.objectFit !== 'cover') throw new Error('Homepage video does not fully cover its animation canvas');
}

async function assertCategoryIdentity(page, route) {
  if (!categoryKeys.some(key => route === `/collections/${key}`)) return;
  const identity = await page.evaluate(() => ({ category: document.querySelector('[data-qa="category-edit"]')?.dataset.category || '', stage: document.querySelectorAll('.edit-stage__piece img').length, code: document.querySelectorAll('.edit-code > div').length, floor: document.querySelectorAll('.edit-product-floor').length }));
  if (!identity.category || identity.code < 4 || identity.floor !== 1) throw new Error(`${route} failed category identity contract: ${JSON.stringify(identity)}`);
}

async function capture(viewport, routes, { fullPage = true } = {}) {
  const context = await browser.newContext({ viewport });
  for (const [name, route] of routes) {
    const page = await context.newPage();
    await openAndAssert(page, route);
    await warmVisualAssets(page);

    const screenshotPath = path.join(outDir, `${name}-${viewport.width}x${viewport.height}.png`);
    await page.screenshot({ path: screenshotPath, fullPage });
    manifest.captures.push({ name, route, viewport, fullPage, file: path.basename(screenshotPath) });
    console.log(`Captured ${screenshotPath}`);

    await assertCommerceVisibility(page, route);
    await assertEditorialImages(page, route);
    await assertNoSuspiciousBlankBlocks(page, route);
    await assertCategoryIdentity(page, route);
    if (route === '/') await assertHomepageContract(page);
    await page.close();
  }
  await context.close();
}

try {
  await capture({ width: 1440, height: 1100 }, desktopRoutes, { fullPage: true });
  await capture({ width: 390, height: 844 }, mobileRoutes, { fullPage: true });
  await capture({ width: 768, height: 1024 }, tabletRoutes, { fullPage: false });
  await capture({ width: 1920, height: 1080 }, wideRoutes, { fullPage: false });
  await fs.writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`STUSH visual QA v2 passed. ${manifest.captures.length} screenshots written to ${outDir}`);
} finally {
  await browser.close();
}
