import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src=readFileSync(new URL('../src/app/forms/page.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app/stush-intake-directory.css',import.meta.url),'utf8');
const layout=readFileSync(new URL('../src/app/layout.jsx',import.meta.url),'utf8');

test('all eight verified STUSH intake routes remain present and uniquely represented',()=>{
 const paths=['inquiry','sponsor','model','ambassador','host','podcast','promoter','nda'];
 for(const role of paths){
   assert.equal((src.match(new RegExp("href: '/forms/"+role+"'","g"))||[]).length,1,role);
 }
 assert.match(src,/id: 'creative'/);
 assert.match(src,/data-stush-intake-path/);
 assert.doesNotMatch(src,/n8n\.cloud|khg-form-submit|form action=/);
});

test('editorial directory is scoped, accessible and not a repeated button grid',()=>{
 assert.match(layout,/stush-intake-directory\.css/);
 assert.match(src,/aria-label="Application sections"/);
 assert.match(src,/aria-labelledby=/);
 assert.match(src,/data-qa="stush-intake-directory"/);
 assert.doesNotMatch(src,/className="btn-primary"/);
 assert.doesNotMatch(src,/stush-form__field/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css, /focus-visible/);
 assert.match(css, /prefers-reduced-motion/);
});
