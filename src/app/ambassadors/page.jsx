"use client";
import { useMemo, useState } from "react";

const ENDPOINT = "https://dzlmtvodpyhetvektfuo.supabase.co/functions/v1/ambassador-intake";

const initial = {
  first_name:"", last_name:"", email:"", phone:"", instagram_handle:"", tiktok_handle:"",
  city:"", audience_size:"", average_story_views:"", average_reel_views:"",
  content_lane:"", monthly_commitment:"", referral_source:"", why_you:"", availability:"",
  consent:false, company_website:""
};

export default function StushAmbassadorsPage(){
  const [form,setForm]=useState(initial);
  const [status,setStatus]=useState("idle");
  const [message,setMessage]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const valid=useMemo(()=>form.first_name.trim().length>1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.instagram_handle.trim().length>1 && form.why_you.trim().length>=5 && form.consent,[form]);

  async function submit(e){
    e.preventDefault();
    if(!valid||status==="sending") return;
    setStatus("sending"); setMessage("");
    try{
      const r=await fetch(ENDPOINT,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
        brand_key:"stush",...form,
        full_name:`${form.first_name} ${form.last_name}`.trim(),
        audience_size:form.audience_size?Number(form.audience_size):null,
        average_story_views:form.average_story_views?Number(form.average_story_views):null,
        average_reel_views:form.average_reel_views?Number(form.average_reel_views):null,
        source:"stushusa.com/ambassadors"
      })});
      const body=await r.json().catch(()=>({}));
      if(!r.ok||!body.ok) throw new Error(body.error||"Application could not be submitted.");
      setStatus("success");
      setMessage(body.email?.provider_accepted
        ?"Application received. Check your email for confirmation."
        :"Application received. Our team will review it and contact you directly.");
      setForm(initial);
    }catch(err){setStatus("error");setMessage(err?.message||"Application could not be submitted.");}
  }

  return <main style={S.page}>
    <div style={S.glow}/>
    <section style={S.wrap}>
      <a href="/" style={S.back}>← STUSH</a>
      <div style={S.kicker}>STUSH AMBASSADOR PROGRAM</div>
      <h1 style={S.h1}>Wear the culture.<br/>Move the culture.</h1>
      <p style={S.lead}>We are building a selective network of people who can represent STUSH with consistency, taste and real influence. Acceptance is earned. Performance keeps you in.</p>

      {status==="success" ? <div style={S.success}><div style={S.check}>✓</div><h2>APPLICATION RECEIVED</h2><p>{message}</p><button onClick={()=>setStatus("idle")} style={S.button}>SUBMIT ANOTHER</button></div> :
      <form onSubmit={submit} style={S.card}>
        <div style={S.section}>01 — IDENTITY</div>
        <div style={S.grid}>
          <Field label="First name"><input value={form.first_name} onChange={e=>set("first_name",e.target.value)} required style={S.input}/></Field>
          <Field label="Last name"><input value={form.last_name} onChange={e=>set("last_name",e.target.value)} style={S.input}/></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} required style={S.input}/></Field>
          <Field label="Phone"><input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} style={S.input}/></Field>
          <Field label="City"><input value={form.city} onChange={e=>set("city",e.target.value)} placeholder="Atlanta" style={S.input}/></Field>
          <Field label="Instagram"><input value={form.instagram_handle} onChange={e=>set("instagram_handle",e.target.value)} placeholder="@username" required style={S.input}/></Field>
          <Field label="TikTok · optional"><input value={form.tiktok_handle} onChange={e=>set("tiktok_handle",e.target.value)} placeholder="@username" style={S.input}/></Field>
          <Field label="Audience size · optional"><input inputMode="numeric" value={form.audience_size} onChange={e=>set("audience_size",e.target.value)} style={S.input}/></Field>
        </div>

        <div style={S.section}>02 — CONTENT & REACH</div>
        <div style={S.grid}>
          <Field label="Average Story views · optional"><input inputMode="numeric" value={form.average_story_views} onChange={e=>set("average_story_views",e.target.value)} style={S.input}/></Field>
          <Field label="Average Reel/video views · optional"><input inputMode="numeric" value={form.average_reel_views} onChange={e=>set("average_reel_views",e.target.value)} style={S.input}/></Field>
          <Field label="Primary content lane"><input value={form.content_lane} onChange={e=>set("content_lane",e.target.value)} placeholder="Fashion, nightlife, lifestyle, creator..." style={S.input}/></Field>
          <Field label="Who referred you? · optional"><input value={form.referral_source} onChange={e=>set("referral_source",e.target.value)} style={S.input}/></Field>
          <Field label="Monthly commitment · optional"><input value={form.monthly_commitment} onChange={e=>set("monthly_commitment",e.target.value)} placeholder="2 Reels + 4 Stories" style={S.input}/></Field>
          <Field label="Availability · optional"><input value={form.availability} onChange={e=>set("availability",e.target.value)} placeholder="Events, nights, travel..." style={S.input}/></Field>
        </div>

        <Field label="Why should STUSH choose you?"><textarea value={form.why_you} onChange={e=>set("why_you",e.target.value)} required rows={6} style={S.textarea}/></Field>
        <label style={{display:"none"}}>Website<input tabIndex={-1} autoComplete="off" value={form.company_website} onChange={e=>set("company_website",e.target.value)}/></label>
        <label style={S.consent}><input type="checkbox" checked={form.consent} onChange={e=>set("consent",e.target.checked)}/><span>I agree to receive application and program communications from STUSH. Applying does not guarantee acceptance, product, compensation or an ambassador title.</span></label>
        {status==="error" && <div style={S.error}>{message}</div>}
        <button disabled={!valid||status==="sending"} style={{...S.button,opacity:valid?1:.4}}>{status==="sending"?"SUBMITTING...":"SUBMIT APPLICATION"}</button>
      </form>}
    </section>
  </main>
}

function Field({label,children}){return <label style={S.field}><span style={S.label}>{label}</span>{children}</label>}
const S={
  page:{minHeight:"100vh",background:"#070707",color:"#f4f0e8",fontFamily:"Arial,Helvetica,sans-serif",position:"relative",overflow:"hidden"},
  glow:{position:"fixed",width:600,height:600,borderRadius:"50%",background:"rgba(156,113,255,.11)",filter:"blur(90px)",top:-240,right:-180,pointerEvents:"none"},
  wrap:{width:"min(920px,calc(100% - 32px))",margin:"0 auto",padding:"48px 0 100px",position:"relative"},
  back:{color:"#8f8a80",textDecoration:"none",fontSize:12,letterSpacing:2},
  kicker:{marginTop:70,fontSize:11,letterSpacing:4,color:"#a889ff",fontWeight:800},
  h1:{fontSize:"clamp(48px,8vw,92px)",lineHeight:.92,letterSpacing:"-.055em",margin:"16px 0 24px",maxWidth:820},
  lead:{maxWidth:690,color:"#aaa49a",fontSize:17,lineHeight:1.7,marginBottom:34},
  card:{background:"rgba(16,16,16,.92)",border:"1px solid #262626",borderRadius:24,padding:"clamp(22px,5vw,44px)",boxShadow:"0 32px 90px rgba(0,0,0,.4)"},
  section:{fontSize:10,letterSpacing:3,color:"#a889ff",fontWeight:800,margin:"12px 0 20px"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14},
  field:{display:"block",marginBottom:16},
  label:{display:"block",fontSize:10,letterSpacing:1.5,textTransform:"uppercase",color:"#aaa49a",fontWeight:700,marginBottom:8},
  input:{width:"100%",boxSizing:"border-box",background:"#111",border:"1px solid #2b2b2b",borderRadius:11,color:"#fff",padding:"14px 15px",fontSize:16},
  textarea:{width:"100%",boxSizing:"border-box",background:"#111",border:"1px solid #2b2b2b",borderRadius:11,color:"#fff",padding:"14px 15px",fontSize:16,resize:"vertical"},
  consent:{display:"flex",gap:10,alignItems:"flex-start",color:"#8e8a82",fontSize:12,lineHeight:1.55,margin:"6px 0 20px"},
  button:{width:"100%",border:0,borderRadius:12,padding:"17px 20px",background:"#f4f0e8",color:"#080808",fontWeight:900,letterSpacing:2,cursor:"pointer"},
  error:{padding:12,border:"1px solid #743737",background:"#2b1111",borderRadius:10,color:"#ffb4b4",marginBottom:14},
  success:{background:"#111",border:"1px solid #2a2a2a",borderRadius:24,padding:"50px 32px",textAlign:"center"},
  check:{width:64,height:64,display:"grid",placeItems:"center",margin:"0 auto 18px",borderRadius:"50%",background:"#1d172e",color:"#b99cff",fontSize:30}
};
