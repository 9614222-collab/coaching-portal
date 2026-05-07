function ProgressTab({coaches,addCoach,removeCoach}){
  const coachList=coaches.filter(c=>c!==ADMIN);
  const [allChecks,setAllChecks]=useState({});
  const [newName,setNewName]=useState("");
  const [adding,setAdding]=useState(false);

  useEffect(()=>{
    (async()=>{
      const result={};
      for(const coach of coachList){
        const d=await fbGet("checks",coach);
        result[coach]=d?d.data:{};
      }
      setAllChecks(result);
    })();
  },[JSON.stringify(coachList)]);

  async function handleAdd(){
    const n=newName.trim();
    if(!n){alert("이름을 입력해 주세요.");return;}
    if(coaches.includes(n)){alert("이미 등록된 이름이에요!");return;}
    setAdding(true);
    await addCoach(n);
    setNewName("");
    setAdding(false);
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
          placeholder="새 코치 이름 입력 후 추가 버튼 클릭"
          style={{flex:1,padding:"8px 10px",borderRadius:8,border:"1px solid #ddd",fontSize:13,marginBottom:0}}
        />
        <button
          onClick={handleAdd}
          disabled={adding}
          style={{padding:"8px 16px",borderRadius:8,background:adding?"#aaa":"#5C6BC0",color:"#fff",border:"none",cursor:"pointer",fontWeight:600,fontSize:13,flexShrink:0}}
        >
          {adding?"추가 중...":"+ 추가"}
        </button>
      </div>

      {/* 코치 목록 */}
      {coachList.length===0&&<p style={{color:"#aaa",fontSize:13,textAlign:"center",padding:"2rem 0"}}>등록된 코치가 없습니다.</p>}
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
