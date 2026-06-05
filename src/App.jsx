import { useState, useEffect } from "react";

const ADMIN = "김윤정";
const COACHES_DEFAULT = ["김윤정","임서영","윤민정","나지수","서예린","김도은"];
const TASKS = [
  { id:1, text:"신입코치 영상 1,2 — V-CAM", url:"https://vcampus.educo.co.kr/login" },
  { id:2, text:"한국코칭심리협회 TLC 3급", url:"http://www.ikcpa.or.kr/" },
  { id:3, text:"인생코칭" },
  { id:4, text:"한국코칭심리협회 플래닝코칭", url:"http://www.ikcpa.or.kr/" },
];
const TABS = [
  {id:"calendar", label:"일정", icon:"📅"},
  {id:"resource", label:"자료실", icon:"📂"},
  {id:"notice",   label:"공지",  icon:"📌"},
  {id:"support",  label:"지원금", icon:"💰"},
  {id:"guide",    label:"안내문", icon:"📄"},
  {id:"free",     label:"무료수업",icon:"🆓"},
  {id:"exam",     label:"시험분석",icon:"📊"},
];
const ADMIN_TABS = [...TABS, {id:"team", label:"팀 관리", icon:"👥"}];

const FB_URL = "https://coaching-portal-2363f-default-rtdb.firebaseio.com";
async function fbGet(p){try{const r=await fetch(`${FB_URL}/${p}.json`);return await r.json();}catch{return null;}}
async function fbSet(p,d){try{await fetch(`${FB_URL}/${p}.json`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});}catch{}}
async function fbPush(p,d){try{const r=await fetch(`${FB_URL}/${p}.json`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});return await r.json();}catch{return null;}}
async function fbDelete(p){try{await fetch(`${FB_URL}/${p}.json`,{method:"DELETE"});}catch{}}

const accent = "#7C3AED";
const accentLight = "#EDE9FE";
const accentMid = "#A78BFA";

export default function App() {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [coaches, setCoaches] = useState(null);
  const [tab, setTab] = useState("calendar");
  const [checks, setChecks] = useState({});
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [resources, setResources] = useState([]);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const today = new Date();

  useEffect(()=>{
    (async()=>{
      const [c,ev,nt,rs]=await Promise.all([fbGet("coaches"),fbGet("events"),fbGet("notices"),fbGet("resources")]);
      setCoaches(c?.list?.length ? c.list : COACHES_DEFAULT);
      setEvents(ev ? Object.entries(ev).map(([k,v])=>({...v,_key:k})) : []);
      setNotices(nt ? Object.entries(nt).map(([k,v])=>({...v,_key:k})).sort((a,b)=>b.createdAt-a.createdAt) : []);
      setResources(rs ? Object.entries(rs).map(([k,v])=>({...v,_key:k})) : []);
    })();
  },[]);

  const isAdmin = user === ADMIN;
  const tabs = isAdmin ? ADMIN_TABS : TABS;
  const done = TASKS.filter(t=>checks[t.id]).length;
  const pct = Math.round((done/TASKS.length)*100);

  function login(){
    const name = input.trim();
    if(!name){setLoginErr("이름을 입력해 주세요.");return;}
    if(!(coaches||COACHES_DEFAULT).includes(name)){setLoginErr("등록되지 않은 이름이에요.");return;}
    setUser(name);
  }

  async function addCoach(name){const next=[...(coaches||COACHES_DEFAULT),name];setCoaches(next);await fbSet("coaches",{list:next});}
  async function removeCoach(name){if(name===ADMIN)return;const next=(coaches||COACHES_DEFAULT).filter(c=>c!==name);setCoaches(next);await fbSet("coaches",{list:next});}

  // ── Calendar ──
  function CalendarTab(){
    const [form,setForm]=useState({title:"",date:"",color:accent});
    const [adding,setAdding]=useState(false);
    const days=new Date(calYear,calMonth+1,0).getDate();
    const first=new Date(calYear,calMonth,1).getDay();
    const cells=Array(first).fill(null).concat(Array.from({length:days},(_,i)=>i+1));
    const dateStr=d=>`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const evOn=d=>events.filter(e=>e.date===dateStr(d));
    async function add(){if(!form.title||!form.date)return;const ev={...form,createdAt:Date.now()};const r=await fbPush("events",ev);setEvents(p=>[...p,{...ev,_key:r?.name}]);setForm({title:"",date:"",color:accent});setAdding(false);}
    async function del(key){await fbDelete(`events/${key}`);setEvents(p=>p.filter(e=>e._key!==key));}
    return(
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>{if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1);}} style={navBtn}>‹</button>
            <span style={{fontWeight:600,fontSize:15,color:"#1a1a2e",minWidth:90,textAlign:"center"}}>{calYear}년 {calMonth+1}월</span>
            <button onClick={()=>{if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1);}} style={navBtn}>›</button>
          </div>
          {isAdmin&&<button onClick={()=>setAdding(s=>!s)} style={btnAccent}>+ 일정 추가</button>}
        </div>
        {adding&&(
          <div style={{background:accentLight,borderRadius:12,padding:14,marginBottom:14,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
            <input placeholder="일정 제목" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inp}/>
            <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={inp}/>
            <input type="color" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))} style={{width:36,height:34,border:"none",borderRadius:8,cursor:"pointer",padding:2}}/>
            <button onClick={add} style={btnAccent}>저장</button>
            <button onClick={()=>setAdding(false)} style={btnGhost}>취소</button>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
          {["일","월","화","수","목","금","토"].map((d,i)=>(
            <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:600,padding:"6px 0",color:i===0?"#e55":i===6?"#55e":"#888"}}>{d}</div>
          ))}
          {cells.map((d,i)=>{
            const isToday=d&&d===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear();
            const evs=d?evOn(d):[];
            const dow=i%7;
            return(
              <div key={i} style={{minHeight:64,borderRadius:10,padding:4,background:isToday?"#EDE9FE":"#fafafa",border:isToday?`1.5px solid ${accent}`:"1px solid #f0f0f0"}}>
                {d&&<div style={{fontSize:12,fontWeight:isToday?700:400,color:isToday?accent:dow===0?"#e55":dow===6?"#55e":"#444",marginBottom:2}}>{d}</div>}
                {evs.map(ev=>(
                  <div key={ev._key} style={{fontSize:10,background:ev.color||accent,color:"#fff",borderRadius:5,padding:"2px 5px",marginBottom:2,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",flex:1}}>{ev.title}</span>
                    {isAdmin&&<span onClick={()=>del(ev._key)} style={{cursor:"pointer",marginLeft:3,opacity:0.8}}>×</span>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Resources ──
  function ResourceTab(){
    const cats=["공통","교육자료","서식","기타"];
    const [cat,setCat]=useState("전체");
    const [form,setForm]=useState({title:"",url:"",category:"공통"});
    const filtered=cat==="전체"?resources:resources.filter(r=>r.category===cat);
    async function add(){if(!form.title)return;const res={...form,createdAt:Date.now()};const r=await fbPush("resources",res);setResources(p=>[...p,{...res,_key:r?.name}]);setForm({title:"",url:"",category:"공통"});}
    async function del(key){await fbDelete(`resources/${key}`);setResources(p=>p.filter(r=>r._key!==key));}
    return(
      <div>
        {isAdmin&&(
          <div style={{background:accentLight,borderRadius:12,padding:14,marginBottom:14,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
            <input placeholder="자료 제목" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inp}/>
            <input placeholder="링크 URL" value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))} style={{...inp,minWidth:200}}/>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={inp}>
              {cats.map(c=><option key={c}>{c}</option>)}
            </select>
            <button onClick={add} style={btnAccent}>+ 추가</button>
          </div>
        )}
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {["전체",...cats].map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{...chip,background:cat===c?accent:"#f0f0f7",color:cat===c?"#fff":"#555",border:cat===c?"none":"1px solid #e8e8f0"}}>{c}</button>
          ))}
        </div>
        {filtered.length===0&&<div style={{color:"#bbb",textAlign:"center",padding:40,fontSize:14}}>등록된 자료가 없어요.</div>}
        {filtered.map(r=>(
          <div key={r._key} style={card}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📄</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,color:"#1a1a2e"}}>{r.title}</div>
                <div style={{display:"flex",gap:6,marginTop:3,alignItems:"center"}}>
                  <span style={{fontSize:11,background:accentLight,color:accent,borderRadius:6,padding:"1px 8px",fontWeight:500}}>{r.category}</span>
                  {r.url&&<a href={r.url} target="_blank" rel="noreferrer" style={{fontSize:11,color:accent,textDecoration:"none",fontWeight:500}}>→ 바로가기</a>}
                </div>
              </div>
              {isAdmin&&<button onClick={()=>del(r._key)} style={btnDanger}>삭제</button>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Notice ──
  function NoticeTab(){
    const [form,setForm]=useState({title:"",content:""});
    const [open,setOpen]=useState(null);
    async function add(){if(!form.title||!form.content)return;const nt={...form,createdAt:Date.now(),author:user};const r=await fbPush("notices",nt);setNotices(p=>[{...nt,_key:r?.name},...p]);setForm({title:"",content:""});}
    async function del(key){await fbDelete(`notices/${key}`);setNotices(p=>p.filter(n=>n._key!==key));}
    return(
      <div>
        {isAdmin&&(
          <div style={{background:accentLight,borderRadius:12,padding:14,marginBottom:14}}>
            <input placeholder="공지 제목" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={{...inp,width:"100%",marginBottom:8,boxSizing:"border-box"}}/>
            <textarea placeholder="공지 내용을 입력하세요" value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} style={{...inp,width:"100%",minHeight:80,resize:"vertical",boxSizing:"border-box"}}/>
            <button onClick={add} style={{...btnAccent,marginTop:8}}>공지 등록</button>
          </div>
        )}
        {notices.length===0&&<div style={{color:"#bbb",textAlign:"center",padding:40,fontSize:14}}>공지사항이 없어요.</div>}
        {notices.map(n=>(
          <div key={n._key} style={{...card,cursor:"pointer"}} onClick={()=>setOpen(open===n._key?null:n._key)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{display:"flex",gap:10,alignItems:"center",flex:1}}>
                <div style={{width:36,height:36,borderRadius:10,background:accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📌</div>
                <div>
                  <div style={{fontWeight:600,fontSize:14,color:"#1a1a2e"}}>{n.title}</div>
                  <div style={{fontSize:11,color:"#999",marginTop:2}}>{new Date(n.createdAt).toLocaleDateString()} · {n.author||"관리자"}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                <span style={{fontSize:12,color:"#bbb"}}>{open===n._key?"▲":"▼"}</span>
                {isAdmin&&<button onClick={e=>{e.stopPropagation();del(n._key);}} style={btnDanger}>삭제</button>}
              </div>
            </div>
            {open===n._key&&<div style={{marginTop:12,fontSize:13,color:"#444",lineHeight:1.7,paddingTop:12,borderTop:"1px solid #f0f0f0",whiteSpace:"pre-wrap"}}>{n.content}</div>}
          </div>
        ))}
      </div>
    );
  }

  // ── Team ──
  function TeamTab(){
    const [newName,setNewName]=useState("");
    const list=coaches||COACHES_DEFAULT;
    return(
      <div>
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          <input placeholder="코치 이름" value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&newName.trim()&&(addCoach(newName.trim()),setNewName(""))} style={inp}/>
          <button onClick={()=>{if(newName.trim()){addCoach(newName.trim());setNewName("");}}} style={btnAccent}>+ 추가</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
          {list.map(c=>{
            const initials=c.length>=2?c.slice(0,2):c;
            const isAdm=c===ADMIN;
            return(
              <div key={c} style={{...card,display:"flex",alignItems:"center",gap:10,padding:"12px 14px"}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:isAdm?"#7C3AED":accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:13,color:isAdm?"#fff":accent,flexShrink:0}}>{initials}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14,color:"#1a1a2e"}}>{c}</div>
                  <div style={{fontSize:11,color:"#aaa"}}>{isAdm?"관리자":"신입코치"}</div>
                </div>
                {!isAdm&&<button onClick={()=>removeCoach(c)} style={btnDanger}>삭제</button>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function PlaceholderTab({label}){
    return(
      <div style={{textAlign:"center",padding:"48px 0",color:"#ccc"}}>
        <div style={{fontSize:40,marginBottom:12}}>🚧</div>
        <div style={{fontSize:14,color:"#bbb"}}>{label} 기능 준비 중이에요.</div>
      </div>
    );
  }

  function renderTab(){
    if(tab==="calendar") return <CalendarTab/>;
    if(tab==="resource") return <ResourceTab/>;
    if(tab==="notice")   return <NoticeTab/>;
    if(tab==="team")     return <TeamTab/>;
    const cur=tabs.find(t=>t.id===tab);
    return <PlaceholderTab label={cur?.label||tab}/>;
  }

  // Shared styles
  const navBtn={background:"#f3f0ff",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,color:accent,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"};
  const btnAccent={background:accent,color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontWeight:600,fontSize:13};
  const btnGhost={background:"transparent",color:"#888",border:"1px solid #e0e0e8",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:13};
  const btnDanger={background:"#fff0f0",color:"#e55",border:"1px solid #ffd0d0",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:12};
  const inp={border:"1px solid #e8e8f0",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",background:"#fff"};
  const chip={border:"none",borderRadius:20,padding:"5px 14px",cursor:"pointer",fontSize:12,fontWeight:500};
  const card={background:"#fff",border:"1px solid #f0f0f8",borderRadius:14,padding:"14px 16px",marginBottom:10,boxShadow:"0 1px 4px rgba(124,58,237,0.04)"};

  // ── Login ──
  if(!user) return(
    <div style={{minHeight:"100vh",background:"#f7f5ff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>
      <div style={{width:360,background:"#fff",borderRadius:24,padding:"40px 36px",boxShadow:"0 4px 32px rgba(124,58,237,0.10)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div style={{width:44,height:44,borderRadius:14,background:accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🌟</div>
          <div>
            <div style={{fontWeight:700,fontSize:18,color:"#1a1a2e"}}>상상코칭</div>
            <div style={{fontSize:12,color:"#999"}}>신입코치 전용 포털</div>
          </div>
        </div>
        <div style={{fontSize:13,color:"#666",marginBottom:8,fontWeight:500}}>이름으로 로그인</div>
        <input
          placeholder="본인 이름을 입력하세요"
          value={input}
          onChange={e=>{setInput(e.target.value);setLoginErr("");}}
          onKeyDown={e=>e.key==="Enter"&&login()}
          style={{...inp,width:"100%",padding:"11px 14px",fontSize:14,marginBottom:6,boxSizing:"border-box"}}
        />
        {loginErr&&<div style={{color:"#e55",fontSize:12,marginBottom:8}}>{loginErr}</div>}
        <button onClick={login} style={{...btnAccent,width:"100%",padding:"12px",fontSize:15,borderRadius:12,marginTop:4}}>로그인</button>
        <div style={{marginTop:20,fontSize:11,color:"#ccc",textAlign:"center"}}>등록되지 않은 이름은 부서장에게 문의하세요</div>
      </div>
    </div>
  );

  const curTab = tabs.find(t=>t.id===tab);

  return(
    <div style={{minHeight:"100vh",background:"#f7f5ff",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>
      {/* Top bar */}
      <div style={{background:"#fff",borderBottom:"1px solid #f0f0f8",padding:"0 20px",display:"flex",justifyContent:"space-between",alignItems:"center",height:56,position:"sticky",top:0,zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,borderRadius:9,background:accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🌟</div>
          <span style={{fontWeight:700,fontSize:16,color:"#1a1a2e"}}>상상코칭</span>
          <span style={{fontSize:12,color:"#bbb",marginLeft:2}}>포털</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:isAdmin?"#7C3AED":accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:12,color:isAdmin?"#fff":accent}}>{user.slice(0,2)}</div>
            <span style={{fontSize:13,color:"#444",fontWeight:500}}>{user}{isAdmin&&" 👑"}</span>
          </div>
          <button onClick={()=>{setUser(null);setInput("");}} style={{...btnGhost,padding:"5px 12px",fontSize:12}}>로그아웃</button>
        </div>
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"0 16px 20px"}}>
        {/* Season Banner */}
        {(()=>{
          const m=new Date().getMonth();
          const seasons=[
            {months:[11,0,1], label:"겨울", emoji:"❄️", sub:"따뜻하게 성장하는 계절", img:"https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=900&q=80", overlay:"rgba(30,60,120,0.38)"},
            {months:[2,3,4],  label:"봄",   emoji:"🌸", sub:"새로운 시작을 응원해요",  img:"https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=80", overlay:"rgba(180,80,120,0.28)"},
            {months:[5,6,7],  label:"여름", emoji:"🌊", sub:"뜨겁게 달려가는 계절",   img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80", overlay:"rgba(10,80,160,0.35)"},
            {months:[8,9,10], label:"가을", emoji:"🍂", sub:"깊어지는 성장의 계절",   img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80", overlay:"rgba(120,60,10,0.30)"},
          ];
          const s=seasons.find(s=>s.months.includes(m));
          return(
            <div style={{position:"relative",borderRadius:"0 0 24px 24px",overflow:"hidden",marginBottom:20,height:160}}>
              <img src={s.img} alt={s.label} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
              <div style={{position:"absolute",inset:0,background:s.overlay,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 28px"}}>
                <div style={{color:"#fff",fontSize:13,fontWeight:500,opacity:0.85,marginBottom:4}}>{s.emoji} {s.label}의 상상코칭</div>
                <div style={{color:"#fff",fontSize:22,fontWeight:700,lineHeight:1.3}}>{user}님, 안녕하세요 👋</div>
                <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,marginTop:4}}>{s.sub}</div>
              </div>
            </div>
          );
        })()}
        {/* Checklist card */}
        <div style={{background:"#fff",borderRadius:18,padding:"20px 22px",marginBottom:18,border:"1px solid #f0f0f8",boxShadow:"0 2px 12px rgba(124,58,237,0.06)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:15,color:"#1a1a2e"}}>필수 과정 체크리스트</div>
            <span style={{fontSize:12,fontWeight:600,color:pct===100?"#16a34a":accent}}>{pct}%</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8,marginBottom:14}}>
            {TASKS.map(t=>(
              <div key={t.id} onClick={()=>setChecks(c=>({...c,[t.id]:!c[t.id]}))} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:10,background:checks[t.id]?"#f0fdf4":"#fafafa",border:`1px solid ${checks[t.id]?"#bbf7d0":"#f0f0f0"}`,cursor:"pointer",userSelect:"none"}}>
                <div style={{width:20,height:20,borderRadius:6,background:checks[t.id]?"#16a34a":accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {checks[t.id]&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}
                </div>
                <span style={{fontSize:12,color:checks[t.id]?"#888":"#333",textDecoration:checks[t.id]?"line-through":"none",flex:1,lineHeight:1.4}}>{t.text}</span>
                {t.url&&<a href={t.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:11,color:accent,textDecoration:"none",flexShrink:0}}>↗</a>}
              </div>
            ))}
          </div>
          <div style={{height:5,background:"#f0f0f8",borderRadius:99}}>
            <div style={{height:"100%",borderRadius:99,background:pct===100?"#16a34a":accent,width:`${pct}%`,transition:"width 0.4s ease"}}/>
          </div>
          <div style={{fontSize:11,color:"#bbb",marginTop:6}}>{done}/{TASKS.length} 완료</div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?accent:"#fff",color:tab===t.id?"#fff":"#666",border:tab===t.id?"none":"1px solid #ebebf5",borderRadius:10,padding:"7px 14px",fontSize:13,fontWeight:tab===t.id?600:400,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{background:"#fff",borderRadius:18,padding:"20px 22px",border:"1px solid #f0f0f8",boxShadow:"0 2px 12px rgba(124,58,237,0.05)"}}>
          <div style={{fontWeight:700,fontSize:15,color:"#1a1a2e",marginBottom:16,display:"flex",alignItems:"center",gap:7}}>
            <span>{curTab?.icon}</span><span>{curTab?.label}</span>
          </div>
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
