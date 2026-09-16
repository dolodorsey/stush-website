import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const source=readFileSync(new URL('../src/components/ProductInteractive.jsx',import.meta.url),'utf8');
const body=source.match(/const currentVariant = useMemo\(\(\) => \{([\s\S]*?)\n  \}, \[/)?.[1];
const stock=source.match(/const inStock = ([^;]+);/)?.[1];
if(!body||!stock)throw new Error('Component selection boundaries changed');
function select(variants,optionNames,selected){
 const firstAvailable=variants.find(v=>v.available!==false)||variants[0];
 const currentVariant=vm.runInNewContext('(function(){'+body+'})()', {variants,optionNames,selected,firstAvailable});
 return {variant:currentVariant,inStock:vm.runInNewContext(stock,{currentVariant})};
}
const options=[{name:'Color'},{name:'Size'}];
const variants=[{id:1,option1:'Black',option2:'S',available:true},{id:2,option1:'White',option2:'M',available:true},{id:3,option1:'Black',option2:'L',available:false}];
test('unavailable combination never substitutes first product',()=>{
 const r=select(variants,options,{Color:'Black',Size:'M'});assert.equal(r.variant,null);assert.equal(r.inStock,false);
});
test('incomplete selection cannot acquire a fallback',()=>{
 const r=select(variants,options,{Color:'Black'});assert.equal(r.variant,null);assert.equal(r.inStock,false);
});
test('exact combination retains its ID',()=>{
 const r=select(variants,options,{Color:'White',Size:'M'});assert.equal(r.variant.id,2);assert.equal(r.inStock,true);
});
test('sold-out exact combination remains disabled',()=>{
 const r=select(variants,options,{Color:'Black',Size:'L'});assert.equal(r.variant.id,3);assert.equal(r.inStock,false);
});
test('empty catalog cannot checkout',()=>{
 const r=select([],[],{});assert.equal(r.variant,null);assert.equal(r.inStock,false);
});
test('optionless product selects first available variant',()=>{
 const r=select([{id:1,available:false},{id:2,available:true}],[],{});assert.equal(r.variant.id,2);assert.equal(r.inStock,true);
});
