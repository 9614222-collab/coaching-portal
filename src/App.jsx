import { useState, useEffect, useRef } from "react";
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

const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

const COACHES_DEFAULT = ["김윤정","임서영","윤민정","나지수","서예린"];
const ADMIN = "김윤정";

const TASKS = [
  {id:"t1",title:"신입코치 영상 1",sub:"V-CAM",url:"https://vcampus.educo.co.kr/login",color:"#5C6BC0"},
  {id:"t2",title:"신입코치 영상 2",sub:"V-CAM",url:"https://vcampus.educo.co.kr/login",color:"#5C6BC0"},
  {id:"t3",title:"한국코칭심리협회 TLC 3급",sub:"IKCPA",url:"http://www.ikcpa.or.kr/",color:"#26A69A"},
  {id:"t4",title:"인생코칭",sub:"",url:"",color:"#EF5350"},
  {id:"t6",title:"퍼스트코칭",sub:"코칭존 사이트에서 신청",url:"",color:"#F57C00"},
  {id:"t7",title:"직무컨설팅",sub:"업무 1:1 학습 · 코칭존 사이트",url:"",color:"#F57C00"},
  {id:"t8",title:"타겟프로필 만들기",sub:"",url:"",color:"#7B1FA2"},
  {id:"t9",title:"성범죄 예방교육",sub:"",url:"",color:"#C62828"},
  {id:"t10",title:"아동학대 예방교육",sub:"",url:"",color:"#C62828"},
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
const DAYS_KR = ["일","월","화","수","목","금","토"];

const FEE_TABLE = {
  "화상":{"초등":59000,"중등":67000,"고등1,2":77000,"고등3":82000},
  "방문":{"초등":64000,"중등":74000,"고등1,2":84000,"고등3":94000},
};

const DEFAULT_MESSAGES = [
  {title:"수업은 정해진 요일과 시간에 진행됩니다.",desc:"원활한 학습 진행과 수업 시간을 최대한 활용하기 위해 정해진 수업 시간을 준수하고 있습니다. 학부모님께서는 자녀가 충실하게 수업을 준비할 수 있도록 지도 부탁드립니다."},
  {title:"모든 수업은 선불이며, 4주차 수업 기준으로 진행됩니다.",desc:"주 2회 수업일 경우 월 8회 수업을 기본으로 하며, 월 5주차가 있는 경우는 해당 교사와 협의 후 휴강기간으로 대체 될 수 있습니다. 따로 협의가 없는 경우, 다음 회차 수업이 새롭게 수업이 시작되는 날이므로 수업 전까지 교육비 납부가 될 수 있도록 부탁드립니다."},
  {title:"법정 공휴일에는 수업이 진행되지 않습니다.",desc:"단, 사전에 미리 약속된 수업일은 공휴일에도 진행되며, 공휴일 휴강으로 인해 한달 수업 횟수가 미달될 경우에는 추가로 보강 수업을 진행합니다."},
  {title:"수업 변경을 원하실 경우 최소 하루 전날 말씀해주셔야합니다.",desc:"사전 논의 없이 당일 결석하는 경우 무단결석으로 처리되어 보강수업 진행이 어려우며, 1회 수업이 완료한 것으로 간주되니 불이익이 없도록 유의해 주시기 바랍니다. 단, 모든 경우에 보강의 보강수업은 없습니다."},
  {title:"수업 횟수는 반드시 맞춰드립니다.",desc:"학생 및 선생님의 개인 사정으로 수업이 이루어지지 않을 경우, 남은 수업 횟수를 맞추기 위한 보강 수업이 진행되며, 모든 일정은 학부모님과 학생, 선생님 간의 협의를 통해 조정됩니다."},
  {title:"남은 회차 수업은 모두 환불 가능합니다.",desc:"수업을 중단하고자 할 경우 최소 2주전에 미리 담당 선생님께 알려주세요. 남은 수업 회차는 모두 환불이 가능합니다."},
];

function getMonthDays(y,m){return{first:new Date(y,m,1).getDay(),total:new Date(y,m+1,0).getDate()};}

async function fbGet(col,id){try{const d=await getDoc(doc(db,col,id));return d.exists()?d.data():null;}catch{return null;}}
async function fbSet(col,id,data){try{await setDoc(doc(db,col,id),data);}catch(e){console.error(e);}}
async function fbGetAll(col){try{const s=await getDocs(collection(db,col));return s.docs.map(d=>({id:d.id,...d.data()}));}catch{return[];}}
async function fbAdd(col,data){try{const r=await addDoc(collection(db,col),data);return r.id;}catch{return null;}}
async function fbDel(col,id){try{await deleteDoc(doc(db,col,id));}catch(e){console.error(e);}}

const css=`
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;}
.portal{max-width:780px;margin:0 auto;padding:1rem;}
.card{background:#fff;border:1px solid #e0e0e0;border-radius:12px;padding:1rem 1.25rem;margin-bottom:1rem;}
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1rem;}
.tab-btn{padding:6px 12px;border-radius:8px;border:1px solid #e0e0e0;background:#f5f5f5;color:#666;cursor:pointer;font-size:12px;}
.tab-btn.active{background:#5C6BC0;color:#fff;border-color:#5C6BC0;}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}
.cal-cell{min-height:54px;padding:4px;border-radius:6px;background:#f9f9f9;border:1px solid #eee;}
.cal-cell.today{background:#E8EAF6;border:1.5px solid #5C6BC0;}
.res-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;}
.check-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:#f9f9f9;border:1px solid #eee;margin-bottom:7px;}
input,textarea,select{width:100%;padding:8px 10px;border-radius:8px;border:1px solid #ddd;font-size:14px;margin-bottom:8px;background:#fafafa;box-sizing:border-box;}
.settle-table{width:100%;border-collapse:collapse;font-size:12px;}
.settle-table th,.settle-table td{border:1px solid #ddd;padding:6px 8px;text-align:center;vertical-align:middle;}
.settle-table th{background:#f5f5f5;font-weight:600;font-size:11px;}
`;

const cBt={flex:1,padding:8,borderRadius:8,border:"1px solid #ddd",background:"#f5f5f5",cursor:"pointer",color:"#666",fontSize:13};
const sBt={flex:1,padding:8,borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",cursor:"pointer",fontWeight:600,fontSize:13};

function Modal({title,onClose,children}){
  return(
    <div style={{position:"fixed",inset:0,background:"#00000066",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
      <div style={{background:"#fff",borderRadius:12,padding:"1.5rem",width:340,maxWidth:"92vw"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
          <h3 style={{fontSize:15,fontWeight:600,color:"#333"}}>{title}</h3>
          <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",fontSize:20,color:"#aaa"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ✅ ProgressTab: coaches/addCoach/removeCoach를 props로 받음
function ProgressTab({ coaches, addCoach, removeCoach }){
  const [allChecks, setAllChecks] = useState({});
  const [newName, setNewName] = useState("");
  const coachList = coaches.filter(c => c !== ADMIN);

  useEffect(()=>{
    (async()=>{
      const result={};
      for(const coach of coachList){
        const d=await fbGet("checks",coach);
        result[coach]=d?d.data:{};
      }
      setAllChecks(result);
    })();
  },[coaches]);

  async function handleAdd(){
    const name = newName.trim();
    if(!name){ alert("이름을 입력해 주세요."); return; }
    if(coaches.includes(name)){ alert("이미 등록된 이름입니다."); return; }
    await addCoach(name);
    setNewName("");
  }

  return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <h3 style={{fontSize:15,fontWeight:600,color:"#333"}}>코치별 필수 과정 현황</h3>
        <span style={{fontSize:12,color:"#aaa"}}>총 {coachList.length}명</span>
      </div>

      {/* 코치 추가 */}
      <div style={{display:"flex",gap:8,marginBottom:16,padding:"12px 14px",background:"#f0f7ff",borderRadius:10,border:"1px solid #BBDEFB"}}>
        <input
          value={newName}
          onChange={e=>setNewName(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleAdd()}
          placeholder="새 코치 이름 입력"
          style={{flex:1,padding:"8px 10px",borderRadius:8,border:"1px solid #ddd",fontSize:13,marginBottom:0}}
        />
        <button onClick={handleAdd} style={{padding:"8px 16px",borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",cursor:"pointer",fontWeight:600,fontSize:13,flexShrink:0}}>
          + 추가
        </button>
      </div>

      {coachList.length === 0 && (
        <p style={{textAlign:"center",color:"#aaa",fontSize:13,padding:"1.5rem 0"}}>등록된 코치가 없습니다.</p>
      )}

      {coachList.map(coach=>{
        const ck=allChecks[coach]||{};
        const done=TASKS.filter(t=>ck[t.id]).length;
        const pct=Math.round(done/TASKS.length*100);
        return(
          <div key={coach} style={{background:"#f9f9f9",borderRadius:10,border:"1px solid #eee",padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"#E8EAF6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:"#3949AB"}}>{coach[0]}</div>
                <span style={{fontSize:14,fontWeight:600,color:"#333"}}>{coach}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12,padding:"3px 10px",borderRadius:20,background:pct===100?"#E8F5E9":pct>0?"#E3F2FD":"#f5f5f5",color:pct===100?"#2E7D32":pct>0?"#1565C0":"#aaa",fontWeight:600}}>
                  {done}/{TASKS.length} {pct===100?"✓ 완료":pct>0?"진행중":"미시작"}
                </span>
                <button onClick={()=>removeCoach(coach)} style={{padding:"3px 8px",borderRadius:6,background:"#fff0f0",color:"#EF5350",border:"1px solid #ffcdd2",cursor:"pointer",fontSize:11,fontWeight:600}}>삭제</button>
              </div>
            </div>
            <div style={{background:"#e0e0e0",borderRadius:20,height:7,overflow:"hidden",marginBottom:10}}>
              <div style={{height:"100%",width:pct+"%",background:pct===100?"#66BB6A":"#5C6BC0",borderRadius:20}}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {TASKS.map(t=>(
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

function ExamAnalysis(){
  const GEMINI_API_KEY = "AIzaSyB_EoXucejx_vg59VzHQdFZxlaEtX7CVl8";
  const [info,setInfo]=useState({studentName:"",grade:"",subject:"",examRange:"",unitName:"",schoolName:"",score:"",wrongQuestions:"",examPaperBase64s:[]});
  const [analysis,setAnalysis]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [isEditing,setIsEditing]=useState(false);
  const [editCurriculum,setEditCurriculum]=useState("");
  const [editComments,setEditComments]=useState("");
  const reportRef=useRef(null);
  const fileRef=useRef(null);

  function si(k,v){setInfo(f=>({...f,[k]:v}));}

  function handleFile(e){
    const files=Array.from(e.target.files||[]);
    if(info.examPaperBase64s.length+files.length>20){setError("최대 20개까지 업로드 가능합니다.");return;}
    files.forEach(file=>{
      const reader=new FileReader();
      reader.onloadend=()=>setInfo(p=>({...p,examPaperBase64s:[...p.examPaperBase64s,reader.result]}));
      reader.readAsDataURL(file);
    });
  }

  async function analyze(){
    setLoading(true);setError(null);
    try{
      const prompt=`당신은 전문 교육 컨설턴트입니다. 학생의 시험 정보를 분석하여 상세한 보고서를 JSON으로 작성하세요.
학생정보: ${info.studentName} / ${info.grade} / ${info.schoolName}
과목: ${info.subject} / 성적: ${info.score}점
시험범위: ${info.examRange} / 단원명: ${info.unitName}
틀린문제: ${info.wrongQuestions}

다음 JSON 형식으로만 응답하세요:
{
  "examLevel": "시험 난이도 분석",
  "trends": "출제 경향 분석",
  "difficultyDistribution": {"high": 30, "medium": 50, "low": 20},
  "questionAnalysis": [{"number":"1","topic":"개념명","difficulty":"상","isCorrect":true,"comment":"코멘트"}],
  "strengths": "강점 분석",
  "weaknesses": "약점 분석",
  "curriculum": "커리큘럼 계획",
  "coachComments": "코치 코멘트"
}`;

      const parts=[{text:prompt}];
      info.examPaperBase64s.forEach(b64=>{
        parts.push({inline_data:{mime_type:"image/jpeg",data:b64.split(",")[1]}});
      });

      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({contents:[{parts}]})
      });
      const data=await res.json();
      const text=data.candidates?.[0]?.content?.parts?.[0]?.text||"{}";
      const clean=text.replace(/```json|```/g,"").trim();
      const result=JSON.parse(clean);
      setAnalysis(result);
      setEditCurriculum(result.curriculum||"");
      setEditComments(result.coachComments||"");
    }catch(e){setError("분석 중 오류가 발생했습니다. 다시 시도해 주세요.");}
    finally{setLoading(false);}
  }

  async function downloadImg(){
    if(!reportRef.current)return;
    try{
      const {default:h2c}=await import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js");
      const canvas=await h2c(reportRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const a=document.createElement("a");a.href=canvas.toDataURL("image/png");
      a.download=`${info.studentName||"학생"}_시험분석보고서.png`;a.click();
    }catch(e){alert("저장 중 오류가 발생했습니다.");}
  }

  const iSt={width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #ddd",fontSize:13,marginBottom:8,background:"#fafafa"};
  const lb={fontSize:11,color:"#555",fontWeight:600,marginBottom:4,display:"block"};

  return(
    <div className="card">
      <h3 style={{fontSize:15,fontWeight:600,color:"#333",marginBottom:14}}>📊 시험분석 보고서</h3>
      <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:20,alignItems:"start"}}>
        <div style={{background:"#f8fafc",borderRadius:12,padding:20,border:"1px solid #e2e8f0"}}>
          <p style={{fontSize:13,fontWeight:600,color:"#4f46e5",marginBottom:14}}>📋 회원 정보 입력</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <label><span style={lb}>이름</span><input style={iSt} value={info.studentName} onChange={e=>si("studentName",e.target.value)} placeholder="홍길동"/></label>
            <label><span style={lb}>학년</span><input style={iSt} value={info.grade} onChange={e=>si("grade",e.target.value)} placeholder="중3"/></label>
            <label><span style={lb}>과목</span><input style={iSt} value={info.subject} onChange={e=>si("subject",e.target.value)} placeholder="수학"/></label>
            <label><span style={lb}>성적</span><input style={iSt} value={info.score} onChange={e=>si("score",e.target.value)} placeholder="85"/></label>
          </div>
          <label><span style={lb}>학교 이름</span><input style={iSt} value={info.schoolName} onChange={e=>si("schoolName",e.target.value)} placeholder="대치중학교"/></label>
          <label><span style={lb}>시험 범위</span><input style={iSt} value={info.examRange} onChange={e=>si("examRange",e.target.value)} placeholder="1단원 ~ 3단원"/></label>
          <label><span style={lb}>단원명</span><input style={iSt} value={info.unitName} onChange={e=>si("unitName",e.target.value)} placeholder="다항식의 연산, 인수분해"/></label>
          <label><span style={lb}>틀린 문제 번호</span><input style={iSt} value={info.wrongQuestions} onChange={e=>si("wrongQuestions",e.target.value)} placeholder="5, 12, 18, 20"/></label>

          <span style={lb}>시험지 이미지 (최대 20개)</span>
          <div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed #c7d2fe",borderRadius:8,padding:12,textAlign:"center",cursor:"pointer",background:"#eef2ff",marginBottom:8}}>
            <p style={{fontSize:12,color:"#6366f1"}}>⬆ 시험지 이미지 추가 ({info.examPaperBase64s.length}/20)</p>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleFile}/>
          </div>
          {info.examPaperBase64s.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4,marginBottom:8}}>
            {info.examPaperBase64s.map((img,i)=>(
              <div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:6,overflow:"hidden",border:"1px solid #ddd"}}>
                <img src={img} alt={`시험지${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <button onClick={()=>setInfo(p=>({...p,examPaperBase64s:p.examPaperBase64s.filter((_,j)=>j!==i)}))} style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,0.5)",color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              </div>
            ))}
          </div>}

          {error&&<p style={{fontSize:12,color:"#ef4444",marginBottom:8,padding:"8px 10px",background:"#fff1f2",borderRadius:6}}>{error}</p>}

          <button onClick={analyze} disabled={loading||!info.studentName||!info.subject} style={{width:"100%",padding:"12px",borderRadius:10,background:loading?"#c7d2fe":"#4f46e5",color:"#fff",border:"none",cursor:loading?"not-allowed":"pointer",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {loading?<><div style={{width:16,height:16,border:"2px solid #fff",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/> 분석 중...</>:"📊 분석 리포트 생성"}
          </button>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>

        <div>
          {!analysis&&!loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:400,color:"#aaa",fontSize:14}}>
            <div style={{fontSize:48,marginBottom:12}}>📄</div>
            <p>정보를 입력하고 분석을 시작하세요.</p>
          </div>}

          {loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:400,color:"#6366f1",fontSize:14,gap:16}}>
            <div style={{width:40,height:40,border:"4px solid #c7d2fe",borderTopColor:"#4f46e5",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
            <p>전문가의 분석이 진행 중입니다...</p>
          </div>}

          {analysis&&<div>
            <div style={{display:"flex",gap:8,marginBottom:12,justifyContent:"flex-end"}}>
              <button onClick={()=>setIsEditing(!isEditing)} style={{padding:"7px 14px",borderRadius:8,background:isEditing?"#059669":"#f5f5f5",color:isEditing?"#fff":"#555",border:"1px solid #ddd",cursor:"pointer",fontSize:12,fontWeight:600}}>
                {isEditing?"✓ 수정 완료":"✏️ 내용 수정하기"}
              </button>
              <button onClick={downloadImg} disabled={isEditing} style={{padding:"7px 14px",borderRadius:8,background:"#4f46e5",color:"#fff",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,opacity:isEditing?0.5:1}}>
                ⬇ 이미지 저장
              </button>
            </div>

            <div style={{background:"#e5e7eb",borderRadius:16,padding:16,overflowY:"auto",maxHeight:700}}>
              <div ref={reportRef} style={{background:"#fff",fontFamily:"'Malgun Gothic',sans-serif"}}>
                <div style={{width:"100%",padding:"40px 36px",boxSizing:"border-box",position:"relative",minHeight:600}}>
                  <div style={{height:4,background:"#4f46e5",marginBottom:24}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24,paddingBottom:16,borderBottom:"3px solid #4f46e5"}}>
                    <div>
                      <h1 style={{fontSize:28,fontWeight:700,color:"#312e81",marginBottom:4}}>시험분석 보고서</h1>
                      <span style={{background:"#4f46e5",color:"#fff",fontSize:10,padding:"2px 8px",borderRadius:4,fontWeight:700}}>Analysis Report · PAGE 1/2</span>
                    </div>
                    <p style={{fontSize:11,color:"#94a3b8"}}>발행일: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,background:"#f8fafc",padding:20,borderRadius:12,marginBottom:20,border:"1px solid #e2e8f0"}}>
                    {[["👤 이름/학년",`${info.studentName} (${info.grade})`],["📚 과목/성적",`${info.subject} (${info.score}점)`],["🏫 학교",info.schoolName],["📋 시험범위",info.examRange]].map(([l,v])=>(
                      <div key={l} style={{display:"flex",gap:10,alignItems:"center"}}>
                        <div style={{background:"#e0e7ff",padding:"6px 8px",borderRadius:8,fontSize:14}}>{l.split(" ")[0]}</div>
                        <div>
                          <p style={{fontSize:9,color:"#94a3b8",fontWeight:700,marginBottom:2}}>{l.split(" ").slice(1).join(" ")}</p>
                          <p style={{fontSize:13,fontWeight:700,color:"#1e293b"}}>{v}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:16,marginBottom:20}}>
                    <div>
                      <p style={{fontSize:13,fontWeight:700,color:"#312e81",marginBottom:10}}>📊 난이도 분포</p>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {[["상",analysis.difficultyDistribution?.high||0,"#ef4444"],["중",analysis.difficultyDistribution?.medium||0,"#f59e0b"],["하",analysis.difficultyDistribution?.low||0,"#10b981"]].map(([l,v,c])=>(
                          <div key={l} style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:11,fontWeight:700,color:c,width:16}}>{l}</span>
                            <div style={{flex:1,background:"#f1f5f9",borderRadius:20,height:10}}>
                              <div style={{width:`${v}%`,height:"100%",background:c,borderRadius:20}}/>
                            </div>
                            <span style={{fontSize:11,color:"#64748b",width:30}}>{v}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{fontSize:13,fontWeight:700,color:"#312e81",marginBottom:10}}>📝 출제 경향 분석</p>
                      <div style={{background:"#f8fafc",padding:14,borderRadius:10,border:"1px solid #e2e8f0",fontSize:11,color:"#475569",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{analysis.trends}</div>
                    </div>
                  </div>
                  <p style={{fontSize:13,fontWeight:700,color:"#312e81",marginBottom:10}}>✅ 문항별 분석</p>
                  <div style={{border:"1px solid #e2e8f0",borderRadius:10,overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead>
                        <tr style={{background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>
                          {["No","주요 개념","난이도","결과","코멘트"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,color:"#64748b",fontSize:10}}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.questionAnalysis.map((q,i)=>(
                          <tr key={i} style={{borderBottom:"1px solid #f1f5f9"}}>
                            <td style={{padding:"6px 10px",fontWeight:700,color:"#4f46e5"}}>{q.number}</td>
                            <td style={{padding:"6px 10px",color:"#1e293b",fontWeight:500}}>{q.topic}</td>
                            <td style={{padding:"6px 10px"}}>
                              <span style={{padding:"2px 6px",borderRadius:4,fontSize:10,fontWeight:700,background:q.difficulty==="상"?"#fee2e2":q.difficulty==="중"?"#fef3c7":"#d1fae5",color:q.difficulty==="상"?"#b91c1c":q.difficulty==="중"?"#92400e":"#065f46"}}>{q.difficulty}</span>
                            </td>
                            <td style={{padding:"6px 10px",textAlign:"center",fontWeight:700,color:q.isCorrect?"#059669":"#ef4444"}}>{q.isCorrect?"✓":"✗"}</td>
                            <td style={{padding:"6px 10px",color:"#64748b",fontSize:10}}>{q.comment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div style={{width:"100%",padding:"40px 36px",boxSizing:"border-box",position:"relative",borderTop:"4px solid #e2e8f0"}}>
                  <div style={{height:4,background:"#4f46e5",marginBottom:24}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24,paddingBottom:16,borderBottom:"3px solid #4f46e5"}}>
                    <div>
                      <h1 style={{fontSize:28,fontWeight:700,color:"#312e81",marginBottom:4}}>시험분석 보고서</h1>
                      <span style={{background:"#4f46e5",color:"#fff",fontSize:10,padding:"2px 8px",borderRadius:4,fontWeight:700}}>Analysis Report · PAGE 2/2</span>
                    </div>
                    <p style={{fontSize:11,color:"#94a3b8"}}>발행일: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
                    <div style={{background:"#ecfdf5",padding:20,borderRadius:12,border:"1px solid #a7f3d0"}}>
                      <p style={{fontSize:13,fontWeight:700,color:"#065f46",marginBottom:10}}>✅ 학습 성취 및 강점</p>
                      <p style={{fontSize:11,color:"#334155",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{analysis.strengths}</p>
                    </div>
                    <div style={{background:"#fff1f2",padding:20,borderRadius:12,border:"1px solid #fecdd3"}}>
                      <p style={{fontSize:13,fontWeight:700,color:"#9f1239",marginBottom:10}}>⚠️ 취약 단원 및 보완점</p>
                      <p style={{fontSize:11,color:"#334155",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{analysis.weaknesses}</p>
                    </div>
                  </div>
                  <div style={{background:"#1e1b4b",color:"#fff",padding:24,borderRadius:12,marginBottom:20,borderTop:"6px solid #6366f1"}}>
                    <p style={{fontSize:13,fontWeight:700,color:"#a5b4fc",marginBottom:10}}>📅 NEXT LEVEL CURRICULUM</p>
                    {isEditing?(
                      <textarea value={editCurriculum} onChange={e=>setEditCurriculum(e.target.value)} style={{width:"100%",background:"rgba(255,255,255,0.1)",border:"1px solid #6366f1",borderRadius:8,padding:10,color:"#e0e7ff",fontSize:11,lineHeight:1.7,resize:"vertical",minHeight:100}}/>
                    ):(
                      <p style={{fontSize:11,color:"#c7d2fe",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{editCurriculum}</p>
                    )}
                  </div>
                  <div style={{background:"#fff",padding:20,borderRadius:12,border:"2px solid #e2e8f0"}}>
                    <p style={{fontSize:11,fontWeight:700,color:"#4f46e5",marginBottom:10}}>💬 COACH MESSAGE</p>
                    {isEditing?(
                      <textarea value={editComments} onChange={e=>setEditComments(e.target.value)} style={{width:"100%",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:10,color:"#475569",fontSize:11,lineHeight:1.7,resize:"vertical",minHeight:80}}/>
                    ):(
                      <p style={{fontSize:11,color:"#475569",fontStyle:"italic",lineHeight:1.7}}>"{editComments}"</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

function FreeLessonNotice(){
  const SUBJECTS=['국어','영어','수학','사회','과학','공부9도'];
  const WEEKDAYS=['월요일','화요일','수요일','목요일','금요일','토요일','일요일'];
  const MERIDIEMS=['오전','오후'];
  const [form,setForm]=useState({studentName:'',teacherName:'',subject:'수학',month:'1',day:'1',weekday:'월요일',meridiem:'오후',hour:'10',minute:'00',testId:'',testPassword:'',guideImage:''});
  const previewRef=useRef(null);
  const fileRef=useRef(null);
  function sf(k,v){setForm(f=>({...f,[k]:v}));}
  function handleImg(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onloadend=()=>sf('guideImage',reader.result);reader.readAsDataURL(file);}
  async function downloadJpg(){
    if(!previewRef.current)return;
    try{
      const {default:h2c}=await import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js");
      const canvas=await h2c(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const a=document.createElement('a');a.href=canvas.toDataURL('image/jpeg',0.95);
      a.download=`무료수업안내_${form.month}월${form.day}일_${form.studentName||'학생'}.jpg`;a.click();
    }catch(e){alert('이미지 저장 중 오류가 발생했습니다.');}
  }
  const fmtDate=`${form.month}월 ${form.day}일 ${form.weekday}`;
  const fmtTime=`${form.meridiem} ${form.hour}시 ${form.minute}분`;
  const lb={fontSize:11,color:"#888",marginBottom:4,display:"block",fontWeight:600};
  const iSt={width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #ddd",fontSize:13,marginBottom:0,background:"#fafafa",boxSizing:"border-box"};
  return(
    <div className="card">
      <h3 style={{fontSize:15,fontWeight:600,color:"#333",marginBottom:14}}>🆓 무료수업 안내문 생성</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"#FFFDF0",borderRadius:10,padding:14,border:"1px solid #FFE082"}}>
            <p style={{fontSize:13,fontWeight:600,color:"#B45309",marginBottom:10}}>ℹ️ 학생 및 기본 정보</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <label><span style={lb}>학생 성함</span><input style={iSt} value={form.studentName} onChange={e=>sf('studentName',e.target.value)} placeholder="학생 이름"/></label>
              <label><span style={lb}>선생님 성함</span><input style={iSt} value={form.teacherName} onChange={e=>sf('teacherName',e.target.value)} placeholder="선생님 이름"/></label>
              <label><span style={lb}>수업 과목</span><select style={iSt} value={form.subject} onChange={e=>sf('subject',e.target.value)}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></label>
            </div>
          </div>
          <div style={{background:"#FFFDF0",borderRadius:10,padding:14,border:"1px solid #FFE082"}}>
            <p style={{fontSize:13,fontWeight:600,color:"#B45309",marginBottom:10}}>📅 수업 일정 설정</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
              <label><span style={lb}>월</span><input style={iSt} type="number" min="1" max="12" value={form.month} onChange={e=>sf('month',e.target.value)}/></label>
              <label><span style={lb}>일</span><input style={iSt} type="number" min="1" max="31" value={form.day} onChange={e=>sf('day',e.target.value)}/></label>
              <label><span style={lb}>요일</span><select style={iSt} value={form.weekday} onChange={e=>sf('weekday',e.target.value)}>{WEEKDAYS.map(w=><option key={w}>{w}</option>)}</select></label>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <label><span style={lb}>오전/오후</span><select style={iSt} value={form.meridiem} onChange={e=>sf('meridiem',e.target.value)}>{MERIDIEMS.map(m=><option key={m}>{m}</option>)}</select></label>
              <label><span style={lb}>시</span><input style={iSt} type="number" min="1" max="12" value={form.hour} onChange={e=>sf('hour',e.target.value)}/></label>
              <label><span style={lb}>분</span><input style={iSt} type="number" min="0" max="59" value={form.minute} onChange={e=>sf('minute',e.target.value)}/></label>
            </div>
          </div>
          <div style={{background:"#FFFDF0",borderRadius:10,padding:14,border:"1px solid #FFE082"}}>
            <p style={{fontSize:13,fontWeight:600,color:"#B45309",marginBottom:10}}>🎥 강의실 및 안내 정보</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <label><span style={lb}>아이디</span><input style={iSt} value={form.testId} onChange={e=>sf('testId',e.target.value)} placeholder="ID 입력"/></label>
              <label><span style={lb}>비밀번호</span><input style={iSt} value={form.testPassword} onChange={e=>sf('testPassword',e.target.value)} placeholder="PW 입력"/></label>
            </div>
            <span style={lb}>수업 안내 이미지 (안내문 하단)</span>
            <div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed #ddd",borderRadius:8,padding:16,textAlign:"center",cursor:"pointer",background:"#fafafa",position:"relative"}}>
              {form.guideImage?(<div style={{position:"relative"}}><img src={form.guideImage} alt="guide" style={{width:"100%",borderRadius:6,objectFit:"contain",maxHeight:200}}/><button onClick={e=>{e.stopPropagation();sf('guideImage','');}} style={{position:"absolute",top:4,right:4,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",color:"#EF5350",fontWeight:700}}>×</button></div>):(<div style={{color:"#aaa",fontSize:12}}><div style={{fontSize:24,marginBottom:6}}>⬆</div><p>수업 안내 이미지 업로드</p></div>)}
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImg}/>
            </div>
          </div>
          <button onClick={downloadJpg} style={{padding:12,borderRadius:10,background:"#F59E0B",color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontSize:14}}>⬇ JPG 저장</button>
        </div>
        <div>
          <p style={{fontSize:13,fontWeight:600,color:"#333",marginBottom:8}}>👁 미리보기</p>
          <div style={{background:"#e5e7eb",borderRadius:16,padding:16,overflowY:"auto",maxHeight:700}}>
            <div ref={previewRef} style={{background:"#fff",padding:"32px 28px",position:"relative",overflow:"hidden",minHeight:500}}>
              <div style={{position:"absolute",top:0,left:0,width:"100%",height:6,background:"#F59E0B"}}/>
              <div style={{marginTop:16,marginBottom:20}}>
                <p style={{fontWeight:700,fontSize:15,color:"#1a1a1a"}}>안녕하세요. <span style={{color:"#B45309",fontSize:17}}>{form.studentName||"[학생이름]"}</span> 학생, <span style={{color:"#B45309",fontSize:17}}>{form.teacherName||"[선생님성함]"}</span> 코치입니다. 무료수업 확정 안내 드립니다.</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:"14px 0",borderTop:"1px solid #FEF3C7",borderBottom:"1px solid #FEF3C7",marginBottom:16}}>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#B45309"}}>📅 날짜 : {fmtDate}</p>
                  <p style={{fontSize:12,fontWeight:700,color:"#B45309"}}>🕐 시간 : {fmtTime}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,paddingLeft:12,borderLeft:"1px solid #FEF3C7"}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#B45309"}}>👤 ID : <span style={{color:"#1565C0"}}>{form.testId||"미입력"}</span></p>
                  <p style={{fontSize:12,fontWeight:700,color:"#B45309"}}>🔒 PW : <span style={{color:"#1565C0"}}>{form.testPassword||"미입력"}</span></p>
                </div>
              </div>
              {form.guideImage?(<img src={form.guideImage} alt="guide" style={{width:"100%",borderRadius:8,marginBottom:16}}/>):(<div style={{border:"2px dashed #FEF3C7",borderRadius:8,padding:"40px 0",textAlign:"center",color:"#FCD34D",marginBottom:16,fontSize:12}}>수업 안내 이미지를 업로드해주세요</div>)}
              <div style={{textAlign:"center",paddingTop:12}}>
                <p style={{fontSize:14,fontWeight:700,color:"#1a1a1a"}}>{form.teacherName?`${form.teacherName} 코치`:"코치"} 드림</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoticeGen(){
  const [form,setForm]=useState({name:"",grade:"",schoolLevel:"초등",type:"화상",subject:"영어",times:"2",duration:"60",days:"매주 화요일 오후 4시, 매주 목요일 오후 4시",firstDate:"",book:"",publisher:"",studentId:"",studentPw:"",fee:"",planning:false,teacherPhone:"010-1234-5678",managerPhone:"010-2800-1465"});
  const [preview,setPreview]=useState(false);
  const [messages,setMessages]=useState(DEFAULT_MESSAGES.map(m=>({...m})));
  const [editingMsg,setEditingMsg]=useState(null);
  const p1=useRef(null),p2=useRef(null),p3=useRef(null);
  function set(k,v){setForm(f=>({...f,[k]:v}));}
  function calcFee(){const t=parseInt(form.times)||0;const base=FEE_TABLE[form.type]?.[form.schoolLevel]||0;const pl=form.planning?30000:0;return(base*t+pl).toLocaleString("ko-KR");}
  async function downloadImg(){
    const pages=[{ref:p1,name:"1페이지_수업안내"},{ref:p2,name:"2페이지_학부모말씀"},{ref:p3,name:"3페이지_결제안내"}];
    try{
      const {default:h2c}=await import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js");
      for(const p of pages){
        if(!p.ref.current)continue;
        const canvas=await h2c(p.ref.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
        const a=document.createElement("a");a.href=canvas.toDataURL("image/png");a.download=`${form.name||"안내문"}_${p.name}.png`;a.click();
        await new Promise(r=>setTimeout(r,400));
      }
    }catch(e){alert("이미지 저장 중 오류가 발생했습니다.");}
  }
  const fee=form.fee||calcFee();
  const lb={display:"flex",flexDirection:"column",gap:4};
  const iSt2={padding:"8px 10px",borderRadius:8,border:"1px solid #ddd",fontSize:14,marginBottom:0,background:"#fafafa",width:"100%"};
  return(
    <div className="card">
      <h3 style={{fontSize:15,fontWeight:600,color:"#333",marginBottom:14}}>📄 수업 안내문 생성</h3>
      {!preview?(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>회원 이름</span><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="예) 김학부모"/></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>수업 대상 학년</span><input value={form.grade} onChange={e=>set("grade",e.target.value)} placeholder="예) 중학교 1학년"/></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>수업 형태</span><select value={form.type} onChange={e=>set("type",e.target.value)} style={iSt2}><option value="화상">화상 수업</option><option value="방문">방문 수업</option></select></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>학교급</span><select value={form.schoolLevel} onChange={e=>set("schoolLevel",e.target.value)} style={iSt2}><option value="초등">초등</option><option value="중등">중등</option><option value="고등1,2">고등 1,2</option><option value="고등3">고등 3</option></select></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>수업 과목</span><input value={form.subject} onChange={e=>set("subject",e.target.value)} placeholder="예) 영어"/></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>주 수업 횟수 (타임)</span><select value={form.times} onChange={e=>set("times",e.target.value)} style={iSt2}>{[1,2,3,4,5,6,7,8].map(n=><option key={n} value={String(n)}>{n}타임</option>)}</select></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>1회 수업 시간(분)</span><input value={form.duration} onChange={e=>set("duration",e.target.value)} placeholder="예) 60"/></label>
            <div onClick={()=>set("planning",!form.planning)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#F3E5F5",borderRadius:8,border:"1px solid #CE93D8",cursor:"pointer"}}>
              <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${form.planning?"#7B1FA2":"#CE93D8"}`,background:form.planning?"#7B1FA2":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{form.planning&&<span style={{color:"#fff",fontSize:12}}>✓</span>}</div>
              <span style={{fontSize:13,fontWeight:600,color:"#4A148C"}}>플래닝 코칭 추가</span>
              <span style={{fontSize:12,color:"#7B1FA2"}}>+ 30,000원</span>
            </div>
            <div style={{background:"#f0f7ff",borderRadius:10,padding:"12px 16px",border:"1px solid #BBDEFB",display:"flex",alignItems:"center",justifyContent:"space-between",gridColumn:"1/-1"}}>
              <div>
                <p style={{fontSize:11,color:"#1565C0",fontWeight:600,marginBottom:2}}>📊 예상 월 수업료 (자동계산)</p>
                <p style={{fontSize:11,color:"#888"}}>{form.type} · {form.schoolLevel} · {form.times}타임{form.planning?" + 플래닝":""}</p>
                <p style={{fontSize:11,color:"#888"}}>단가: {(FEE_TABLE[form.type]?.[form.schoolLevel]||0).toLocaleString("ko-KR")}원 × {form.times}타임{form.planning?" + 30,000원":""}</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{fontSize:22,fontWeight:700,color:"#1565C0"}}>{calcFee()}원</p>
                <input value={form.fee} onChange={e=>set("fee",e.target.value)} placeholder="직접 입력시 덮어쓰기" style={{fontSize:11,padding:"4px 8px",marginBottom:0,marginTop:4,textAlign:"right",width:140}}/>
              </div>
            </div>
            <label style={{...lb,gridColumn:"1/-1"}}><span style={{fontSize:12,color:"#555"}}>수업 요일 및 시간</span><input value={form.days} onChange={e=>set("days",e.target.value)} placeholder="예) 매주 화요일 오후 4시, 매주 목요일 오후 4시"/></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>첫 수업 날짜</span><input value={form.firstDate} onChange={e=>set("firstDate",e.target.value)} placeholder="예) 3월 5일 (화) 오후 4시"/></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>교재명</span><input value={form.book} onChange={e=>set("book",e.target.value)} placeholder="예) 기적의 파닉스"/></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>출판사</span><input value={form.publisher} onChange={e=>set("publisher",e.target.value)} placeholder="예) 길벗스쿨"/></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>학생 아이디</span><input value={form.studentId} onChange={e=>set("studentId",e.target.value)} placeholder="예) student123"/></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>학생 비밀번호</span><input value={form.studentPw} onChange={e=>set("studentPw",e.target.value)} placeholder="예) 1234"/></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>수업 선생님 연락처</span><input value={form.teacherPhone} onChange={e=>set("teacherPhone",e.target.value)}/></label>
            <label style={lb}><span style={{fontSize:12,color:"#555"}}>담당 매니저 연락처</span><input value={form.managerPhone} onChange={e=>set("managerPhone",e.target.value)}/></label>
            <div style={{gridColumn:"1/-1",marginTop:8}}>
              <p style={{fontSize:13,fontWeight:600,color:"#333",marginBottom:10}}>📝 학부모님께 드리는 말씀 수정</p>
              {messages.map((msg,i)=>(
                <div key={i} style={{border:"1px solid #eee",borderRadius:8,overflow:"hidden",marginBottom:8}}>
                  {editingMsg===i?(
                    <div style={{padding:"10px",background:"#f9f9f9"}}>
                      <p style={{fontSize:11,color:"#555",marginBottom:4}}>제목</p>
                      <input value={msg.title} onChange={e=>{const next=[...messages];next[i]={...next[i],title:e.target.value};setMessages(next);}} style={{marginBottom:6}}/>
                      <p style={{fontSize:11,color:"#555",marginBottom:4}}>내용</p>
                      <textarea value={msg.desc} onChange={e=>{const next=[...messages];next[i]={...next[i],desc:e.target.value};setMessages(next);}} rows={3} style={{resize:"vertical",marginBottom:6}}/>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>setEditingMsg(null)} style={{...sBt,flex:1,padding:"6px"}}>완료</button>
                        <button onClick={()=>{const next=[...messages];next[i]={...DEFAULT_MESSAGES[i]};setMessages(next);setEditingMsg(null);}} style={{...cBt,flex:1,padding:"6px",fontSize:11}}>초기화</button>
                      </div>
                    </div>
                  ):(
                    <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",cursor:"pointer"}} onClick={()=>setEditingMsg(i)}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:"#E8EAF6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#3949AB",flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:12,fontWeight:600,color:"#333",marginBottom:2}}>{msg.title}</p>
                        <p style={{fontSize:11,color:"#888",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{msg.desc}</p>
                      </div>
                      <span style={{fontSize:11,color:"#5C6BC0",flexShrink:0}}>✏️ 수정</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button onClick={()=>setPreview(true)} style={{...sBt,marginTop:8,padding:"10px"}}>미리보기 →</button>
        </div>
      ):(
        <div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button onClick={()=>setPreview(false)} style={cBt}>← 수정하기</button>
            <button onClick={downloadImg} style={{...sBt,flex:2}}>⬇ 이미지 다운로드 (3장)</button>
          </div>
          {/* 1페이지 */}
          <div ref={p1} style={{background:"#fff",padding:"40px 36px",fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif",maxWidth:700,margin:"0 auto",border:"1px solid #ddd",borderRadius:8}}>
            <div style={{textAlign:"center",marginBottom:32}}>
              <h1 style={{fontSize:26,fontWeight:700,color:"#1a1a1a",marginBottom:6}}>수업 일정 및 로그인 안내</h1>
              <p style={{fontSize:13,color:"#888"}}>수업 일정 및 수업료, 그리고 홈페이지 (상상코칭) 로그인 정보를 확인해주세요.</p>
            </div>
            <div style={{border:"1.5px solid #4A90D9",borderRadius:10,padding:"20px 24px",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><span style={{fontSize:18}}>📅</span><h2 style={{fontSize:16,fontWeight:700}}>수업 일정 및 수업료</h2></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                <div style={{display:"flex",flexDirection:"column",gap:10,paddingRight:20,borderRight:"1px solid #eee"}}>
                  {[["회원 이름",form.name||"—"],["수업 형태",`${form.type==="화상"?"화상":"방문"} 수업 (${form.subject})`],["수업 시간",`1회 ${form.duration}분`],["수업 요일",form.days||"—"],["첫 수업",form.firstDate||"—"]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",gap:12,fontSize:13}}>
                      <span style={{color:"#888",minWidth:72,flexShrink:0}}>{k}</span>
                      <span style={{color:k==="첫 수업"?"#1565C0":"#1a1a1a",fontWeight:k==="첫 수업"?600:400}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10,paddingLeft:20}}>
                  {[["수업 대상",form.grade||"—"],["수업 횟수",`주 ${form.times}회`]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",gap:12,fontSize:13}}>
                      <span style={{color:"#888",minWidth:72,flexShrink:0}}>{k}</span>
                      <span style={{color:k==="수업 횟수"?"#1565C0":"#1a1a1a",fontWeight:k==="수업 횟수"?700:400}}>{v}</span>
                    </div>
                  ))}
                  <div style={{marginTop:8,padding:"12px 16px",background:"#f0f7ff",borderRadius:8,textAlign:"right"}}>
                    <p style={{fontSize:11,color:"#888",marginBottom:2}}>□ 예상 월 수업료</p>
                    <p style={{fontSize:24,fontWeight:700,color:"#1565C0"}}>{fee}원</p>
                    <p style={{fontSize:10,color:"#aaa"}}>{form.type} · {form.schoolLevel}{form.planning?" + 플래닝":""}</p>
                  </div>
                </div>
              </div>
            </div>
            {form.book&&<div style={{border:"1.5px solid #4A90D9",borderRadius:10,padding:"20px 24px",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{fontSize:18}}>📖</span><h2 style={{fontSize:16,fontWeight:700}}>수업 교재 안내</h2></div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#f9f9f9",borderRadius:8}}>
                <div style={{width:36,height:44,background:"#ddd",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📚</div>
                <div><p style={{fontSize:14,fontWeight:600}}>{form.book}</p>{form.publisher&&<p style={{fontSize:12,color:"#888"}}>{form.publisher}</p>}</div>
              </div>
            </div>}
            <div style={{border:"1.5px solid #4A90D9",borderRadius:10,padding:"20px 24px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>🛡</span><h2 style={{fontSize:16,fontWeight:700}}>학생 로그인 정보</h2></div>
                <span style={{fontSize:13,fontWeight:700,color:"#D32F2F"}}>로그인 시 [회원]을 선택하여 입장해 주세요</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
                <div style={{padding:"12px 16px",background:"#f9f9f9",borderRadius:8,textAlign:"center"}}><p style={{fontSize:11,color:"#888",marginBottom:6}}>홈페이지 (상상코칭)</p><p style={{fontSize:13,fontWeight:600}}>www.sscoaching.co.kr</p></div>
                <div style={{padding:"12px 16px",background:"#f9f9f9",borderRadius:8,textAlign:"center"}}><p style={{fontSize:11,color:"#888",marginBottom:6}}>학생 아이디</p><p style={{fontSize:13,fontWeight:600}}>{form.studentId||"(미입력)"}</p></div>
                <div style={{padding:"12px 16px",background:"#f9f9f9",borderRadius:8,textAlign:"center"}}><p style={{fontSize:11,color:"#888",marginBottom:6}}>학생 비밀번호</p><p style={{fontSize:13,fontWeight:600}}>{form.studentPw||"(미입력)"}</p></div>
              </div>
            </div>
          </div>
          {/* 2페이지 */}
          <div ref={p2} style={{background:"#fff",padding:"40px 36px",fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif",maxWidth:700,margin:"24px auto 0",border:"1px solid #ddd",borderRadius:8}}>
            <div style={{width:"100%",height:8,background:"linear-gradient(90deg,#1565C0,#42A5F5)",borderRadius:"4px 4px 0 0",marginBottom:32}}/>
            <div style={{textAlign:"center",marginBottom:32}}><h1 style={{fontSize:26,fontWeight:700,marginBottom:6}}>학부모님께 드리는 말씀</h1><p style={{fontSize:13,color:"#888"}}>원활한 수업을 위해 꼭 확인 부탁드립니다.</p></div>
            {messages.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:16,marginBottom:20,paddingBottom:20,borderBottom:"1px solid #f0f0f0"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"#1565C0",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0,marginTop:2}}>{i+1}</div>
                <div><p style={{fontSize:14,fontWeight:700,marginBottom:6}}>{item.title}</p><p style={{fontSize:12,color:"#555",lineHeight:1.7}}>{item.desc}</p></div>
              </div>
            ))}
            <div style={{textAlign:"center",padding:"20px 0",borderTop:"2px solid #1565C0",borderBottom:"2px solid #1565C0",margin:"24px 0"}}>
              <p style={{fontSize:14,fontWeight:700,color:"#1565C0"}}>오늘 무료 수업을 통해 아이의 잠재력을 확인할 수 있었습니다. 꾸준히 성장할 수 있도록 꼼꼼하게 지도하겠습니다.</p>
            </div>
            <div style={{textAlign:"center",marginTop:20}}>
              <p style={{fontSize:12,color:"#888",marginBottom:16}}>✦ 수업 문의 및 상담 신청</p>
              <div style={{display:"flex",justifyContent:"center",gap:40}}>
                <div style={{textAlign:"center"}}><p style={{fontSize:11,color:"#888",marginBottom:8}}>👤 수업 선생님</p><div style={{padding:"10px 24px",border:"2px solid #1565C0",borderRadius:24,fontSize:15,fontWeight:700,color:"#1565C0"}}>{form.teacherPhone}</div></div>
                <div style={{textAlign:"center"}}><p style={{fontSize:11,color:"#888",marginBottom:8}}>📞 담당 매니저</p><div style={{padding:"10px 24px",border:"2px solid #1565C0",borderRadius:24,fontSize:15,fontWeight:700,color:"#1565C0"}}>{form.managerPhone}</div></div>
              </div>
            </div>
          </div>
          {/* 3페이지 */}
          <div ref={p3} style={{background:"#fff",padding:"40px 36px",fontFamily:"'Malgun Gothic','Apple SD Gothic Neo',sans-serif",maxWidth:700,margin:"24px auto 0",border:"1px solid #ddd",borderRadius:8}}>
            <div style={{width:"100%",height:8,background:"linear-gradient(90deg,#1565C0,#42A5F5)",borderRadius:"4px 4px 0 0",marginBottom:32}}/>
            <div style={{textAlign:"center",marginBottom:28}}><h1 style={{fontSize:26,fontWeight:700}}>결제 수단 및 방식 안내</h1></div>
            <div style={{marginBottom:28}}>
              <p style={{fontSize:14,fontWeight:700,marginBottom:10}}>● <span style={{color:"#1565C0"}}>정기 결제 (카드)</span>: 매달 수업회차 완료 후, 결제 예정문자가 발송되고, 2일후 자동 결제가 진행됩니다.</p>
              <div style={{border:"1px solid #ddd",borderRadius:10,overflow:"hidden"}}>
                <div style={{background:"#f5f8ff",padding:"10px 16px",borderBottom:"1px solid #eee",fontSize:12,color:"#555"}}>마이페이지 → 결제 → 회비 정기결제</div>
                <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{background:"#1565C0",color:"#fff",padding:"6px 14px",borderRadius:6,fontSize:13,fontWeight:600,width:"fit-content"}}>③ 회비 정기결제</div>
                  <div style={{background:"#f9f9f9",padding:"10px",borderRadius:6,fontSize:11,color:"#777"}}>④ 정기결제 서비스 이용 동의 체크 후 → ⑤ 정기결제 신청 클릭</div>
                  <div style={{background:"#2E7D32",color:"#fff",padding:"8px 20px",borderRadius:6,fontSize:13,fontWeight:600,textAlign:"center",maxWidth:160}}>↺ 정기결제 신청</div>
                </div>
              </div>
            </div>
            <div>
              <p style={{fontSize:14,fontWeight:700,marginBottom:10}}>● <span style={{color:"#1565C0"}}>알림톡 결제</span>: 카카오톡 알림톡을 통해 발송된 결제 링크를 클릭하여 간편하게 결제할 수 있습니다.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={{border:"1px solid #ddd",borderRadius:10,overflow:"hidden"}}>
                  <div style={{background:"#FEE500",padding:"10px 14px",fontWeight:700,fontSize:13}}>알림톡 도착</div>
                  <div style={{padding:"14px",fontSize:12,lineHeight:1.8}}><p>고객님, 안녕하세요. 동화세상에듀코 수강료 결제 안내드립니다.</p><div style={{marginTop:12,padding:"8px",border:"2px solid #D32F2F",borderRadius:6,textAlign:"center",fontWeight:700,color:"#D32F2F"}}>① 수강료 결제</div></div>
                </div>
                <div style={{border:"1px solid #ddd",borderRadius:10,overflow:"hidden"}}>
                  <div style={{background:"#f5f5f5",padding:"10px 14px",fontWeight:700,fontSize:13}}>📋 모바일 청구서</div>
                  <div style={{padding:"14px",fontSize:12,lineHeight:1.8}}>
                    <p style={{borderBottom:"1px solid #eee",paddingBottom:8,marginBottom:8,fontWeight:600}}>결제 정보</p>
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
        </div>
      )}
    </div>
  );
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
  const [tab,setTab]=useState("calendar");
  const [resCat,setResCat]=useState("전체");
  const [showEv,setShowEv]=useState(false);
  const [showNt,setShowNt]=useState(false);
  const [newEv,setNewEv]=useState({title:"",date:"",desc:""});
  const [newNt,setNewNt]=useState({title:"",content:""});
  const [selDay,setSelDay]=useState(null);
  const [coaches,setCoaches]=useState(COACHES_DEFAULT);

  // Firebase에서 코치 목록 불러오기
  useEffect(()=>{
    (async()=>{
      const d=await fbGet("settings","coaches");
      setCoaches(d?.list?.length ? d.list : COACHES_DEFAULT);
    })();
  },[]);

  // 로그인 후 체크리스트 불러오기
  useEffect(()=>{
    if(!user)return;
    (async()=>{
      const d=await fbGet("checks",user);setChecks(d?d.data:{});
      const ev=await fbGetAll("events");setEvents(ev);
      const nt=await fbGetAll("notices");setNotices(nt.sort((a,b)=>b.createdAt-a.createdAt));
    })();
  },[user]);

  // ✅ 코치 추가 (Firebase 저장)
  async function addCoach(name){
    const next=[...coaches,name];
    setCoaches(next);
    await fbSet("settings","coaches",{list:next});
  }

  // ✅ 코치 삭제 (Firebase 저장)
  async function removeCoach(name){
    if(name===ADMIN){alert("관리자는 삭제할 수 없어요!");return;}
    if(!window.confirm(`'${name}' 코치를 삭제하시겠습니까?`))return;
    const next=coaches.filter(c=>c!==name);
    setCoaches(next);
    await fbSet("settings","coaches",{list:next});
  }

  function login(){
    const n=inp.trim();
    if(!n){setErr("이름을 입력해 주세요.");return;}
    if(!coaches.includes(n)){setErr("등록되지 않은 이름입니다.");return;}
    setUser(n);
  }

  async function toggleCheck(id){const next={...checks,[id]:!checks[id]};setChecks(next);await fbSet("checks",user,{data:next});}
  async function addEvent(){if(!newEv.title||!newEv.date)return;const id=await fbAdd("events",{...newEv,createdAt:Date.now()});if(id)setEvents(v=>[...v,{...newEv,id}]);setNewEv({title:"",date:"",desc:""});setShowEv(false);}
  async function delEvent(id){await fbDel("events",id);setEvents(v=>v.filter(e=>e.id!==id));setSelDay(null);}
  async function addNotice(){if(!newNt.title)return;const data={...newNt,createdAt:Date.now(),date:new Date().toLocaleDateString("ko-KR")};const id=await fbAdd("notices",data);if(id)setNotices(v=>[{...data,id},...v]);setNewNt({title:"",content:""});setShowNt(false);}
  async function delNotice(id){await fbDel("notices",id);setNotices(v=>v.filter(n=>n.id!==id));}

  const {first,total}=getMonthDays(y,m);
  const cells=Array.from({length:first+total},(_,i)=>i<first?null:i-first+1);
  function evForDay(d){if(!d)return[];const ds=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;return events.filter(e=>e.date===ds);}
  function isToday(d){return d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();}

  const isAdmin=user===ADMIN;
  const done=TASKS.filter(t=>checks[t.id]).length;
  const filtRes=resCat==="전체"?RESOURCES:RESOURCES.filter(r=>r.category===resCat);

  if(!user)return(
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0f2ff"}}>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e0e0e0",padding:"2.5rem 2rem",width:320,textAlign:"center",boxShadow:"0 4px 24px #5C6BC022"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"#E8EAF6",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:26}}>🌟</div>
          <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:600,color:"#333"}}>상상코칭 포털</h2>
          <p style={{color:"#888",fontSize:13,margin:"0 0 1.5rem"}}>신입코치 포털에 오신 것을 환영합니다</p>
          <input value={inp} onChange={e=>{setInp(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="이름을 입력하세요" style={{marginBottom:8}}/>
          {err&&<p style={{color:"#EF5350",fontSize:12,marginBottom:8}}>{err}</p>}
          <button onClick={login} style={{width:"100%",padding:10,borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",fontSize:15,fontWeight:600,cursor:"pointer"}}>로그인</button>
          <p style={{fontSize:11,color:"#aaa",marginTop:12}}>등록된 코치 이름으로 로그인하세요</p>
        </div>
      </div>
    </>
  );

  return(
    <>
      <style>{css}</style>
      <div className="portal">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
          <div>
            <h2 style={{fontSize:18,fontWeight:600,color:"#333"}}>상상코칭 포털</h2>
            <p style={{fontSize:13,color:"#888"}}>{isAdmin?"👑 김윤정 부서장 (관리자)":`👋 ${user} 코치님`}</p>
          </div>
          <button onClick={()=>{setUser(null);setChecks({});}} style={{fontSize:12,padding:"6px 12px",borderRadius:8,cursor:"pointer",background:"#f5f5f5",border:"1px solid #ddd",color:"#666"}}>로그아웃</button>
        </div>

        <div className="card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <h3 style={{fontSize:15,fontWeight:600,color:"#333"}}>신입코치 필수 과정</h3>
            <span style={{fontSize:12,background:done===TASKS.length?"#E8F5E9":"#f5f5f5",color:done===TASKS.length?"#2E7D32":"#888",padding:"3px 10px",borderRadius:20,fontWeight:600}}>{done} / {TASKS.length} 완료</span>
          </div>
          {TASKS.map(t=>(
            <div key={t.id} className="check-item" style={{background:checks[t.id]?"#F1F8E9":"#f9f9f9"}}>
              <div onClick={()=>toggleCheck(t.id)} style={{width:20,height:20,borderRadius:4,border:`2px solid ${checks[t.id]?"#66BB6A":"#ccc"}`,background:checks[t.id]?"#66BB6A":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                {checks[t.id]&&<span style={{color:"#fff",fontSize:12}}>✓</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <span style={{fontSize:13,fontWeight:500,color:checks[t.id]?"#aaa":"#333",textDecoration:checks[t.id]?"line-through":"none"}}>{t.title}</span>
                {t.sub&&<span style={{fontSize:11,color:"#aaa",marginLeft:6}}>{t.sub}</span>}
              </div>
              {t.url&&<a href={t.url} target="_blank" rel="noreferrer" style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:t.color+"18",color:t.color,border:`1px solid ${t.color}33`,textDecoration:"none",flexShrink:0}}>바로가기</a>}
            </div>
          ))}
        </div>

        <div className="tabs">
          {[["calendar","📅"],["resource","📂"],["settle","💰"],["notice","📌"],["notice_gen","📄"],["free_lesson","🆓"],["exam_analysis","📊"],...(isAdmin?[["progress","👥"]]:[])]
            .map(([k,l])=><button key={k} className={`tab-btn${tab===k?" active":""}`} onClick={()=>setTab(k)} title={k}>{l}</button>)}
        </div>

        {tab==="calendar"&&(
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <button onClick={()=>{if(m===0){setM(11);setY(v=>v-1);}else setM(v=>v-1);}} style={{border:"none",background:"none",fontSize:22,cursor:"pointer"}}>‹</button>
              <span style={{fontSize:15,fontWeight:600}}>{y}년 {m+1}월</span>
              <button onClick={()=>{if(m===11){setM(0);setY(v=>v+1);}else setM(v=>v+1);}} style={{border:"none",background:"none",fontSize:22,cursor:"pointer"}}>›</button>
            </div>
            {isAdmin&&<div style={{textAlign:"right",marginBottom:8}}><button onClick={()=>setShowEv(true)} style={{fontSize:12,padding:"5px 12px",borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",cursor:"pointer"}}>+ 일정 추가</button></div>}
            <div className="cal-grid" style={{marginBottom:4}}>
              {DAYS_KR.map((d,i)=><div key={d} style={{textAlign:"center",fontSize:11,color:i===0?"#EF5350":i===6?"#5C6BC0":"#888",padding:"4px 0",fontWeight:600}}>{d}</div>)}
            </div>
            <div className="cal-grid">
              {cells.map((d,i)=>{
                const evs=evForDay(d);const col=i%7;
                return<div key={i} className={`cal-cell${isToday(d)?" today":""}`} onClick={()=>d&&evs.length&&setSelDay({d,evs})} style={{cursor:evs.length?"pointer":"default"}}>
                  {d&&<><div style={{fontSize:12,color:col===0?"#EF5350":col===6?"#5C6BC0":"#333",marginBottom:2}}>{d}</div>
                  {evs.slice(0,2).map(ev=><div key={ev.id} style={{fontSize:9,background:"#5C6BC022",color:"#5C6BC0",borderRadius:3,padding:"1px 3px",marginBottom:1,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{ev.title}</div>)}
                  {evs.length>2&&<div style={{fontSize:9,color:"#aaa"}}>+{evs.length-2}</div>}</>}
                </div>;
              })}
            </div>
            {selDay&&<div style={{marginTop:12,padding:12,background:"#f9f9f9",borderRadius:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:600}}>{m+1}월 {selDay.d}일 일정</span>
                <button onClick={()=>setSelDay(null)} style={{border:"none",background:"none",cursor:"pointer",fontSize:18,color:"#aaa"}}>×</button>
              </div>
              {selDay.evs.map(ev=><div key={ev.id} style={{padding:"8px 10px",background:"#fff",borderRadius:6,border:"1px solid #eee",marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,fontWeight:500}}>{ev.title}</span>
                  {isAdmin&&<button onClick={()=>delEvent(ev.id)} style={{border:"none",background:"none",cursor:"pointer",color:"#EF5350",fontSize:11}}>삭제</button>}
                </div>
                {ev.desc&&<p style={{fontSize:12,color:"#888",marginTop:4}}>{ev.desc}</p>}
              </div>)}
            </div>}
          </div>
        )}

        {tab==="resource"&&(
          <div className="card">
            <h3 style={{fontSize:15,fontWeight:600,marginBottom:12}}>자료실</h3>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {RES_CATS.map(c=><button key={c} onClick={()=>setResCat(c)} style={{padding:"5px 12px",borderRadius:20,border:"1px solid #ddd",background:resCat===c?"#5C6BC0":"#f5f5f5",color:resCat===c?"#fff":"#666",cursor:"pointer",fontSize:12}}>{c}</button>)}
            </div>
            <div className="res-grid">
              {filtRes.map(r=>(
                <div key={r.id} style={{background:"#f9f9f9",borderRadius:10,border:"1px solid #eee",padding:"12px 14px",display:"flex",flexDirection:"column",gap:6}}>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:r.color+"18",color:r.color,fontWeight:600,alignSelf:"flex-start"}}>{r.category}</span>
                  <p style={{fontSize:13,fontWeight:600}}>{r.title}</p>
                  <p style={{fontSize:11,color:"#888",lineHeight:1.5,flex:1}}>{r.desc}</p>
                  {r.url&&<a href={r.url} target="_blank" rel="noreferrer" style={{fontSize:11,padding:"4px 10px",borderRadius:6,background:r.color+"15",color:r.color,border:`1px solid ${r.color}33`,textDecoration:"none",textAlign:"center"}}>사이트 열기</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="settle"&&(
          <div className="card">
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:14}}>
              <h3 style={{fontSize:15,fontWeight:600}}>코치 정착지원금 (개선안)</h3>
              <span style={{fontSize:11,color:"#aaa"}}>공고일 2026.02.26 · 적용 2026.03.09 이후</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table className="settle-table">
                <thead>
                  <tr><th rowSpan={2} style={{width:80}}>구분</th><th colSpan={2} style={{background:"#EDE7F6",color:"#512DA8"}}>화상 (방문無)</th><th colSpan={2} style={{background:"#E3F2FD",color:"#1565C0"}}>방문 + 화상</th><th rowSpan={2} style={{background:"#FFF3E0",color:"#E65100",minWidth:140}}>계약해지 시</th></tr>
                  <tr><th>지급조건</th><th>지원금</th><th>지급조건</th><th>지원금</th></tr>
                </thead>
                <tbody>
                  <tr><td rowSpan={6} style={{background:"#E8EAF6",color:"#3949AB",fontWeight:600}}>1개월차</td><td>—</td><td>0원</td><td>0T</td><td>+0원</td><td rowSpan={6} style={{fontSize:10,color:"#666"}}>300,000원 × 당월 계약이행 일수 ÷ 당월 전체 일수</td></tr>
                  <tr><td rowSpan={5} style={{background:"#F3E5F5",color:"#6A1B9A"}}>300,000원</td><td rowSpan={5} style={{fontSize:10,color:"#888"}}>× 계약이행 일수<br/>÷ 전체 일수</td><td>0T초과~10T미만</td><td style={{color:"#D32F2F",fontWeight:600}}>+100,000원</td></tr>
                  <tr><td>10T이상~20T미만</td><td style={{color:"#D32F2F",fontWeight:600}}>+200,000원</td></tr>
                  <tr><td>20T이상~30T미만</td><td style={{color:"#D32F2F",fontWeight:600}}>+300,000원</td></tr>
                  <tr><td>30T이상~40T미만</td><td style={{color:"#D32F2F",fontWeight:600}}>+400,000원</td></tr>
                  <tr><td>40T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>+500,000원</td></tr>
                  <tr><td rowSpan={4} style={{background:"#E8EAF6",color:"#3949AB",fontWeight:600}}>2개월차</td><td>0T</td><td>0원</td><td>0T</td><td>0원</td><td rowSpan={4} style={{fontSize:10,color:"#666"}}>500,000원 × 당월 계약이행 일수(9일~최종교육참석일) ÷ 당월 전체 일수</td></tr>
                  <tr><td>0T초과~10T미만</td><td>200,000원</td><td>0T초과~10T미만</td><td>200,000원</td></tr>
                  <tr><td>10T이상~20T미만</td><td>350,000원</td><td>10T이상~20T미만</td><td>400,000원</td></tr>
                  <tr><td>20T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>500,000원</td><td>20T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>600,000원</td></tr>
                  <tr><td rowSpan={4} style={{background:"#E8EAF6",color:"#3949AB",fontWeight:600}}>3개월차</td><td>0T</td><td>0원</td><td>0T</td><td>0원</td><td rowSpan={4} style={{fontSize:10,color:"#666"}}>500,000원 × 당월 계약이행 일수(9일~최종교육참석일) ÷ 당월 전체 일수</td></tr>
                  <tr><td>0T초과~10T미만</td><td>200,000원</td><td>0T초과~10T미만</td><td>200,000원</td></tr>
                  <tr><td>10T이상~20T미만</td><td>350,000원</td><td>10T이상~20T미만</td><td>400,000원</td></tr>
                  <tr><td>20T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>500,000원</td><td>20T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>600,000원</td></tr>
                  <tr style={{background:"#FFF8E1"}}><td style={{background:"#FFE082",color:"#E65100",fontWeight:600}}>4개월차 ★</td><td>35T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>200,000원</td><td>35T이상~</td><td style={{color:"#D32F2F",fontWeight:600}}>200,000원</td><td style={{fontSize:10,color:"#666"}}>200,000원 × 당월 계약이행 일수 ÷ 당월 전체 일수</td></tr>
                  <tr style={{background:"#E8F5E9"}}><td colSpan={3} style={{fontWeight:600,color:"#2E7D32",textAlign:"right"}}>최대 (화상): 1,500,000원</td><td colSpan={3} style={{fontWeight:600,color:"#1565C0"}}>최대 (방문+화상): 2,200,000원</td></tr>
                </tbody>
              </table>
            </div>
            <div style={{marginTop:14,padding:"10px 14px",background:"#FFF8E1",borderRadius:8,border:"1px solid #FFD54F"}}>
              <p style={{fontSize:12,fontWeight:600,color:"#E65100",marginBottom:4}}>수수료 상세 스프레드시트</p>
              <a href="https://docs.google.com/spreadsheets/d/18u7vZ-N8HT7cJ1qRD7b-R9VGg4MGo23x/edit" target="_blank" rel="noreferrer" style={{fontSize:12,color:"#1565C0"}}>Google Sheets 바로가기 →</a>
            </div>
          </div>
        )}

        {tab==="notice"&&(
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <h3 style={{fontSize:15,fontWeight:600}}>공지사항</h3>
              {isAdmin&&<button onClick={()=>setShowNt(true)} style={{fontSize:12,padding:"5px 12px",borderRadius:8,background:"#5C6BC0",color:"#fff",border:"none",cursor:"pointer"}}>+ 공지 등록</button>}
            </div>
            {notices.length===0&&<p style={{color:"#aaa",fontSize:13,textAlign:"center",padding:"2rem 0"}}>등록된 공지가 없습니다.</p>}
            {notices.map(n=><div key={n.id} style={{padding:"10px 12px",background:"#f9f9f9",borderRadius:8,border:"1px solid #eee",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div><span style={{fontSize:14,fontWeight:600}}>{n.title}</span><span style={{fontSize:11,color:"#aaa",marginLeft:8}}>{n.date}</span></div>
                {isAdmin&&<button onClick={()=>delNotice(n.id)} style={{border:"none",background:"none",cursor:"pointer",color:"#EF5350",fontSize:11}}>삭제</button>}
              </div>
              {n.content&&<p style={{fontSize:13,color:"#666",marginTop:6,whiteSpace:"pre-wrap"}}>{n.content}</p>}
            </div>)}
          </div>
        )}

        {tab==="notice_gen"&&<NoticeGen/>}
        {tab==="free_lesson"&&<FreeLessonNotice/>}
        {tab==="exam_analysis"&&<ExamAnalysis/>}
        {tab==="progress"&&isAdmin&&(
          <ProgressTab
            coaches={coaches}
            addCoach={addCoach}
            removeCoach={removeCoach}
          />
        )}

        {showEv&&<Modal title="일정 추가" onClose={()=>setShowEv(false)}>
          <input value={newEv.title} onChange={e=>setNewEv(v=>({...v,title:e.target.value}))} placeholder="일정 제목"/>
          <input type="date" value={newEv.date} onChange={e=>setNewEv(v=>({...v,date:e.target.value}))}/>
          <textarea value={newEv.desc} onChange={e=>setNewEv(v=>({...v,desc:e.target.value}))} placeholder="메모 (선택)" rows={2} style={{resize:"none"}}/>
          <div style={{display:"flex",gap:8}}><button onClick={()=>setShowEv(false)} style={cBt}>취소</button><button onClick={addEvent} style={sBt}>저장</button></div>
        </Modal>}
        {showNt&&<Modal title="공지 등록" onClose={()=>setShowNt(false)}>
          <input value={newNt.title} onChange={e=>setNewNt(v=>({...v,title:e.target.value}))} placeholder="공지 제목"/>
          <textarea value={newNt.content} onChange={e=>setNewNt(v=>({...v,content:e.target.value}))} placeholder="내용 (선택)" rows={3} style={{resize:"none"}}/>
          <div style={{display:"flex",gap:8}}><button onClick={()=>setShowNt(false)} style={cBt}>취소</button><button onClick={addNotice} style={sBt}>등록</button></div>
        </Modal>}
      </div>
    </>
  );
}
