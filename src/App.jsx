import { useState, useEffect, useCallback } from "react";

const COACHES = ["김윤정","임서영","윤민정","나지수","서예린"];
const ADMIN = "김윤정";

const TASKS = [
  {id:1,title:"신입코치 영상 1",sub:"V-CAM",url:"https://vcampus.educo.co.kr/login",color:"#5C6BC0"},
  {id:2,title:"신입코치 영상 2",sub:"V-CAM",url:"https://vcampus.educo.co.kr/login",color:"#5C6BC0"},
  {id:3,title:"한국코칭심리협회 TLC 3급",sub:"IKCPA",url:"http://www.ikcpa.or.kr/",color:"#26A69A"},
  {id:4,title:"인생코칭",sub:"",url:"",color:"#EF5350"},
  {id:5,title:"한국코칭심리협회 플래닝코칭",sub:"IKCPA",url:"http://www.ikcpa.or.kr/",color:"#26A69A"},
  {id:6,title:"퍼스트코칭",sub:"코칭존 사이트에서 신청",url:"",color:"#F57C00"},
  {id:7,title:"직무컨설팅",sub:"업무 1:1 학습 · 코칭존 사이트",url:"",color:"#F57C00"},
  {id:8,title:"타겟프로필 만들기",sub:"",url:"",color:"#7B1FA2"},
];

const RESOURCES = [
  {id:"r1",category:"무료수업",title:"무료수업 리뉴얼 툴",desc:"전과목 AI 결과지",url:"https://padlet.com/lyeisgoddess1031/tool-zfu04shzep9ywro3",color:"#1565C0"},
  {id:"r2",category:"마케팅",title:"타겟마케팅 올인원",desc:"e상상코칭부 리더용",url:"https://bit.ly/4edfHgS",color:"#7B1FA2"},
  {id:"r3",category:"코치 매뉴얼",title:"코치 매뉴얼 (Notion)",desc:"코치용 전체 매뉴얼",url:"https://mvpworld.notion.site/7725b8a36d144cf5ae4b908f6b49bd15?v=605b84dbd1614a10b3e1c50e0268fba7",color:"#333"},
  {id:"r4",category:"코치 매뉴얼",title:"e상상코칭부 올인원",desc:"코치 업무 전반 자료",url:"https://bit.ly/4dfIeT8",color:"#333"},
  {id:"r5",category:"코치 매뉴얼",title:"신입코치 안내 패들렛",desc:"온보딩 안내 자료",url:"https://padlet.com/wawacoachingsongdo/breakout-link/QgJV4ZzZYE7K4mBk-WZ3GbDk20knvL0p6",color:"#333"},
  {id:"r6",category:"수수료",title:"e상상 코치 수수료",desc:"수수료 안내",url:"https://m.site.naver.com/1rFJ3",color:"#00796B"},
  {id:"r7",category:"수수료",title:"코칭센터 코치 수수료",desc:"수수료 안내",url:"https://m.site.naver.com/1rFUc",color:"#00796B"},
  {id:"r8",category:"수수료",title:"수수료 전체 스프레드시트",desc:"수수료 상세 표 (Google Sheets)",url:"https://docs.google.com/spreadsheets/d/18u7vZ-N8HT7cJ1qRD7b-R9VGg4MGo23x/edit?pli=1&gid=1541444167#gid=1541444167",color:"#00796B"},
  {id:"r9",category:"무료수업",title:"무료수업 올인원",desc:"30분 프로세스 및 자료",url:"https://sites.google.com/view/sangsangexam/",color:"#1565C0"},
  {id:"r10",category:"무료수업",title:"무료수업 자료실 패들렛",desc:"자료실 사이트",url:"https://padlet.com/oneleader/padlet-hfw5ssnesbv9biok",color:"#1565C0"},
  {id:"r11",category:"국어",title:"네모국어",desc:"무료 자료실 이용 추천",url:"https://nemokorean.com/front/main",color:"#C62828"},
  {id:"r12",category:"국어",title:"기출비 (국어)",desc:"전과목 기출 및 자료",url:"https://cafe.naver.com/michiexam/849033",color:"#C62828"},
  {id:"r13",category:"국어",title:"EBS 단추",desc:"시험지 만들기·기출 풀기",url:"https://ai.ebs.co.kr/",color:"#C62828"},
  {id:"r14",category:"영어",title:"더 클래스",desc:"파닉스·초등독해·중등 그래머",url:"http://www.theclassenglish.com/",color:"#1565C0"},
  {id:"r15",category:"영어",title:"내신콘서트",desc:"중등 내신대비 기출문제",url:"https://www.naesinconcert.com/",color:"#1565C0"},
  {id:"r16",category:"영어",title:"족보닷컴",desc:"기출문제 자료",url:"https://www.zocbo.com/freetrial/zocbo.asp",color:"#1565C0"},
  {id:"r17",category:"영어",title:"워크시트메이커",desc:"영어지문 검색·문제 만들기",url:"https://www.worksheetmaker.co.kr/",color:"#1565C0"},
  {id:"r18",category:"입시·진로",title:"대학 어디가",desc:"직업·대학·학과·성적 분석",url:"https://adiga.kr/man/inf/mainView.do?menuId=PCMANINF1000",color:"#2E7D32"},
  {id:"r19",category:"입시·진로",title:"메이저맵",desc:"대학·학과 정보 한눈에",url:"https://www.majormap.net/",color:"#2E7D32"},
  {id:"r20",category:"도구",title:"I ♡ PDF",desc:"PDF 편집·분할·변환",url:"https://www.ilovepdf.com/ko",color:"#555"},
];

const RES_CATS = ["전체","무료수업","마케팅","코치 매뉴얼","수수료","국어","영어","입시·진로","도구"];

const SETTLE = [
  {month:"1개월차",rows:[
    {cond:"화상(방문無) — 0T",화상:0,방문화상:"+0원",계약해지:"300,000원 × 당월 계약이행 일수(계약일~M+1월8일) ÷ 당월 전체 일수"},
    {cond:"0T초과~10T미만",화상:300000,방문화상:"+100,000원"},
    {cond:"10T이상~20T미만",화상:null,방문화상:"+200,000원"},
    {cond:"20T이상~30T미만",화상:null,방문화상:"+300,000원"},
    {cond:"30T이상~40T미만",화상:null,방문화상:"+400,000원"},
    {cond:"40T이상~",화상:null,방문화상:"+500,000원"},
  ]},
  {month:"2개월차",rows:[
    {cond:"0T",화상:0,방문화상:0,계약해지:"500,000원 × 당월 계약이행 일수(9일~최종교육참석일) ÷ 당월 전체 일수"},
    {cond:"0T초과~10T미만",화상:200000,방문화상:200000},
    {cond:"10T이상~20T미만",화상:350000,방문화상:400000},
    {cond:"20T이상~",화상:500000,방문화상:600000},
  ]},
  {month:"3개월차",rows:[
    {cond:"0T",화상:0,방문화상:0,계약해지:"500,000원 × 당월 계약이행 일수(9일~최종교육참석일) ÷ 당월 전체 일수"},
    {cond:"0T초과~10T미만",화상:200000,방문화상:200000},
    {cond:"10T이상~20T미만",화상:350000,방문화상:400000},
    {cond:"20T이상~",화상:500000,방문화상:600000},
  ]},
  {month:"4개월차 (추가)",rows:[
    {cond:"35T이상~",화상:200000,방문화상:200000,계약해지:"200,000원 × 당월 계약이행 일수(9일~최종교육참석일) ÷ 당월 전체 일수"},
  ]},
];

const DAYS=["일","월","화","수","목","금","토"];
function getMonthDays(y,m){return{first:new Date(y,m,1).getDay(),total:new Date(y,m+1,0).getDate()};}

const SK_EV="sc2_events",SK_NT="sc2_notices",SK_CH="sc2_checks_";

async function stLoad(key,def){
  try{const r=await window.storage.get(key);return r?JSON.parse(r.value):def;}catch{return def;}
}
async function stSave(key,val){
  try{await window.storage.set(key,JSON.stringify(val));}catch{}
}

export default function App(){
  const [user,setUser]=useState(null);
  const [inp,setInp]=useState("");
  const [err,setErr]=useState("");
  const today=new Date();
  const [y,setY]=useState(today.getFullYear());
  const [m,setM]=useState(today.getMonth());
  const [events,setEvents]=useState([]);
  const [notices,setNotices]=useState([]);
  const [checks,setChecks]=useState({});
  const [loaded,setLoaded]=useState(false);
  const [tab,setTab]=useState("calendar");
  const [resCat,setResCat]=useState("전체");
  const [showEv,setShowEv]=useState(false);
  const [showNt,setShowNt]=useState(false);
  const [newEv,setNewEv]=useState({title:"",date:"",desc:""});
  const [newNt,setNewNt]=useState({title:"",content:""});
  const [selDay,setSelDay]=useState(null);

  useEffect(()=>{
    (async()=>{
      const ev=await stLoad(SK_EV,[]);
      const nt=await stLoad(SK_NT,[]);
      setEvents(ev);setNotices(nt);setLoaded(true);
    })();
  },[]);

  useEffect(()=>{
    if(!user)return;
    (async()=>{const c=await stLoad(SK_CH+user,{});setChecks(c);})();
  },[user]);

  function login(){const n=inp.trim();if(!n){setErr("이름을 입력해 주세요.");return;}if(!COACHES.includes(n)){setErr("등록되지 않은 이름입니다.");return;}setUser(n);}

  async function toggleCheck(id){const next={...checks,[id]:!checks[id]};setChecks(next);await stSave(SK_CH+user,next);}
  async function addEvent(){if(!newEv.title||!newEv.date)return;const next=[...events,{...newEv,id:Date.now()}];setEvents(next);await stSave(SK_EV,next);setNewEv({title:"",date:"",desc:""});setShowEv(false);}
  async function delEvent(id){const next=events.filter(e=>e.id!==id);setEvents(next);await stSave(SK_EV,next);}
  async function addNotice(){if(!newNt.title)return;const next=[{...newNt,id:Date.now(),date:new Date().toLocaleDateString("ko-KR")},...notices];setNotices(next);await stSave(SK_NT,next);setNewNt({title:"",content:""});setShowNt(false);}
  async function delNotice(id){const next=notices.filter(n=>n.id!==id);setNotices(next);await stSave(SK_NT,next);}

  const {first,total}=getMonthDays(y,m);
  const cells=Array.from({length:first+total},(_,i)=>i<first?null:i-first+1);
  function evForDay(d){if(!d)return[];const ds=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;return events.filter(e=>e.date===ds);}
  function isToday(d){return d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();}

  const isAdmin=user===ADMIN;
  const done=TASKS.filter(t=>checks[t.id]).length;
  const filtRes=resCat==="전체"?RESOURCES:RESOURCES.filter(r=>r.category===resCat);

  const fw=n=>n?.toLocaleString("ko-KR")+"원";

  const css=`
    *{box-sizing:border-box;}
    .portal{max-width:780px;margin:0 auto;padding:1rem;font-family:var(--font-sans);}
    .tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1rem;}
    .card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:12px;padding:1rem 1.25rem;margin-bottom:1rem;}
    .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}
    .cal-cell{min-height:54px;padding:4px;border-radius:6px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);}
    .cal-cell.today{background:#E8EAF6;border:1.5px solid #5C6BC0;}
    .res-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;}
    .settle-table{width:100%;border-collapse:collapse;font-size:12px;}
    .settle-table th,.settle-table td{border:0.5px solid var(--color-border-tertiary);padding:6px 8px;text-align:center;vertical-align:middle;}
    .settle-table th{background:var(--color-background-secondary);font-weight:500;font-size:11px;}
    .settle-table .month-header{background:#E8EAF6;color:#3949AB;font-weight:500;}
    .settle-table .highlight{color:#D32F2F;font-weight:500;}
    .settle-table .note-row td{font-size:10px;color:var(--color-text-secondary);text-align:left;background:var(--color-background-secondary);}
    input,textarea,select{background:var(--color-background-secondary);color:var(--color-text-primary);border:0.5px solid var(--color-border-secondary);border-radius:8px;padding:8px 10px;font-size:14px;width:100%;margin-bottom:8px;}
  `;

  if(!user) return (
    <>
      <style>{css}</style>
      <div style={{minHeight:500,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--color-background-tertiary)"}}>
        <div style={{background:"var(--color-background-primary)",borderRadius:16,border:"0.5px solid var(--color-border-tertiary)",padding:"2.5rem 2rem",width:320,textAlign:"center"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"#E8EAF6",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:26}}>🌟</div>
          <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:500}}>상상코칭 포털</h2>
          <p style={{color:"var(--color-text-secondary)",fontSize:13,margin:"0 0 1.5rem"}}>신입코치 포털에 오신 것을 환영합니다</p>
          <input value={inp} onChange={e=>{setInp(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="이름을 입력하세요" style={{marginBottom:8}}/>
          {err&&<p style={{color:"#EF5350",fontSize:12,margin:"0 0 8px"}}>{err}</p>}
          <button onClick={login} style={{width:"100%",padding:10,borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",fontSize:15,fontWeight:500,cursor:"pointer"}}>로그인</button>
          <p style={{fontSize:11,color:"var(--color-text-tertiary)",marginTop:12}}>등록된 코치 이름으로 로그인하세요</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="portal">
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
          <div>
            <h2 style={{margin:0,fontSize:18,fontWeight:500}}>상상코칭 포털</h2>
            <p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)"}}>{isAdmin?"👑 부서장 (관리자)":"👋 "+user+" 코치님"}</p>
          </div>
          <button onClick={()=>{setUser(null);setChecks({});}} style={{fontSize:12,padding:"6px 12px",borderRadius:8,cursor:"pointer",background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",color:"var(--color-text-secondary)"}}>로그아웃</button>
        </div>

        {/* Checklist */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:15,fontWeight:500}}>신입코치 필수 과정</h3>
            <span style={{fontSize:12,background:done===TASKS.length?"#E8F5E9":"var(--color-background-secondary)",color:done===TASKS.length?"#2E7D32":"var(--color-text-secondary)",padding:"3px 10px",borderRadius:20,fontWeight:500}}>{done} / {TASKS.length} 완료</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {TASKS.map(t=>(
              <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,background:checks[t.id]?"#F1F8E9":"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)"}}>
                <div onClick={()=>toggleCheck(t.id)} style={{width:20,height:20,borderRadius:4,border:`2px solid ${checks[t.id]?"#66BB6A":"#BDBDBD"}`,background:checks[t.id]?"#66BB6A":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                  {checks[t.id]&&<span style={{color:"#fff",fontSize:12,lineHeight:1}}>✓</span>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{fontSize:13,fontWeight:500,color:checks[t.id]?"#9E9E9E":"var(--color-text-primary)",textDecoration:checks[t.id]?"line-through":"none"}}>{t.title}</span>
                  {t.sub&&<span style={{fontSize:11,color:"var(--color-text-tertiary)",marginLeft:6}}>{t.sub}</span>}
                </div>
                {t.url&&<a href={t.url} target="_blank" rel="noreferrer" style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:t.color+"18",color:t.color,border:`0.5px solid ${t.color}33`,textDecoration:"none",flexShrink:0}}>바로가기</a>}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[["calendar","📅 일정"],["resource","📂 자료실"],["settle","💰 정착지원금"],["notice","📌 공지"],...(isAdmin?[["progress","👥 코치 현황"]]:[])] .map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{padding:"7px 14px",borderRadius:8,border:"0.5px solid var(--color-border-tertiary)",background:tab===k?"#5C6BC0":"var(--color-background-secondary)",color:tab===k?"#fff":"var(--color-text-secondary)",cursor:"pointer",fontSize:13,fontWeight:tab===k?500:400}}>{l}</button>
          ))}
        </div>

        {/* ── Calendar ── */}
        {tab==="calendar"&&(
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <button onClick={()=>{if(m===0){setM(11);setY(v=>v-1);}else setM(v=>v-1);}} style={{border:"none",background:"none",fontSize:22,cursor:"pointer",color:"var(--color-text-primary)",lineHeight:1}}>‹</button>
              <span style={{fontSize:15,fontWeight:500}}>{y}년 {m+1}월</span>
              <button onClick={()=>{if(m===11){setM(0);setY(v=>v+1);}else setM(v=>v+1);}} style={{border:"none",background:"none",fontSize:22,cursor:"pointer",color:"var(--color-text-primary)",lineHeight:1}}>›</button>
            </div>
            {isAdmin&&<div style={{textAlign:"right",marginBottom:8}}><button onClick={()=>setShowEv(true)} style={{fontSize:12,padding:"5px 12px",borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",cursor:"pointer"}}>+ 일정 추가</button></div>}
            <div className="cal-grid" style={{marginBottom:4}}>
              {DAYS.map((d,i)=><div key={d} style={{textAlign:"center",fontSize:11,color:i===0?"#EF5350":i===6?"#5C6BC0":"var(--color-text-secondary)",padding:"4px 0",fontWeight:500}}>{d}</div>)}
            </div>
            <div className="cal-grid">
              {cells.map((d,i)=>{
                const evs=evForDay(d);const col=i%7;
                return <div key={i} className={`cal-cell${isToday(d)?" today":""}`} onClick={()=>d&&evs.length&&setSelDay({d,evs})} style={{cursor:evs.length?"pointer":"default"}}>
                  {d&&<>
                    <div style={{fontSize:12,fontWeight:isToday(d)?500:400,color:col===0?"#EF5350":col===6?"#5C6BC0":"var(--color-text-primary)",marginBottom:2}}>{d}</div>
                    {evs.slice(0,2).map(ev=><div key={ev.id} style={{fontSize:9,background:"#5C6BC022",color:"#5C6BC0",borderRadius:3,padding:"1px 3px",marginBottom:1,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{ev.title}</div>)}
                    {evs.length>2&&<div style={{fontSize:9,color:"var(--color-text-tertiary)"}}>+{evs.length-2}</div>}
                  </>}
                </div>;
              })}
            </div>
            {selDay&&<div style={{marginTop:12,padding:12,background:"var(--color-background-secondary)",borderRadius:8,border:"0.5px solid var(--color-border-tertiary)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:500}}>{m+1}월 {selDay.d}일 일정</span>
                <button onClick={()=>setSelDay(null)} style={{border:"none",background:"none",cursor:"pointer",fontSize:18,color:"var(--color-text-tertiary)"}}>×</button>
              </div>
              {selDay.evs.map(ev=><div key={ev.id} style={{padding:"8px 10px",background:"var(--color-background-primary)",borderRadius:6,border:"0.5px solid var(--color-border-tertiary)",marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,fontWeight:500}}>{ev.title}</span>
                  {isAdmin&&<button onClick={()=>{delEvent(ev.id);setSelDay(null);}} style={{border:"none",background:"none",cursor:"pointer",color:"#EF5350",fontSize:11}}>삭제</button>}
                </div>
                {ev.desc&&<p style={{fontSize:12,color:"var(--color-text-secondary)",margin:"4px 0 0"}}>{ev.desc}</p>}
              </div>)}
            </div>}
          </div>
        )}

        {/* ── Resource ── */}
        {tab==="resource"&&(
          <div className="card">
            <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:500}}>자료실</h3>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {RES_CATS.map(c=><button key={c} onClick={()=>setResCat(c)} style={{padding:"5px 12px",borderRadius:20,border:"0.5px solid var(--color-border-tertiary)",background:resCat===c?"#5C6BC0":"var(--color-background-secondary)",color:resCat===c?"#fff":"var(--color-text-secondary)",cursor:"pointer",fontSize:12}}>{c}</button>)}
            </div>
            <div className="res-grid">
              {filtRes.map(r=>(
                <div key={r.id} style={{background:"var(--color-background-secondary)",borderRadius:10,border:"0.5px solid var(--color-border-tertiary)",padding:"12px 14px",display:"flex",flexDirection:"column",gap:6}}>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:r.color+"18",color:r.color,fontWeight:500,alignSelf:"flex-start"}}>{r.category}</span>
                  <p style={{margin:0,fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{r.title}</p>
                  <p style={{margin:0,fontSize:11,color:"var(--color-text-secondary)",lineHeight:1.5,flex:1}}>{r.desc}</p>
                  {r.url&&<a href={r.url} target="_blank" rel="noreferrer" style={{fontSize:11,padding:"4px 10px",borderRadius:6,background:r.color+"15",color:r.color,border:`0.5px solid ${r.color}33`,textDecoration:"none",textAlign:"center",marginTop:"auto"}}>사이트 열기</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Settlement ── */}
        {tab==="settle"&&(
          <div className="card">
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:14}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:500}}>코치 정착지원금 (개선안)</h3>
              <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>공고일 2026.02.26 · 적용 2026.03.09 이후 계약 코치</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table className="settle-table">
                <thead>
                  <tr>
                    <th rowSpan={2} style={{width:80}}>구분</th>
                    <th colSpan={2} style={{background:"#EDE7F6",color:"#512DA8"}}>화상 (방문無)</th>
                    <th colSpan={2} style={{background:"#E3F2FD",color:"#1565C0"}}>방문 + 화상</th>
                    <th rowSpan={2} style={{background:"#FFF3E0",color:"#E65100",minWidth:160}}>계약해지 시</th>
                  </tr>
                  <tr>
                    <th>지급조건</th>
                    <th>지원금</th>
                    <th>지급조건</th>
                    <th>지원금</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 1개월차 */}
                  <tr><td className="month-header" rowSpan={6} style={{background:"#E8EAF6",color:"#3949AB",fontWeight:500}}>1개월차</td>
                    <td>—</td><td>0원</td><td>0T</td><td>+0원</td>
                    <td rowSpan={6} style={{fontSize:10,color:"var(--color-text-secondary)"}}>300,000원 × 당월 계약이행 일수(계약일~M+1월8일) ÷ 당월 전체 일수</td>
                  </tr>
                  <tr><td rowSpan={5} style={{background:"#F3E5F5",color:"#6A1B9A",fontWeight:500}}>300,000원</td>
                    <td rowSpan={5} style={{fontSize:11,color:"var(--color-text-secondary)"}}>× 당월 계약이행 일수<br/>÷ 당월 전체 일수</td>
                    <td>0T초과~10T미만</td><td className="highlight">+100,000원</td>
                  </tr>
                  <tr><td>10T이상~20T미만</td><td className="highlight">+200,000원</td></tr>
                  <tr><td>20T이상~30T미만</td><td className="highlight">+300,000원</td></tr>
                  <tr><td>30T이상~40T미만</td><td className="highlight">+400,000원</td></tr>
                  <tr><td>40T이상~</td><td className="highlight">+500,000원</td></tr>

                  {/* 2개월차 */}
                  <tr><td className="month-header" rowSpan={4} style={{background:"#E8EAF6",color:"#3949AB",fontWeight:500}}>2개월차</td>
                    <td>0T</td><td>0원</td><td>0T</td><td>0원</td>
                    <td rowSpan={4} style={{fontSize:10,color:"var(--color-text-secondary)"}}>500,000원 × 당월 계약이행 일수(9일~최종교육참석일) ÷ 당월 전체 일수</td>
                  </tr>
                  <tr><td>0T초과~10T미만</td><td>200,000원</td><td>0T초과~10T미만</td><td>200,000원</td></tr>
                  <tr><td>10T이상~20T미만</td><td>350,000원</td><td>10T이상~20T미만</td><td>400,000원</td></tr>
                  <tr><td>20T이상~</td><td className="highlight">500,000원</td><td>20T이상~</td><td className="highlight">600,000원</td></tr>

                  {/* 3개월차 */}
                  <tr><td className="month-header" rowSpan={4} style={{background:"#E8EAF6",color:"#3949AB",fontWeight:500}}>3개월차</td>
                    <td>0T</td><td>0원</td><td>0T</td><td>0원</td>
                    <td rowSpan={4} style={{fontSize:10,color:"var(--color-text-secondary)"}}>500,000원 × 당월 계약이행 일수(9일~최종교육참석일) ÷ 당월 전체 일수</td>
                  </tr>
                  <tr><td>0T초과~10T미만</td><td>200,000원</td><td>0T초과~10T미만</td><td>200,000원</td></tr>
                  <tr><td>10T이상~20T미만</td><td>350,000원</td><td>10T이상~20T미만</td><td>400,000원</td></tr>
                  <tr><td>20T이상~</td><td className="highlight">500,000원</td><td>20T이상~</td><td className="highlight">600,000원</td></tr>

                  {/* 4개월차 */}
                  <tr style={{background:"#FFF8E1"}}>
                    <td style={{background:"#FFE082",color:"#E65100",fontWeight:500}}>4개월차 ★추가</td>
                    <td>35T이상~</td><td className="highlight">200,000원</td>
                    <td>35T이상~</td><td className="highlight">200,000원</td>
                    <td style={{fontSize:10,color:"var(--color-text-secondary)"}}>200,000원 × 당월 계약이행 일수(9일~최종교육참석일) ÷ 당월 전체 일수</td>
                  </tr>

                  {/* 최대 */}
                  <tr style={{background:"#E8F5E9"}}>
                    <td colSpan={3} style={{fontWeight:500,color:"#2E7D32",textAlign:"right"}}>최대 지원금 (화상)</td>
                    <td colSpan={2} style={{fontWeight:500,color:"#1565C0"}}>최대 지원금 (방문+화상)</td>
                    <td></td>
                  </tr>
                  <tr style={{background:"#E8F5E9"}}>
                    <td colSpan={3} style={{fontWeight:500,color:"#2E7D32",fontSize:16}}>1,500,000원</td>
                    <td colSpan={2} style={{fontWeight:500,color:"#1565C0",fontSize:16}}>2,200,000원</td>
                    <td></td>
                  </tr>

                  {/* Notes */}
                  <tr className="note-row"><td colSpan={6}>※ 방문수업: 상상코칭, 감정코사(방문), 공부9도(방문), 플래닝(방문), 교과수평평가(방문), 감정코사(방문) 등</td></tr>
                  <tr className="note-row"><td colSpan={6}>※ 코칭타임: 해당 마감월 입회 완료타임 기준</td></tr>
                  <tr className="note-row"><td colSpan={6}>※ 지급일: 해당월 마감일 수수료와 함께 지급</td></tr>
                  <tr className="note-row"><td colSpan={6}>※ 상기표의 지원금에서 소득세(3%), 주민세(0.3%), 원천징수 및 고용보험료, 산재보험료 공제 후 지급. 환원 이하 절사</td></tr>
                  <tr className="note-row"><td colSpan={6}>※ 3개월차 계약해지 시 2개월차 계약이행 일수에 대해서는 소급하여 지급하지 않음</td></tr>
                </tbody>
              </table>
            </div>
            <div style={{marginTop:14,padding:"10px 14px",background:"#FFF8E1",borderRadius:8,border:"0.5px solid #FFD54F"}}>
              <p style={{margin:0,fontSize:12,fontWeight:500,color:"#E65100"}}>수수료 상세 스프레드시트</p>
              <a href="https://docs.google.com/spreadsheets/d/18u7vZ-N8HT7cJ1qRD7b-R9VGg4MGo23x/edit?pli=1&gid=1541444167#gid=1541444167" target="_blank" rel="noreferrer" style={{fontSize:12,color:"#1565C0",wordBreak:"break-all"}}>Google Sheets 바로가기 →</a>
            </div>
          </div>
        )}

        {/* ── Notice ── */}
        {tab==="notice"&&(
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:500}}>공지사항</h3>
              {isAdmin&&<button onClick={()=>setShowNt(true)} style={{fontSize:12,padding:"5px 12px",borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",cursor:"pointer"}}>+ 공지 등록</button>}
            </div>
            {!loaded&&<p style={{color:"var(--color-text-tertiary)",fontSize:13,textAlign:"center",padding:"1rem 0"}}>불러오는 중...</p>}
            {loaded&&notices.length===0&&<p style={{color:"var(--color-text-tertiary)",fontSize:13,textAlign:"center",padding:"2rem 0"}}>등록된 공지가 없습니다.</p>}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {notices.map(n=><div key={n.id} style={{padding:"10px 12px",background:"var(--color-background-secondary)",borderRadius:8,border:"0.5px solid var(--color-border-tertiary)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><span style={{fontSize:14,fontWeight:500}}>{n.title}</span><span style={{fontSize:11,color:"var(--color-text-tertiary)",marginLeft:8}}>{n.date}</span></div>
                  {isAdmin&&<button onClick={()=>delNotice(n.id)} style={{border:"none",background:"none",cursor:"pointer",color:"#EF5350",fontSize:11}}>삭제</button>}
                </div>
                {n.content&&<p style={{fontSize:13,color:"var(--color-text-secondary)",margin:"6px 0 0",whiteSpace:"pre-wrap"}}>{n.content}</p>}
              </div>)}
            </div>
          </div>
        )}

        {/* ── Progress ── */}
        {tab==="progress"&&isAdmin&&<ProgressTab/>}

        {/* Event Modal */}
        {showEv&&<Modal title="일정 추가" onClose={()=>setShowEv(false)}>
          <input value={newEv.title} onChange={e=>setNewEv(v=>({...v,title:e.target.value}))} placeholder="일정 제목"/>
          <input type="date" value={newEv.date} onChange={e=>setNewEv(v=>({...v,date:e.target.value}))}/>
          <textarea value={newEv.desc} onChange={e=>setNewEv(v=>({...v,desc:e.target.value}))} placeholder="메모 (선택)" rows={2} style={{resize:"none"}}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowEv(false)} style={cBt}>취소</button>
            <button onClick={addEvent} style={sBt}>저장</button>
          </div>
        </Modal>}

        {/* Notice Modal */}
        {showNt&&<Modal title="공지 등록" onClose={()=>setShowNt(false)}>
          <input value={newNt.title} onChange={e=>setNewNt(v=>({...v,title:e.target.value}))} placeholder="공지 제목"/>
          <textarea value={newNt.content} onChange={e=>setNewNt(v=>({...v,content:e.target.value}))} placeholder="내용 (선택)" rows={3} style={{resize:"none"}}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowNt(false)} style={cBt}>취소</button>
            <button onClick={addNotice} style={sBt}>등록</button>
          </div>
        </Modal>}
      </div>
    </>
  );
}

function NoticeGen() {
  const [form, setForm] = useState({
    name:"", grade:"", type:"화상 수업", subject:"영어",
    times:"2", duration:"60", days:"매주 화요일 오후 4시, 매주 목요일 오후 4시",
    firstDate:"", book:"", publisher:"", studentId:"", fee:"",
    teacherPhone:"010-1234-5678", managerPhone:"010-9876-5432"
  });
  const [preview, setPreview] = useState(false);
  const previewRef = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);

  function set(k,v){ setForm(f=>({...f,[k]:v})); }

  function calcFee() {
    const t = parseInt(form.times)||0;
    const base = form.type.includes("방문") ? 74000 : 64000;
    return (base * t * 4).toLocaleString("ko-KR");
  }

  async function downloadImg() {
    const pages = [
      {ref:previewRef, name:"1페이지_수업안내"},
      {ref:page2Ref, name:"2페이지_학부모말씀"},
      {ref:page3Ref, name:"3페이지_결제안내"},
    ];
    try {
      const {default: html2canvas} = await import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js");
      for(const p of pages){
        if(!p.ref.current) continue;
        const canvas = await html2canvas(p.ref.current, {scale:2, useCORS:true, backgroundColor:"#ffffff"});
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `${form.name||"안내문"}_${p.name}.png`;
        a.click();
        await new Promise(r=>setTimeout(r,400));
      }
    } catch(e) {
      alert("이미지 저장 중 오류가 발생했습니다.");
    }
  }

  const fee = form.fee || calcFee();

  return (
    <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:12,padding:"1rem 1.25rem"}}>
      <h3 style={{fontSize:15,fontWeight:600,color:"#333",marginBottom:14}}>📄 수업 안내문 생성</h3>

      {!preview ? (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {/* 입력 폼 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <label style={lbSt}>
              <span>회원 이름</span>
              <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="예) 김학부모"/>
            </label>
            <label style={lbSt}>
              <span>수업 대상 (학년)</span>
              <input value={form.grade} onChange={e=>set("grade",e.target.value)} placeholder="예) 중학교 1학년"/>
            </label>
            <label style={lbSt}>
              <span>수업 형태</span>
              <select value={form.type} onChange={e=>set("type",e.target.value)} style={{...inputSt2,marginBottom:0}}>
                <option>화상 수업</option>
                <option>방문 수업</option>
              </select>
            </label>
            <label style={lbSt}>
              <span>수업 과목</span>
              <input value={form.subject} onChange={e=>set("subject",e.target.value)} placeholder="예) 영어"/>
            </label>
            <label style={lbSt}>
              <span>주 수업 횟수</span>
              <input value={form.times} onChange={e=>set("times",e.target.value)} placeholder="예) 2"/>
            </label>
            <label style={lbSt}>
              <span>1회 수업 시간(분)</span>
              <input value={form.duration} onChange={e=>set("duration",e.target.value)} placeholder="예) 60"/>
            </label>
            <label style={{...lbSt,gridColumn:"1/-1"}}>
              <span>수업 요일 및 시간</span>
              <input value={form.days} onChange={e=>set("days",e.target.value)} placeholder="예) 매주 화요일 오후 4시, 매주 목요일 오후 4시"/>
            </label>
            <label style={lbSt}>
              <span>첫 수업 날짜</span>
              <input value={form.firstDate} onChange={e=>set("firstDate",e.target.value)} placeholder="예) 3월 5일 (화) 오후 4시"/>
            </label>
            <label style={lbSt}>
              <span>예상 월 수업료 (원)</span>
              <input value={form.fee} onChange={e=>set("fee",e.target.value)} placeholder={`자동계산: ${calcFee()}원`}/>
            </label>
            <label style={lbSt}>
              <span>교재명</span>
              <input value={form.book} onChange={e=>set("book",e.target.value)} placeholder="예) 기적의 파닉스"/>
            </label>
            <label style={lbSt}>
              <span>출판사</span>
              <input value={form.publisher} onChange={e=>set("publisher",e.target.value)} placeholder="예) 길벗스쿨"/>
            </label>
            <label style={{...lbSt,gridColumn:"1/-1"}}>
              <span>학생 아이디 (미입력 시 "아이디 미입력" 표시)</span>
              <input value={form.studentId} onChange={e=>set("studentId",e.target.value)} placeholder="예) student123"/>
            </label>
            <label style={lbSt}>
              <span>수업 선생님 연락처</span>
              <input value={form.teacherPhone} onChange={e=>set("teacherPhone",e.target.value)} placeholder="010-1234-5678"/>
            </label>
            <label style={lbSt}>
              <span>담당 매니저 연락처</span>
              <input value={form.managerPhone} onChange={e=>set("managerPhone",e.target.value)} placeholder="010-9876-5432"/>
            </label>
          </div>
          <button onClick={()=>setPreview(true)} style={{...sBt,marginTop:8,padding:"10px"}}>미리보기 →</button>
        </div>
      ) : (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button onClick={()=>setPreview(false)} style={cBt}>← 수정하기</button>
            <button onClick={downloadImg} style={{...sBt,flex:2}}>⬇ 이미지 다운로드</button>
          </div>

          {/* 안내문 미리보기 */}
          <div ref={previewRef} style={{background:"#fff",padding:"40px 36px",fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif",maxWidth:700,margin:"0 auto",border:"1px solid #ddd",borderRadius:8}}>
            {/* 제목 */}
            <div style={{textAlign:"center",marginBottom:32}}>
              <h1 style={{fontSize:26,fontWeight:700,color:"#1a1a1a",marginBottom:6}}>수업 일정 및 로그인 안내</h1>
              <p style={{fontSize:13,color:"#888"}}>수업 일정 및 수업료, 그리고 홈페이지 (상상코칭) 로그인 정보를 확인해주세요.</p>
            </div>

            {/* 수업 일정 */}
            <div style={{border:"1.5px solid #4A90D9",borderRadius:10,padding:"20px 24px",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                <span style={{fontSize:18}}>📅</span>
                <h2 style={{fontSize:16,fontWeight:700,color:"#1a1a1a"}}>수업 일정 및 수업료</h2>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                <div style={{display:"flex",flexDirection:"column",gap:10,paddingRight:20,borderRight:"1px solid #eee"}}>
                  {[
                    ["회원 이름", form.name||"—"],
                    ["수업 형태", `${form.type} (${form.subject})`],
                    ["수업 시간", `1회 ${form.duration}분`],
                    ["수업 요일", form.days||"—"],
                    ["첫 수업", form.firstDate||"—"],
                  ].map(([k,v])=>(
                    <div key={k} style={{display:"flex",gap:12,fontSize:13}}>
                      <span style={{color:"#888",minWidth:72,flexShrink:0}}>{k}</span>
                      <span style={{color:"#1a1a1a",fontWeight:k==="첫 수업"?600:400,color:k==="첫 수업"?"#1565C0":"#1a1a1a"}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10,paddingLeft:20}}>
                  {[
                    ["수업 대상", form.grade||"—"],
                    ["수업 횟수", `주 ${form.times}회`],
                  ].map(([k,v])=>(
                    <div key={k} style={{display:"flex",gap:12,fontSize:13}}>
                      <span style={{color:"#888",minWidth:72,flexShrink:0}}>{k}</span>
                      <span style={{color:"#1a1a1a",fontWeight:k==="수업 횟수"?700:400,color:k==="수업 횟수"?"#1565C0":"#1a1a1a"}}>{v}</span>
                    </div>
                  ))}
                  <div style={{marginTop:8,padding:"12px 16px",background:"#f0f7ff",borderRadius:8,textAlign:"right"}}>
                    <p style={{fontSize:11,color:"#888",marginBottom:2}}>□ 예상 월 수업료</p>
                    <p style={{fontSize:24,fontWeight:700,color:"#1565C0"}}>{fee}원</p>
                    <p style={{fontSize:10,color:"#aaa"}}>기본 수업료 + AI수학(1T)</p>
                    <p style={{fontSize:10,color:"#aaa"}}>(4주, 월 8회 기준)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 교재 */}
            {form.book && (
              <div style={{border:"1.5px solid #4A90D9",borderRadius:10,padding:"20px 24px",marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <span style={{fontSize:18}}>📖</span>
                  <h2 style={{fontSize:16,fontWeight:700,color:"#1a1a1a"}}>수업 교재 안내</h2>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#f9f9f9",borderRadius:8,border:"1px solid #eee"}}>
                  <div style={{width:36,height:44,background:"#ddd",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📚</div>
                  <div>
                    <p style={{fontSize:14,fontWeight:600,color:"#1a1a1a"}}>{form.book}</p>
                    {form.publisher && <p style={{fontSize:12,color:"#888"}}>{form.publisher}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── 2페이지: 학부모님께 드리는 말씀 ── */}
            <div ref={page2Ref} style={{background:"#fff",padding:"40px 36px",fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif",maxWidth:700,margin:"24px auto 0",border:"1px solid #ddd",borderRadius:8}}>
              <div style={{width:"100%",height:8,background:"linear-gradient(90deg,#1565C0,#42A5F5)",borderRadius:"4px 4px 0 0",marginBottom:32}}/>
              <div style={{textAlign:"center",marginBottom:32}}>
                <h1 style={{fontSize:26,fontWeight:700,color:"#1a1a1a",marginBottom:6}}>학부모님께 드리는 말씀</h1>
                <p style={{fontSize:13,color:"#888"}}>원활한 수업을 위해 꼭 확인 부탁드립니다.</p>
              </div>
              {[
                {n:1,title:"수업은 정해진 요일과 시간에 진행됩니다.",desc:"원활한 학습 진행과 수업 시간을 최대한 활용하기 위해 정해진 수업 시간을 준수하고 있습니다. 학부모님께서는 자녀가 충실하게 수업을 준비할 수 있도록 지도 부탁드립니다."},
                {n:2,title:"모든 수업은 선불이며, 4주차 수업 기준으로 진행됩니다.",desc:"주 2회 수업일 경우 월 8회 수업을 기본으로 하며, 월 5주차가 있는 경우는 해당 교사와 협의 후 휴강기간으로 대체 될 수 있습니다. 따로 협의가 없는 경우, 다음 회차 수업이 새롭게 수업이 시작되는 날이므로 수업 전까지 교육비 납부가 될 수 있도록 부탁드립니다."},
                {n:3,title:"법정 공휴일에는 수업이 진행되지 않습니다.",desc:"단, 사전에 미리 약속된 수업일은 공휴일에도 진행되며, 공휴일 휴강으로 인해 한달 수업 횟수가 미달될 경우에는 추가로 보강 수업을 진행합니다."},
                {n:4,title:"수업 변경을 원하실 경우 최소 하루 전날 말씀해주셔야합니다.",desc:"사전 논의 없이 당일 결석하는 경우 무단결석으로 처리되어 보강수업 진행이 어려우며, 1회 수업이 완료한 것으로 간주되니 불이익이 없도록 유의해 주시기 바랍니다. 단, 모든 경우에 보강의 보강수업은 없습니다."},
                {n:5,title:"수업 횟수는 반드시 맞춰드립니다.",desc:"학생 및 선생님의 개인 사정으로 수업이 이루어지지 않을 경우, 남은 수업 횟수를 맞추기 위한 보강 수업이 진행되며, 모든 일정은 학부모님과 학생, 선생님 간의 협의를 통해 조정됩니다."},
                {n:6,title:"남은 회차 수업은 모두 환불 가능합니다.",desc:"수업을 중단하고자 할 경우 최소 2주전에 미리 담당 선생님께 알려주세요. 남은 수업 회차는 모두 환불이 가능합니다."},
              ].map(item=>(
                <div key={item.n} style={{display:"flex",gap:16,marginBottom:20,paddingBottom:20,borderBottom:"1px solid #f0f0f0"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:"#1565C0",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0,marginTop:2}}>{item.n}</div>
                  <div>
                    <p style={{fontSize:14,fontWeight:700,color:"#1a1a1a",marginBottom:6}}>{item.title}</p>
                    <p style={{fontSize:12,color:"#555",lineHeight:1.7}}>{item.desc}</p>
                  </div>
                </div>
              ))}
              <div style={{textAlign:"center",padding:"20px 0",borderTop:"2px solid #1565C0",borderBottom:"2px solid #1565C0",margin:"24px 0"}}>
                <p style={{fontSize:14,fontWeight:700,color:"#1565C0"}}>오늘 무료 수업을 통해 아이의 잠재력을 확인할 수 있었습니다. 꾸준히 성장할 수 있도록 꼼꼼하게 지도하겠습니다.</p>
              </div>
              <div style={{textAlign:"center",marginTop:20}}>
                <p style={{fontSize:12,color:"#888",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><span>✦</span> 수업 문의 및 상담 신청</p>
                <div style={{display:"flex",justifyContent:"center",gap:40}}>
                  <div style={{textAlign:"center"}}>
                    <p style={{fontSize:11,color:"#888",marginBottom:8}}>👤 수업 선생님</p>
                    <div style={{padding:"10px 24px",border:"2px solid #1565C0",borderRadius:24,fontSize:15,fontWeight:700,color:"#1565C0"}}>{form.teacherPhone||"010-0000-0000"}</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <p style={{fontSize:11,color:"#888",marginBottom:8}}>📞 담당 매니저</p>
                    <div style={{padding:"10px 24px",border:"2px solid #1565C0",borderRadius:24,fontSize:15,fontWeight:700,color:"#1565C0"}}>{form.managerPhone||"010-0000-0000"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 3페이지: 결제 수단 안내 ── */}
            <div ref={page3Ref} style={{background:"#fff",padding:"40px 36px",fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif",maxWidth:700,margin:"24px auto 0",border:"1px solid #ddd",borderRadius:8}}>
              <div style={{width:"100%",height:8,background:"linear-gradient(90deg,#1565C0,#42A5F5)",borderRadius:"4px 4px 0 0",marginBottom:32}}/>
              <div style={{textAlign:"center",marginBottom:28}}>
                <h1 style={{fontSize:26,fontWeight:700,color:"#1a1a1a",marginBottom:6}}>결제 수단 및 방식 안내</h1>
              </div>

              {/* 정기결제 */}
              <div style={{marginBottom:28}}>
                <p style={{fontSize:14,fontWeight:700,color:"#1a1a1a",marginBottom:10}}>● <span style={{color:"#1565C0"}}>정기 결제 (카드)</span>: 매달 수업회차 완료 후, 결제 예정문자가 발송되고, 2일후 자동 결제가 진행됩니다.( 원치 않으시면 언제든 중단이 가능합니다 )</p>
                <div style={{border:"1px solid #ddd",borderRadius:10,overflow:"hidden"}}>
                  <div style={{background:"#f5f8ff",padding:"10px 16px",borderBottom:"1px solid #eee",display:"flex",gap:12,fontSize:12,color:"#555"}}>
                    <span>과목수업 ∨</span><span>코칭수업 ∨</span><span>대입컨설팅</span><span>학습후기·자료 ∨</span><span>공지·이벤 ∨</span><span style={{marginLeft:"auto",color:"#D32F2F",fontWeight:600}}>마이페이지 ∨</span>
                  </div>
                  <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
                    <div style={{display:"flex",gap:8,fontSize:12,color:"#555"}}>
                      <span>나의강의실</span><span>개인정보</span><span style={{fontWeight:600,color:"#333"}}>결제</span>
                    </div>
                    <div style={{display:"flex",gap:8,fontSize:12}}>
                      {["회비납부","단품주문내역","고객전용 가상계좌안내","전자계약서 확인","등락사뉴 및 영수증"].map(t=><span key={t} style={{color:"#555"}}>{t}</span>)}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{background:"#1565C0",color:"#fff",padding:"6px 14px",borderRadius:6,fontSize:13,fontWeight:600}}>회비 정기결제</div>
                      <span style={{fontSize:11,color:"#888"}}>← ③ 클릭</span>
                    </div>
                    <div style={{background:"#f9f9f9",padding:"10px 14px",borderRadius:6,fontSize:11,color:"#777",border:"1px solid #eee"}}>
                      제2조. 정기결제 서비스 이용 자격 — 회사의 회원으로 가입한 자는 누구나 회사에 정기결제 서비스를 신청함으로써 회비 정기결제 서비스를 이용할 수 있습니다.
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#555"}}>
                        <span style={{color:"#D32F2F"}}>♥</span> 정기결제 서비스 이용 동의 ← ④
                      </div>
                      <div style={{background:"#2E7D32",color:"#fff",padding:"8px 20px",borderRadius:6,fontSize:13,fontWeight:600}}>↺ 정기결제 신청 ← ⑤</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 알림톡 결제 */}
              <div>
                <p style={{fontSize:14,fontWeight:700,color:"#1a1a1a",marginBottom:10}}>● <span style={{color:"#1565C0"}}>알림톡 결제</span>: 카카오톡 알림톡을 통해 발송된 결제 링크를 클릭하여 간편하게 결제할 수 있습니다.</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div style={{border:"1px solid #ddd",borderRadius:10,overflow:"hidden"}}>
                    <div style={{background:"#FEE500",padding:"10px 14px",fontWeight:700,fontSize:13}}>알림톡 도착</div>
                    <div style={{padding:"14px",fontSize:12,color:"#333",lineHeight:1.8}}>
                      <p>고객님, 안녕하세요.</p>
                      <p>동화세상에듀코 수강료 결제 안내드립니다.</p>
                      <br/>
                      <p>회원이름(ID): <span style={{background:"#eee",padding:"0 20px"}}></span></p>
                      <p>선생님명: 차카가/김골드</p>
                      <p>청구금액: 444,000</p>
                      <br/>
                      <p>하단 수강료 결제를 누르시면 상세한 내역을 확인 후 결제가 가능합니다.</p>
                      <div style={{marginTop:12,padding:"8px",border:"2px solid #D32F2F",borderRadius:6,textAlign:"center",fontWeight:700,color:"#D32F2F"}}>① 수강료 결제</div>
                    </div>
                  </div>
                  <div style={{border:"1px solid #ddd",borderRadius:10,overflow:"hidden"}}>
                    <div style={{background:"#f5f5f5",padding:"10px 14px",fontWeight:700,fontSize:13}}>📋 모바일 청구서</div>
                    <div style={{padding:"14px",fontSize:12,color:"#333",lineHeight:1.8}}>
                      <p style={{borderBottom:"1px solid #eee",paddingBottom:8,marginBottom:8,fontWeight:600}}>결제 정보</p>
                      <p>고객님, 안녕하세요.</p>
                      <p>동화세상에듀코 수강료 결제 내역 안내드립니다.</p>
                      <br/>
                      <div style={{display:"flex",justifyContent:"space-between"}}><span>회원이름(ID)</span><span style={{background:"#eee",padding:"0 20px"}}></span></div>
                      <div style={{display:"flex",justifyContent:"space-between"}}><span>코치명</span><span style={{background:"#eee",padding:"0 20px"}}></span></div>
                      <div style={{display:"flex",justifyContent:"space-between",fontWeight:700}}><span>청구금액</span><span style={{color:"#1565C0"}}>148,000 원</span></div>
                      <div style={{display:"flex",gap:6,marginTop:12}}>
                        <div style={{flex:1,background:"#1DB954",color:"#fff",padding:"8px",borderRadius:6,textAlign:"center",fontSize:11,fontWeight:600}}>Npay 결제하기</div>
                        <div style={{flex:1,background:"#1565C0",color:"#fff",padding:"8px",borderRadius:6,textAlign:"center",fontSize:11,fontWeight:600}}>② 신용카드 결제하기</div>
                      </div>
                      <p style={{textAlign:"center",fontSize:10,color:"#888",marginTop:8}}>♥상상코칭 서비스를 이용해 주셔서 감사합니다♥</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{border:"1.5px solid #4A90D9",borderRadius:10,padding:"20px 24px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>🛡</span>
                  <h2 style={{fontSize:16,fontWeight:700,color:"#1a1a1a"}}>학생 로그인 정보</h2>
                </div>
                <span style={{fontSize:13,fontWeight:700,color:"#D32F2F"}}>로그인 시 [회원]을 선택하여 입장해 주세요</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={{padding:"12px 16px",background:"#f9f9f9",borderRadius:8,textAlign:"center"}}>
                  <p style={{fontSize:11,color:"#888",marginBottom:6}}>홈페이지 (상상코칭)</p>
                  <p style={{fontSize:14,fontWeight:600,color:"#1a1a1a"}}>www.sscoaching.co.kr</p>
                </div>
                <div style={{padding:"12px 16px",background:"#f9f9f9",borderRadius:8,textAlign:"center"}}>
                  <p style={{fontSize:11,color:"#888",marginBottom:6}}>학생 아이디</p>
                  <p style={{fontSize:14,fontWeight:600,color:"#1a1a1a"}}>{form.studentId||"(아이디 미입력)"}</p>
                </div>
              </div>
              <div style={{marginTop:14,padding:"12px 16px",background:"#f9f9f9",borderRadius:8}}>
                <p style={{fontSize:12,fontWeight:600,color:"#1a1a1a",marginBottom:6}}>● 로그인 안내 및 비밀번호 발급</p>
                <p style={{fontSize:11,color:"#555",marginBottom:4}}>1) 통합 회원전환을 하시면 위에 발급해드린 아이디는 <strong>사용이 불가</strong>하오니, 기존 아이디로 로그인하시길 추천드립니다.</p>
                <p style={{fontSize:11,color:"#555"}}>2) 비밀번호를 모르시는 경우, 비밀번호 찾기로 진행해 주세요</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const lbSt = {display:"flex",flexDirection:"column",gap:4};
const inputSt2 = {width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #ddd",fontSize:14,marginBottom:0,background:"#fafafa"};

function ProgressTab(){
  const coaches=COACHES.filter(c=>c!=="김윤정");
  const [allChecks,setAllChecks]=useState({});
  useEffect(()=>{
    (async()=>{
      const result={};
      for(const coach of coaches){
        result[coach]=await stLoad(SK_CH+coach,{});
      }
      setAllChecks(result);
    })();
  },[]);
  return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <h3 style={{margin:0,fontSize:15,fontWeight:500}}>코치별 필수 과정 현황</h3>
        <span style={{fontSize:12,color:"var(--color-text-tertiary)"}}>총 {coaches.length}명</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {coaches.map(coach=>{
          const ck=allChecks[coach]||{};
          const done=TASKS.filter(t=>ck[t.id]).length;
          const pct=Math.round(done/TASKS.length*100);
          return(
            <div key={coach} style={{background:"var(--color-background-secondary)",borderRadius:10,border:"0.5px solid var(--color-border-tertiary)",padding:"12px 14px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#E8EAF6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,color:"#3949AB",flexShrink:0}}>{coach[0]}</div>
                  <span style={{fontSize:14,fontWeight:500}}>{coach}</span>
                </div>
                <span style={{fontSize:12,padding:"3px 10px",borderRadius:20,background:pct===100?"#E8F5E9":pct>0?"#E3F2FD":"var(--color-background-primary)",color:pct===100?"#2E7D32":pct>0?"#1565C0":"var(--color-text-tertiary)",fontWeight:500,border:"0.5px solid var(--color-border-tertiary)"}}>
                  {done}/{TASKS.length} {pct===100?"✓ 완료":pct>0?"진행중":"미시작"}
                </span>
              </div>
              <div style={{background:"var(--color-background-primary)",borderRadius:20,height:7,overflow:"hidden",marginBottom:10}}>
                <div style={{height:"100%",width:pct+"%",background:pct===100?"#66BB6A":"#5C6BC0",borderRadius:20}}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {TASKS.map(t=>(
                  <span key={t.id} style={{fontSize:10,padding:"3px 8px",borderRadius:10,background:ck[t.id]?"#E8F5E9":"var(--color-background-primary)",color:ck[t.id]?"#2E7D32":"var(--color-text-tertiary)",border:`0.5px solid ${ck[t.id]?"#A5D6A7":"var(--color-border-tertiary)"}`}}>
                    {ck[t.id]?"✓ ":""}{t.title}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const cBt={flex:1,padding:8,borderRadius:8,border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)",cursor:"pointer",color:"var(--color-text-secondary)",fontSize:13};
const sBt={flex:1,padding:8,borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",cursor:"pointer",fontWeight:500,fontSize:13};

function Modal({title,onClose,children}){
  return <div style={{position:"fixed",inset:0,background:"#00000066",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
    <div style={{background:"var(--color-background-primary)",borderRadius:12,padding:"1.5rem",width:340,maxWidth:"92vw"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
        <h3 style={{margin:0,fontSize:15,fontWeight:500}}>{title}</h3>
        <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",fontSize:20,color:"var(--color-text-tertiary)"}}>×</button>
      </div>
      {children}
    </div>
  </div>;
}
