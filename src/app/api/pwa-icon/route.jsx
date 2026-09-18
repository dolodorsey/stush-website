import {ImageResponse} from 'next/og';
export const runtime='edge';
export async function GET(request){
  const requested=Number(new URL(request.url).searchParams.get('size')||512);
  const size=[180,192,512].includes(requested)?requested:512;
  const logo=new URL('/brand/StushW.png',request.url).toString();
  return new ImageResponse(
    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#111',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:'5%',border:'2px solid rgba(242,238,231,.35)'}}/>
      <img src={logo} alt="STUSH" style={{width:'84%',height:'84%',objectFit:'contain'}}/>
    </div>,{width:size,height:size}
  );
}