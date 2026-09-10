'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

const WEBHOOK = 'https://dorsey.app.n8n.cloud/webhook/khg-form-submit';

const FORMS = {
  inquiry: {
    kicker: 'CLIENT SERVICES',
    title: 'Talk to the house.',
    intro: 'Sizing, order support, private shopping and general STUSH inquiries.',
    submit: 'Send inquiry',
    fields: [
      { name:'full_name', label:'Full name', type:'text', required:true },
      { name:'email', label:'Email', type:'email', required:true },
      { name:'phone', label:'Phone', type:'tel' },
      { name:'subject', label:'Subject', type:'text', required:true },
      { name:'message', label:'How can we help?', type:'textarea', required:true, full:true },
    ],
  },
  influencer: {
    kicker: 'CREATIVE PARTNERSHIPS',
    title: 'Enter the STUSH world.',
    intro: 'For stylists, creators, photographers, talent and culture partners who fit the house.',
    submit: 'Submit partnership',
    fields: [
      { name:'full_name', label:'Full name', type:'text', required:true },
      { name:'email', label:'Email', type:'email', required:true },
      { name:'instagram', label:'Instagram / social', type:'text', required:true },
      { name:'city', label:'City', type:'text' },
      { name:'audience', label:'Audience / following', type:'text' },
      { name:'portfolio', label:'Portfolio / website', type:'text' },
      { name:'pitch', label:'Tell us what you want to create with STUSH', type:'textarea', required:true, full:true },
    ],
  },
  sponsor: {
    kicker: 'BRAND PARTNERSHIPS',
    title: 'Build something with STUSH.',
    intro: 'For campaigns, retail, hospitality, cultural collaborations, product placement and strategic brand partnerships.',
    submit: 'Start conversation',
    fields: [
      { name:'full_name', label:'Contact name', type:'text', required:true },
      { name:'email', label:'Work email', type:'email', required:true },
      { name:'company', label:'Company / brand', type:'text', required:true },
      { name:'role', label:'Role', type:'text' },
      { name:'website', label:'Website', type:'text' },
      { name:'budget_range', label:'Estimated budget', type:'select', options:['Under $5,000','$5,000–$15,000','$15,000–$50,000','$50,000–$100,000','$100,000+'] },
      { name:'interest', label:'What do you want to build?', type:'textarea', required:true, full:true },
    ],
  },
};

function Field({ field, value, onChange }) {
  if (field.type === 'textarea') return <textarea id={field.name} name={field.name} required={field.required} value={value || ''} onChange={e=>onChange(field.name,e.target.value)} rows={6}/>;
  if (field.type === 'select') return <select id={field.name} name={field.name} value={value || ''} onChange={e=>onChange(field.name,e.target.value)}><option value="">Select</option>{field.options.map(option=><option key={option} value={option}>{option}</option>)}</select>;
  return <input id={field.name} type={field.type} name={field.name} required={field.required} value={value || ''} onChange={e=>onChange(field.name,e.target.value)}/>;
}

export default function StushFormPage() {
  const params = useParams();
  const type = typeof params?.type === 'string' && FORMS[params.type] ? params.type : 'inquiry';
  const form = useMemo(() => FORMS[type], [type]);
  const [values,setValues] = useState({});
  const [state,setState] = useState('idle');
  const [message,setMessage] = useState('');
  const setValue = (name,value) => setValues(current => ({...current,[name]:value}));

  const submit = async event => {
    event.preventDefault();
    setState('sending');
    setMessage('');
    try {
      const response = await fetch(WEBHOOK, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ brand:'STUSH', brand_key:'stush', form_type:type, source:'stushusa.com', ...values }) });
      if (!response.ok) throw new Error('Submission failed');
      setState('sent');
      setMessage('Received. The STUSH team will follow up through the contact information you provided.');
      setValues({});
    } catch (error) {
      setState('error');
      setMessage('We could not send this right now. Please try again.');
    }
  };

  return (
    <section className="stush-form-page">
      <div className="stush-form-intro" data-stush-reveal>
        <span className="stush-utility-kicker">STUSH / {form.kicker}</span>
        <h1>{form.title}</h1>
        <p>{form.intro}</p>
        <div className="stush-form-switcher">
          <a className={type==='inquiry'?'is-active':''} href="/forms/inquiry">Client services</a>
          <a className={type==='influencer'?'is-active':''} href="/forms/influencer">Creative partnerships</a>
          <a className={type==='sponsor'?'is-active':''} href="/forms/sponsor">Brand partnerships</a>
        </div>
      </div>
      <form className="stush-form" onSubmit={submit} data-stush-reveal>
        <div className="stush-form__grid">
          {form.fields.map(field => <label key={field.name} className={field.full?'stush-form__field stush-form__field--full':'stush-form__field'} htmlFor={field.name}><span>{field.label}{field.required && <em>*</em>}</span><Field field={field} value={values[field.name]} onChange={setValue}/></label>)}
        </div>
        <div className="stush-form__bottom">
          <button type="submit" className="btn-primary" disabled={state==='sending'}>{state==='sending'?'Sending…':form.submit}</button>
          <span>STUSH · ATLANTA · PRIVATE INQUIRIES</span>
        </div>
        {message && <p className={`stush-form__message stush-form__message--${state}`} role="status">{message}</p>}
      </form>
    </section>
  );
}
