


function InputFields({setSelectedPoint,getRoute,setSearch,search}){
    
    return(
            
        <div className="inputFields">
            <label>Search</label>
            <input value={search}  onChange={(e)=>setSearch(e.target.value)}/>
            <br/>
            <label>StartPoint</label>
            <button onClick={(e)=>setSelectedPoint(e.target.id)} id="startPoint">Select</button>
            <br/>
            
            <button onClick={()=>setStat(stat+1)}>press</button>
            <label>EndPoint</label>
            <button onClick={(e)=>setSelectedPoint(e.target.id)} id="endPoint">Select</button>
            <br/>
            <button onClick={()=>getRoute()} >Find path</button>
            
        </div>

    )
}

export default InputFields