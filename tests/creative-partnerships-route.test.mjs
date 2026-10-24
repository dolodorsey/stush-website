import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/app/forms/influencer/page.jsx', import.meta.url), 'utf8');

test('STUSH creative intake uses exact, active parent-form routes', () => {
  assert.match(source, /https:\/\/apply\.stushusa\.com\/f\/stush\/model/);
  assert.match(source, /https:\/\/apply\.stushusa\.com\/f\/stush\/ambassador/);
  assert.doesNotMatch(source, /n8n\.cloud|khg-form-submit/);
});

test('STUSH creative intake never falsely confirms a submission', () => {
  assert.doesNotMatch(source, /fetch\(|<form\b|onSubmit=/);
  assert.match(source, /does not guarantee selection/);
});
