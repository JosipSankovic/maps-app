import { useState,useEffect, useRef } from "react"
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';
import "./InputFields.css"

function InputFields({setPointsNameAndLatLng,getRoute,pointsName,showLocation,setCursor}){
    const [search,setSearch]=useState("")
    const [searchResults,setSearchResults]=useState([])
    
   
    function setLonLng(lat,lng){
        return{lat:lat,lng:lng}
    }
    function processLocationName(data){
      
        
       
        let dataName=data.split(",")
        let dataLenght=dataName.length
        let Name=""
        for(let i=0;i<dataLenght/3;i++){
            Name=Name+dataName[i]
        }
        
         return Name
      }
    async function searchQuery(){
      
        const options={
            method:"GET",
            url:'https://nominatim.openstreetmap.org/search?',
            params:{q:search,limit:4,addressdetails:1,extratags:1,namedetails:1,format:"json"},
            headers:{Authorization:search}
        }
        
       return await axios.request(options).then((response)=>{
             setSearchResults(response.data)
             return response
            
        }).catch((e)=>console.log(e))

        
    }

    
    useEffect(()=>{
        if(search==""){setSearchResults([])
            return}
        
       const delayFn=setTimeout(searchQuery,800);
      
       return ()=>clearTimeout(delayFn)
       
    },[search])

    function DisplaySearchResults(){

        return(
            <div className="divResults">
                
                {searchResults.map((element) => {
                     
                    return(
                       
                        <div key={uuidv4()} onClick={()=>showLocation(setLonLng(element.lat,element.lon),18)} className="seachElement">
                            <p >{processLocationName( element.display_name)}</p>
                        </div>
                    )
                })
                }
            </div>
        )
    }
    function searchFirst(e){
        if(e.key=="Enter"){
        searchQuery().then((response)=>{
            showLocation(setLonLng(response.data[0].lat,response.data[0].lon))
        })
    }
    }
    return(
            
        <div className="inputFields">
            <label>Search</label>
            <input  value={search} onChange={(e)=>{setSearch(e.target.value)}} onKeyDown={(e)=>{searchFirst(e)}} />
            
            {(searchResults!=undefined&&search!="" )&&<DisplaySearchResults/>}
            <br/>
            <label>StartPoint</label>
            <button onClick={(e)=>{setPointsNameAndLatLng(e.target.id);setCursor("default")}} id="startPoint">Select</button>
            <p>{pointsName.startPointsName}</p>
            <br/>
            <label>EndPoint</label>
            <button onClick={(e)=>{setPointsNameAndLatLng(e.target.id);setCursor("default")}} id="endPoint">Select</button>
            <p>{pointsName.endPointsName}</p>
            <br/>
            <button onClick={()=>getRoute()} >Find path</button>
            
        </div>

    )
}

export default InputFields