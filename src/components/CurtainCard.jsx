'use client';
import { formatPrice } from '@/lib/shopify';

function imageScore(image,index,product,variant){const text=`${image?.alt||''} ${image?.src||''}`.toLowerCase();const title=`${product?.title||''} ${product?.product_type||''}`.toLowerCase();let score=120-index*4;if(/front|hero|model|lifestyle|look|main|campaign|on-body|on body/.test(text))score+=90;if(/back|rear|reverse|backside|blank|size chart|diagram|spec|packaging/.test(text))score-=180;if(variant?.image_id&&String(image?.id)===String(variant.image_id))score+=110;if(/shirt|tee|t-shirt|hoodie|sweatshirt|top|jacket/.test(title)&&index===0&&product?.images?.length>1&&!image?.alt)score-=18;return score}

export default function CurtainCard({ product, priority = false }) {
  if (!product) return null;
  const variant = product.variants?.find(item => item.available !== false) || product.variants?.[0];
  const ranked=[...(product.images||[])].map((image,index)=>({image,score:imageScore(image,index,product,variant)})).sort((a,b)=>b.score-a.score).map(x=>x.image);
  const cover=ranked[0]?.src;
  const reveal=ranked.find(image=>image.src!==cover)?.src||cover;
  const price = formatPrice(variant?.price);
  const productUrl = `/products/${product.handle}`;
  const hasReveal = reveal && reveal !== cover;

  return (
    <a href={productUrl} className="curtain" aria-label={product.title}>
      {hasReveal && <img src={reveal} alt="" className="curtain__base" loading={priority ? 'eager' : 'lazy'} />}
      {!hasReveal && cover && <img src={cover} alt={product.title} className="curtain__base" loading={priority ? 'eager' : 'lazy'} />}
      {hasReveal && <div className="curtain__panels" aria-hidden="true"><div className="curtain__panel curtain__panel--left" style={{ '--curtain-img': `url("${cover}")` }}/><div className="curtain__panel curtain__panel--right" style={{ '--curtain-img': `url("${cover}")` }}/></div>}
      <div className="curtain__meta"><span className="curtain__name">{product.title}</span><span className="curtain__price">{price}</span></div>
      {variant?.id && <span className="curtain__add">View the piece</span>}
    </a>
  );
}
