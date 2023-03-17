


function InputFields({setPointsNameAndLatLng,getRoute,setSearch,search,pointsName}){
    
    return(
            
        <div className="inputFields">
            <label>Search</label>
            <input value={search}  onChange={(e)=>setSearch(e.target.value)}/>
            <br/>
            <label>StartPoint</label>
            <button onClick={(e)=>setPointsNameAndLatLng(e.target.id)} id="startPoint">Select</button>
            <p>{pointsName.startPointsName}</p>
            <br/>
            <label>EndPoint</label>
            <button onClick={(e)=>setPointsNameAndLatLng(e.target.id)} id="endPoint">Select</button>
            <p>{pointsName.endPointsName}</p>
            <br/>
            <button onClick={()=>getRoute()} >Find path</button>
            
        </div>

    )
}

export default InputFields