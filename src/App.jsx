import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMCUREbwO3e0DxnZVr3MGajk8CmBfA1_w",
  authDomain: "coaching-portal-2363f.firebaseapp.com",
  projectId: "coaching-portal-2363f",
  storageBucket: "coaching-portal-2363f.firebasestorage.app",
  messagingSenderId: "867806990305",
  appId: "1:867806990305:web:63de8bfb6c357141f20ca0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COACHES = ["김윤정","임서영","윤민정","나지수","서예린"];
const ADMIN = "김윤정";

const TASKS = [
  {id:"t1",title:"신입코치 영상 1",sub:"V-CAM",url:"https://vcampus.educo.co.kr/login",color:"#5C6BC0"},
  {id:"t2",title:"신입코치 영상 2",sub:"V-CAM",url:"https://vcampus.educo.co.kr/login",color:"#5C6BC0"},
  {id:"t3",title:"한국코칭심리협회 TLC 3급",sub:"IKCPA",url:"http://www.ikcpa.or.kr/",color:"#26A69A"},
  {id:"t4",title:"인생코칭",sub:"",url:"",color:"#EF5350"},
  {id:"t5",title:"한국코칭심리협회 플래닝코칭",sub:"IKCPA",url:"http://www.ikcpa.or.kr/",color:"#26A69A"},
  {id:"t6",title:"퍼스트코칭",sub:"코칭존 사이트에서 신청",url:"",color:"#F57C00"},
  {id:"t7",title:"직무컨설팅",sub:"업무 1:1 학습 · 코칭존 사이트",url:"",color:"#F57C00"},
  {id:"t8",title:"타겟프로필 만들기",sub:"",url:"",color:"#7B1FA2"},
];

const RESOURCES = [
  {id:"r1",category:"무료수업",title:"무료수업 리뉴얼 툴",desc:"전과목 AI 결과지",url:"https://padlet.com/lyeisgoddess1031/tool-zfu04shzep9ywro3",color:"#1565C0"},
  {id:"r2",category:"마케팅",title:"타겟마케팅 올인원",desc:"e상상코칭부 리더용",url:"https://bit.ly/4edfHgS",color:"#7B1FA2"},
  {id:"r3",category:"코치 매뉴얼",title:"코치 매뉴얼 (Notion)",desc:"코치용 전체 매뉴얼",url:"https://mvpworld.notion.site/7725b8a36d144cf5ae4b908f6b49bd15",color:"#333"},
  {id:"r4",category:"코치 매뉴얼",title:"e상상코칭부 올인원",desc:"코치 업무 전반 자료",url:"https://bit.ly/4dfIeT8",color:"#333"},
  {id:"r5",category:"코치 매뉴얼",title:"신입코치 안내 패들렛",desc:"온보딩 안내 자료",url:"https://padlet.com/wawacoachingsongdo/breakout-link/QgJV4ZzZYE7K4mBk-WZ3GbDk20knvL0p6",color:"#333"},
  {id:"r6",category:"수수료",title:"e상상 코치 수수료",desc:"수수료 안내",url:"https://m.site.naver.com/1rFJ3",color:"#00796B"},
  {id:"r7",category:"수수료",title:"코칭센터 코치 수수료",desc:"수수료 안내",url:"https://m.site.naver.com/1rFUc",color:"#00796B"},
  {id:"r8",category:"수수료",title:"수수료 스프레드시트",desc:"수수료 상세 표",url:"https://docs.google.com/spreadsheets/d/18u7vZ-N8HT7cJ1qRD7b-R9VGg4MGo23x/edit",color:"#00796B"},
  {id:"r9",category:"무료수업",title:"무료수업 올인원",desc:"30분 프로세스 및 자료",url:"https://sites.google.com/view/sangsangexam/",color:"#1565C0"},
  {id:"r10",category:"국어",title:"네모국어",desc:"무료 자료실",url:"https://nemokorean.com/front/main",color:"#C62828"},
  {id:"r11",category:"영어",title:"더 클래스",desc:"파닉스·초등독해·중등 그래머",url:"http://www.theclassenglish.com/",color:"#1565C0"},
  {id:"r12",category:"영어",title:"내신콘서트",desc:"중등 내신대비 기출문제",url:"https://www.naesinconcert.com/",color:"#1565C0"},
  {id:"r13",category:"입시·진로",title:"대학 어디가",desc:"직업·대학·학과·성적 분석",url:"https://adiga.kr/man/inf/mainView.do",color:"#2E7D32"},
  {id:"r14",category:"도구",title:"I ♡ PDF",desc:"PDF 편집·분할·변환",url:"https://www.ilovepdf.com/ko",color:"#555"},
];

const RES_CATS = ["전체","무료수업","마케팅","코치 매뉴얼","수수료","국어","영어","입시·진로","도구"];
const DAYS = ["일","월","화","수","목","금","토"];

function getMonthDays(y,m){return{first:new Date(y,m,1).getDay(),total:new Date(y,m+1,0).getDate()};}

// Firebase helpers
async function fbGet(col, id) {
  try { const d = await getDoc(doc(db, col, id)); return d.exists() ? d.data() : null; } catch { return null; }
}
async function fbSet(col, id, data) {
  try { await setDoc(doc(db, col, id), data); } catch(e) { console.error(e); }
}
async function fbGetAll(col) {
  try { const s = await getDocs(collection(db, col)); return s.docs.map(d=>({id:d.id,...d.data()})); } catch { return []; }
}
async function fbAdd(col, data) {
  try { const r = await addDoc(collection(db, col), data); return r.id; } catch { return null; }
}
async function fbDel(col, id) {
  try { await deleteDoc(doc(db, col, id)); } catch(e) { console.error(e); }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [inp, setInp] = useState("");
  const [err, setErr] = useState("");
  const today = new Date();
  const [y, setY] = useState(today.getFullYear());
  const [m, setM] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [checks, setChecks] = useState({});
  const [tab, setTab] = useState("calendar");
  const [resCat, setResCat] = useState("전체");
  const [showEv, setShowEv] = useState(false);
  const [showNt, setShowNt] = useState(false);
  const [newEv, setNewEv] = useState({title:"",date:"",desc:""});
  const [newNt, setNewNt] = useState({title:"",content:""});
  const [selDay, setSelDay] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const evs = await fbGetAll("events");
      const nts = await fbGetAll("notices");
      setEvents(evs);
      setNotices(nts.sort((a,b) => b.createdAt - a.createdAt));
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const d = await fbGet("checks", user);
      setChecks(d ? d.data : {});
    })();
  }, [user]);

  function login() {
    const n = inp.trim();
    if (!n) { setErr("이름을 입력해 주세요."); return; }
    if (!COACHES.includes(n)) { setErr("등록되지 않은 이름입니다."); return; }
    setUser(n);
  }

  async function toggleCheck(id) {
    const next = {...checks, [id]: !checks[id]};
    setChecks(next);
    await fbSet("checks", user, {data: next});
  }

  async function addEvent() {
    if (!newEv.title || !newEv.date) return;
    const id = await fbAdd("events", {...newEv, createdAt: Date.now()});
    if (id) setEvents(v => [...v, {...newEv, id}]);
    setNewEv({title:"",date:"",desc:""});
    setShowEv(false);
  }

  async function delEvent(id) {
    await fbDel("events", id);
    setEvents(v => v.filter(e => e.id !== id));
    setSelDay(null);
  }

  async function addNotice() {
    if (!newNt.title) return;
    const data = {...newNt, createdAt: Date.now(), date: new Date().toLocaleDateString("ko-KR")};
    const id = await fbAdd("notices", data);
    if (id) setNotices(v => [{...data, id}, ...v]);
    setNewNt({title:"",content:""});
    setShowNt(false);
  }

  async function delNotice(id) {
    await fbDel("notices", id);
    setNotices(v => v.filter(n => n.id !== id));
  }

  const {first, total} = getMonthDays(y, m);
  const cells = Array.from({length: first+total}, (_,i) => i < first ? null : i-first+1);
  function evForDay(d) {
    if (!d) return [];
    const ds = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return events.filter(e => e.date === ds);
  }
  function isToday(d) { return d === today.getDate() && m === today.getMonth() && y === today.getFullYear(); }

  const isAdmin = user === ADMIN;
  const done = TASKS.filter(t => checks[t.id]).length;
  const filtRes = resCat === "전체" ? RESOURCES : RESOURCES.filter(r => r.category === resCat);

  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; }
    .portal { max-width: 780px; margin: 0 auto; padding: 1rem; }
    .card { background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
    .tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1rem; }
    .tab-btn { padding: 7px 14px; border-radius: 8px; border: 1px solid #e0e0e0; background: #f5f5f5; color: #666; cursor: pointer; font-size: 13px; }
    .tab-btn.active { background: #5C6BC0; color: #fff; border-color: #5C6BC0; }
    .cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; }
    .cal-cell { min-height: 54px; padding: 4px; border-radius: 6px; background: #f9f9f9; border: 1px solid #eee; }
    .cal-cell.today { background: #E8EAF6; border: 1.5px solid #5C6BC0; }
    .res-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px,1fr)); gap: 10px; }
    .check-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; background: #f9f9f9; border: 1px solid #eee; margin-bottom: 7px; }
    input, textarea { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid #ddd; font-size: 14px; margin-bottom: 8px; background: #fafafa; }
    .settle-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .settle-table th, .settle-table td { border: 1px solid #ddd; padding: 6px 8px; text-align: center; vertical-align: middle; }
    .settle-table th { background: #f5f5f5; font-weight: 600; font-size: 11px; }
  `;

  if (!user) return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0f2ff"}}>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e0e0e0",padding:"2.5rem 2rem",width:320,textAlign:"center",boxShadow:"0 4px 24px #5C6BC022"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"#E8EAF6",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:26}}>🌟</div>
          <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:600,color:"#333"}}>상상코칭 포털</h2>
          <p style={{color:"#888",fontSize:13,margin:"0 0 1.5rem"}}>신입코치 포털에 오신 것을 환영합니다</p>
          <input value={inp} onChange={e=>{setInp(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="이름을 입력하세요" style={{marginBottom:8}}/>
          {err && <p style={{color:"#EF5350",fontSize:12,marginBottom:8}}>{err}</p>}
          <button onClick={login} style={{width:"100%",padding:10,borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",fontSize:15,fontWeight:600,cursor:"pointer"}}>로그인</button>
          <p style={{fontSize:11,color:"#aaa",marginTop:12}}>등록된 코치 이름으로 로그인하세요</p>
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
            <h2 style={{fontSize:18,fontWeight:600,color:"#333"}}>상상코칭 포털</h2>
            <p style={{fontSize:13,color:"#888"}}>{isAdmin ? "👑 김윤정 부서장 (관리자)" : `👋 ${user} 코치님`}</p>
          </div>
          <button onClick={()=>{setUser(null);setChecks({});}} style={{fontSize:12,padding:"6px 12px",borderRadius:8,cursor:"pointer",background:"#f5f5f5",border:"1px solid #ddd",color:"#666"}}>로그아웃</button>
        </div>

        {/* Checklist */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <h3 style={{fontSize:15,fontWeight:600,color:"#333"}}>신입코치 필수 과정</h3>
            <span style={{fontSize:12,background:done===TASKS.length?"#E8F5E9":"#f5f5f5",color:done===TASKS.length?"#2E7D32":"#888",padding:"3px 10px",borderRadius:20,fontWeight:600,border:"1px solid #eee"}}>{done} / {TASKS.length} 완료</span>
          </div>
          {TASKS.map(t => (
            <div key={t.id} className="check-item" style={{background:checks[t.id]?"#F1F8E9":"#f9f9f9"}}>
              <div onClick={()=>toggleCheck(t.id)} style={{width:20,height:20,borderRadius:4,border:`2px solid ${checks[t.id]?"#66BB6A":"#ccc"}`,background:checks[t.id]?"#66BB6A":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                {checks[t.id] && <span style={{color:"#fff",fontSize:12}}>✓</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <span style={{fontSize:13,fontWeight:500,color:checks[t.id]?"#aaa":"#333",textDecoration:checks[t.id]?"line-through":"none"}}>{t.title}</span>
                {t.sub && <span style={{fontSize:11,color:"#aaa",marginLeft:6}}>{t.sub}</span>}
              </div>
              {t.url && <a href={t.url} target="_blank" rel="noreferrer" style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:t.color+"18",color:t.color,border:`1px solid ${t.color}33`,textDecoration:"none",flexShrink:0}}>바로가기</a>}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[["calendar","📅 일정"],["resource","📂 자료실"],["settle","💰 정착지원금"],["notice","📌 공지"],...(isAdmin?[["progress","👥 코치 현황"]]:[])]
            .map(([k,l]) => <button key={k} className={`tab-btn${tab===k?" active":""}`} onClick={()=>setTab(k)}>{l}</button>)}
        </div>

        {/* Calendar */}
        {tab==="calendar" && (
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <button onClick={()=>{if(m===0){setM(11);setY(v=>v-1);}else setM(v=>v-1);}} style={{border:"none",background:"none",fontSize:22,cursor:"pointer",color:"#333"}}>‹</button>
              <span style={{fontSize:15,fontWeight:600,color:"#333"}}>{y}년 {m+1}월</span>
              <button onClick={()=>{if(m===11){setM(0);setY(v=>v+1);}else setM(v=>v+1);}} style={{border:"none",background:"none",fontSize:22,cursor:"pointer",color:"#333"}}>›</button>
            </div>
            {isAdmin && <div style={{textAlign:"right",marginBottom:8}}><button onClick={()=>setShowEv(true)} style={{fontSize:12,padding:"5px 12px",borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",cursor:"pointer"}}>+ 일정 추가</button></div>}
            <div className="cal-grid" style={{marginBottom:4}}>
              {DAYS.map((d,i) => <div key={d} style={{textAlign:"center",fontSize:11,color:i===0?"#EF5350":i===6?"#5C6BC0":"#888",padding:"4px 0",fontWeight:600}}>{d}</div>)}
            </div>
            <div className="cal-grid">
              {cells.map((d,i) => {
                const evs = evForDay(d); const col = i%7;
                return <div key={i} className={`cal-cell${isToday(d)?" today":""}`} onClick={()=>d&&evs.length&&setSelDay({d,evs})} style={{cursor:evs.length?"pointer":"default"}}>
                  {d && <>
                    <div style={{fontSize:12,fontWeight:isToday(d)?600:400,color:col===0?"#EF5350":col===6?"#5C6BC0":"#333",marginBottom:2}}>{d}</div>
                    {evs.slice(0,2).map(ev => <div key={ev.id} style={{fontSize:9,background:"#5C6BC022",color:"#5C6BC0",borderRadius:3,padding:"1px 3px",marginBottom:1,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{ev.title}</div>)}
                    {evs.length>2 && <div style={{fontSize:9,color:"#aaa"}}>+{evs.length-2}</div>}
                  </>}
                </div>;
              })}
            </div>
            {selDay && <div style={{marginTop:12,padding:12,background:"#f9f9f9",borderRadius:8,border:"1px solid #eee"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:600,color:"#333"}}>{m+1}월 {selDay.d}일 일정</span>
                <button onClick={()=>setSelDay(null)} style={{border:"none",background:"none",cursor:"pointer",fontSize:18,color:"#aaa"}}>×</button>
              </div>
              {selDay.evs.map(ev => <div key={ev.id} style={{padding:"8px 10px",background:"#fff",borderRadius:6,border:"1px solid #eee",marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,fontWeight:500,color:"#333"}}>{ev.title}</span>
                  {isAdmin && <button onClick={()=>delEvent(ev.id)} style={{border:"none",background:"none",cursor:"pointer",color:"#EF5350",fontSize:11}}>삭제</button>}
                </div>
                {ev.desc && <p style={{fontSize:12,color:"#888",marginTop:4}}>{ev.desc}</p>}
              </div>)}
            </div>}
          </div>
        )}

        {/* Resource */}
        {tab==="resource" && (
          <div className="card">
            <h3 style={{fontSize:15,fontWeight:600,color:"#333",marginBottom:12}}>자료실</h3>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {RES_CATS.map(c => <button key={c} onClick={()=>setResCat(c)} style={{padding:"5px 12px",borderRadius:20,border:"1px solid #ddd",background:resCat===c?"#5C6BC0":"#f5f5f5",color:resCat===c?"#fff":"#666",cursor:"pointer",fontSize:12}}>{c}</button>)}
            </div>
            <div className="res-grid">
              {filtRes.map(r => (
                <div key={r.id} style={{background:"#f9f9f9",borderRadius:10,border:"1px solid #eee",padding:"12px 14px",display:"flex",flexDirection:"column",gap:6}}>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:r.color+"18",color:r.color,fontWeight:600,alignSelf:"flex-start"}}>{r.category}</span>
                  <p style={{fontSize:13,fontWeight:600,color:"#333"}}>{r.title}</p>
                  <p style={{fontSize:11,color:"#888",lineHeight:1.5,flex:1}}>{r.desc}</p>
                  {r.url && <a href={r.url} target="_blank" rel="noreferrer" style={{fontSize:11,padding:"4px 10px",borderRadius:6,background:r.color+"15",color:r.color,border:`1px solid ${r.color}33`,textDecoration:"none",textAlign:"center"}}>사이트 열기</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settlement */}
        {tab==="settle" && (
          <div className="card">
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:14}}>
              <h3 style={{fontSize:15,fontWeight:600,color:"#333"}}>코치 정착지원금 (개선안)</h3>
              <span style={{fontSize:11,color:"#aaa"}}>공고일 2026.02.26 · 적용 2026.03.09 이후</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table className="settle-table">
                <thead>
                  <tr>
                    <th rowSpan={2} style={{width:80}}>구분</th>
                    <th colSpan={2} style={{background:"#EDE7F6",color:"#512DA8"}}>화상 (방문無)</th>
                    <th colSpan={2} style={{background:"#E3F2FD",color:"#1565C0"}}>방문 + 화상</th>
                    <th rowSpan={2} style={{background:"#FFF3E0",color:"#E65100",minWidth:140}}>계약해지 시</th>
                  </tr>
                  <tr>
                    <th>지급조건</th><th>지원금</th><th>지급조건</th><th>지원금</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td rowSpan={6} style={{background:"#E8EAF6",color:"#3949AB",fontWeight:600}}>1개월차</td>
                    <td>—</td><td>0원</td><td>0T</td><td>+0원</td>
                    <td rowSpan={6} style={{fontSize:10,color:"#666"}}>300,000원 × 당월 계약이행 일수 ÷ 당월 전체 일수</td>
                  </tr>
                  <tr><td rowSpan={5} style={{background:"#F3E5F5",color:"#6A1B9A",fontWeight:500}}>300,000원</td>
                    <td rowSpan={5} style={{fontSize:10,color:"#888"}}>× 계약이행 일수<br/>÷ 전체 일수</td>
                    <td>0T초과~10T미만</td><td style={{color:"#D32F2F",fontWeight:600}}>+100,000원</td>
                  </tr>
                  <tr><td>10T이상~20T미만</td><td style={{color:"#D32F2F",fontWeight:600}}>+200,000원</td></tr>
                  <tr><td>20T이상~30T미만</td><td style={{color:"#D32F2F",fontWeight:600}}>+300,000원</td></tr>
                  <tr><td>30T이상~40T미만</td><td style={{color:"#D32F2F",fontWeight:600}}>+400,000원</td></tr>
                  <tr><td>40T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>+500,000원</td></tr>
                  <tr><td rowSpan={4} style={{background:"#E8EAF6",color:"#3949AB",fontWeight:600}}>2개월차</td>
                    <td>0T</td><td>0원</td><td>0T</td><td>0원</td>
                    <td rowSpan={4} style={{fontSize:10,color:"#666"}}>500,000원 × 당월 계약이행 일수(9일~최종교육참석일) ÷ 당월 전체 일수</td>
                  </tr>
                  <tr><td>0T초과~10T미만</td><td>200,000원</td><td>0T초과~10T미만</td><td>200,000원</td></tr>
                  <tr><td>10T이상~20T미만</td><td>350,000원</td><td>10T이상~20T미만</td><td>400,000원</td></tr>
                  <tr><td>20T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>500,000원</td><td>20T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>600,000원</td></tr>
                  <tr><td rowSpan={4} style={{background:"#E8EAF6",color:"#3949AB",fontWeight:600}}>3개월차</td>
                    <td>0T</td><td>0원</td><td>0T</td><td>0원</td>
                    <td rowSpan={4} style={{fontSize:10,color:"#666"}}>500,000원 × 당월 계약이행 일수(9일~최종교육참석일) ÷ 당월 전체 일수</td>
                  </tr>
                  <tr><td>0T초과~10T미만</td><td>200,000원</td><td>0T초과~10T미만</td><td>200,000원</td></tr>
                  <tr><td>10T이상~20T미만</td><td>350,000원</td><td>10T이상~20T미만</td><td>400,000원</td></tr>
                  <tr><td>20T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>500,000원</td><td>20T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>600,000원</td></tr>
                  <tr style={{background:"#FFF8E1"}}>
                    <td style={{background:"#FFE082",color:"#E65100",fontWeight:600}}>4개월차 ★</td>
                    <td>35T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>200,000원</td>
                    <td>35T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>200,000원</td>
                    <td style={{fontSize:10,color:"#666"}}>200,000원 × 당월 계약이행 일수 ÷ 당월 전체 일수</td>
                  </tr>
                  <tr style={{background:"#E8F5E9"}}>
                    <td colSpan={3} style={{fontWeight:600,color:"#2E7D32",textAlign:"right"}}>최대 (화상): 1,500,000원</td>
                    <td colSpan={3} style={{fontWeight:600,color:"#1565C0"}}>최대 (방문+화상): 2,200,000원</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{marginTop:14,padding:"10px 14px",background:"#FFF8E1",borderRadius:8,border:"1px solid #FFD54F"}}>
              <p style={{fontSize:12,fontWeight:600,color:"#E65100",marginBottom:4}}>수수료 상세 스프레드시트</p>
              <a href="https://docs.google.com/spreadsheets/d/18u7vZ-N8HT7cJ1qRD7b-R9VGg4MGo23x/edit" target="_blank" rel="noreferrer" style={{fontSize:12,color:"#1565C0"}}>Google Sheets 바로가기 →</a>
            </div>
          </div>
        )}

        {/* Notice */}
        {tab==="notice" && (
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <h3 style={{fontSize:15,fontWeight:600,color:"#333"}}>공지사항</h3>
              {isAdmin && <button onClick={()=>setShowNt(true)} style={{fontSize:12,padding:"5px 12px",borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",cursor:"pointer"}}>+ 공지 등록</button>}
            </div>
            {notices.length===0 && <p style={{color:"#aaa",fontSize:13,textAlign:"center",padding:"2rem 0"}}>등록된 공지가 없습니다.</p>}
            {notices.map(n => <div key={n.id} style={{padding:"10px 12px",background:"#f9f9f9",borderRadius:8,border:"1px solid #eee",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div><span style={{fontSize:14,fontWeight:600,color:"#333"}}>{n.title}</span><span style={{fontSize:11,color:"#aaa",marginLeft:8}}>{n.date}</span></div>
                {isAdmin && <button onClick={()=>delNotice(n.id)} style={{border:"none",background:"none",cursor:"pointer",color:"#EF5350",fontSize:11}}>삭제</button>}
              </div>
              {n.content && <p style={{fontSize:13,color:"#666",marginTop:6,whiteSpace:"pre-wrap"}}>{n.content}</p>}
            </div>)}
          </div>
        )}

        {/* Progress */}
        {tab==="progress" && isAdmin && <ProgressTab />}

        {/* Modals */}
        {showEv && <Modal title="일정 추가" onClose={()=>setShowEv(false)}>
          <input value={newEv.title} onChange={e=>setNewEv(v=>({...v,title:e.target.value}))} placeholder="일정 제목"/>
          <input type="date" value={newEv.date} onChange={e=>setNewEv(v=>({...v,date:e.target.value}))}/>
          <textarea value={newEv.desc} onChange={e=>setNewEv(v=>({...v,desc:e.target.value}))} placeholder="메모 (선택)" rows={2} style={{resize:"none"}}/>
          <div style={{display:"flex",gap:8}}><button onClick={()=>setShowEv(false)} style={cBt}>취소</button><button onClick={addEvent} style={sBt}>저장</button></div>
        </Modal>}

        {showNt && <Modal title="공지 등록" onClose={()=>setShowNt(false)}>
          <input value={newNt.title} onChange={e=>setNewNt(v=>({...v,title:e.target.value}))} placeholder="공지 제목"/>
          <textarea value={newNt.content} onChange={e=>setNewNt(v=>({...v,content:e.target.value}))} placeholder="내용 (선택)" rows={3} style={{resize:"none"}}/>
          <div style={{display:"flex",gap:8}}><button onClick={()=>setShowNt(false)} style={cBt}>취소</button><button onClick={addNotice} style={sBt}>등록</button></div>
        </Modal>}
      </div>
    </>
  );
}

function ProgressTab() {
  const coaches = COACHES.filter(c => c !== ADMIN);
  const [allChecks, setAllChecks] = useState({});
  useEffect(() => {
    (async () => {
      const result = {};
      for (const coach of coaches) {
        const d = await fbGet("checks", coach);
        result[coach] = d ? d.data : {};
      }
      setAllChecks(result);
    })();
  }, []);
  return (
    <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:12,padding:"1rem 1.25rem"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <h3 style={{fontSize:15,fontWeight:600,color:"#333"}}>코치별 필수 과정 현황</h3>
        <span style={{fontSize:12,color:"#aaa"}}>총 {coaches.length}명</span>
      </div>
      {coaches.map(coach => {
        const ck = allChecks[coach] || {};
        const done = TASKS.filter(t => ck[t.id]).length;
        const pct = Math.round(done/TASKS.length*100);
        return (
          <div key={coach} style={{background:"#f9f9f9",borderRadius:10,border:"1px solid #eee",padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"#E8EAF6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:"#3949AB"}}>{coach[0]}</div>
                <span style={{fontSize:14,fontWeight:600,color:"#333"}}>{coach}</span>
              </div>
              <span style={{fontSize:12,padding:"3px 10px",borderRadius:20,background:pct===100?"#E8F5E9":pct>0?"#E3F2FD":"#f5f5f5",color:pct===100?"#2E7D32":pct>0?"#1565C0":"#aaa",fontWeight:600,border:"1px solid #eee"}}>
                {done}/{TASKS.length} {pct===100?"✓ 완료":pct>0?"진행중":"미시작"}
              </span>
            </div>
            <div style={{background:"#e0e0e0",borderRadius:20,height:7,overflow:"hidden",marginBottom:10}}>
              <div style={{height:"100%",width:pct+"%",background:pct===100?"#66BB6A":"#5C6BC0",borderRadius:20}}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {TASKS.map(t => (
                <span key={t.id} style={{fontSize:10,padding:"3px 8px",borderRadius:10,background:ck[t.id]?"#E8F5E9":"#fff",color:ck[t.id]?"#2E7D32":"#aaa",border:`1px solid ${ck[t.id]?"#A5D6A7":"#eee"}`}}>
                  {ck[t.id]?"✓ ":""}{t.title}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const cBt = {flex:1,padding:8,borderRadius:8,border:"1px solid #ddd",background:"#f5f5f5",cursor:"pointer",color:"#666",fontSize:13};
const sBt = {flex:1,padding:8,borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",cursor:"pointer",fontWeight:600,fontSize:13};

function Modal({title, onClose, children}) {
  return (
    <div style={{position:"fixed",inset:0,background:"#00000066",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
      <div style={{background:"#fff",borderRadius:12,padding:"1.5rem",width:340,maxWidth:"92vw",boxShadow:"0 8px 32px #00000022"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
          <h3 style={{fontSize:15,fontWeight:600,color:"#333"}}>{title}</h3>
          <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",fontSize:20,color:"#aaa"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
