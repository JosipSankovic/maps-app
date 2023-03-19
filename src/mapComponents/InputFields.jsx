import { useState,useEffect, useRef } from "react"
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';
import "./InputFields.css"

function InputFields({setPointsNameAndLatLng,getRoute,pointsName,showLocation}){
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
    function searchQuery(){
      
        const options={
            method:"GET",
            url:'https://nominatim.openstreetmap.org/search?',
            params:{q:search,limit:4,addressdetails:1,extratags:1,namedetails:1,format:"json"},
            headers:{Authorization:search}
        }
        
       axios.request(options).then((response)=>{
            

             setSearchResults(response.data)
            
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
    return(
            
        <div className="inputFields">
            <label>Search</label>
            <input value={search}  onChange={(e)=>{setSearch(e.target.value)}}/>
            
            {(searchResults!=undefined&&search!="" )&&<DisplaySearchResults/>}
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