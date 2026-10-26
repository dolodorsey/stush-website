import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const route = readFileSync(new URL('../src/app/forms/[type]/page.jsx', import.meta.url), 'utf8');
const index = readFileSync(new URL('../src/app/forms/page.jsx', import.meta.url), 'utf8');

test('all public STUSH form choices lead through the centralized intake, not n8n', () => {
  assert.match(route, /apply\.stushusa\.com\/f\/stush\//);
  for (const role of ['inquiry','sponsor','model','ambassador','host','nda','podcast','promoter']) {
    assert.match(route, new RegExp(`['"]${role}['"]`));
  }
  assert.doesNotMatch(route + index, /n8n\.cloud|khg-form-submit/);
});

test('all entry points have a branded index and unknown slugs cannot submit as inquiry', () => {
  for (const path of ['/forms/inquiry','/forms/sponsor','/forms/model','/forms/ambassador']) {
    assert.ok(index.includes(path), `missing route ${path}`);
  }
  assert.match(route, /notFound\(\)/);
  assert.match(route, /influencer/);
  assert.doesNotMatch(route, /submit.*Received\./);
});
