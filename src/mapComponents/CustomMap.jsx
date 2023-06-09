import { useEffect, useRef, useState } from "react";
import {Pane,MapContainer, TileLayer, useMap, useMapEvents, Marker, LayerGroup, LayersControl, Popup, Polyline} from "react-leaflet"
import L, { Layer, point } from "leaflet"
import {easyButton} from "source-map-js/lib/source-map-consumer"
import "./CustomMap.css"
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import InputFields from "./InputFields";
import GPSLocation from "./GpsLocation";
import { typeOfIcon}  from "./IconComponent";
import IconComponent from "./IconComponent";
function CustomMap(){
    const [gpsLocation,setGpsLocation]=useState();
    const [clickedLatLng,setClickedLatLng]=useState();
    const [clickedPlace,setClickedPlace]=useState()
    const [placeName,setPlaceName]=useState();
    const [map, setMap]=useState();
    const [polygons,setPolygons]=useState();
    const [points,setPoints]=useState({startPoint:undefined,endPoint:undefined})
    const [pointsName,setPointsName]=useState({startPointName:undefined,endPointName:undefined})
    const [selectedPoint,setSelectedPoint]=useState();
    const [selectingStartAndEndPoints,setSelectingStartAndEndPoints]=useState(false)
    const[collapsed,setCollapsed]=useState(true)
    const collapseAndExpandDiv=useRef()
    const [directions,setDirections]=useState();
    const [cursor,setCursor]=useState("grab")    

    useEffect(()=>{
       document.getElementById("map").style.cursor=cursor
       console.log(cursor)
    },[cursor])
    function setPointsNameAndLatLng(setPointLatLng){
        setSelectedPoint(setPointLatLng)
        setSelectingStartAndEndPoints(true)
    }
   async function getRoute(){
        const query = new URLSearchParams({
            key: '7cc88f38-2516-48b2-bce2-77eee7f1c892'
          }).toString();
          
          const resp = await fetch(
            `https://graphhopper.com/api/1/route?${query}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                points: [
                  [points.startPoint.lng,points.startPoint.lat],
                  [points.endPoint.lng, points.endPoint.lat]
                ],
                
                snap_preventions: [
                  'motorway',
                  'tunnel',
                  'ferry'
                  
                ],
                details: ['road_class', 'surface'],
                vehicle: 'car',
                locale: 'hr',
                instructions: true,
                calc_points: true,
                elevation:false,
                points_encoded: false
              })
            }
          );
        
          await resp.json().then((data)=>{
            data.paths[0].points.coordinates.forEach(x => x.reverse());
            setPolygons(data.paths[0].points.coordinates)
            setDirections(data.paths[0].instructions.map((x)=>x.text))
          }).catch((error)=>{
            console.log(error)
          })

    }

    function showGpsLocationOnMap(latlng,zoom=18){
       
        map.target.setView(latlng,zoom)
        setClickedLatLng(latlng)
        getLocationNameFromCoordinates(latlng).then((response)=>{
            setPlaceName(response)
        }).catch((e)=>console.log(e))
        

    }

    

    function GetWhereIsClickedLatLng(){
      
        const map=useMapEvents({
            click:(event)=>{
                if(selectingStartAndEndPoints==false){
                setClickedLatLng(event.latlng)
                getLocationNameFromCoordinates(event.latlng).then((response)=>{
                    setPlaceName(response)
                }).catch((e)=>console.log(e))  
                }else if(selectingStartAndEndPoints==true){
                    if(selectedPoint=="startPoint"){
                        setPoints({...points,startPoint:event.latlng})
                    }else if(selectedPoint=="endPoint"){
                        setPoints({...points,endPoint:event.latlng})
                    }
                    setCursor("grab")
                    setSelectingStartAndEndPoints(false)
                    setPolygons([])
                    getLocationNameFromCoordinates(event.latlng).then((response)=>{
                        setPlaceName(response)
                        if(selectedPoint=="startPoint"){
                            setPointsName({...pointsName,startPointsName:response})
                        }else if(selectedPoint=="endPoint"){
                            setPointsName({...pointsName,endPointsName:response})
    
                        }
                    }).catch((e)=>console.log(e))     
                }
               
                
                
                
                
                
            }
        })
        
        return null
    }

    function DirectionsComponents(){


        return(
            <div className="directions">
                {directions.map((x)=>
                    <div key={uuidv4()} className="direction-part">
                        <p>{x}</p>
                        </div>
                )}
            </div>
        )
    }
   
    function processLocationName(data){
      
        setClickedPlace({name:(data.name!=undefined?data.name:""),  housenumber:data.housenumber!=undefined?data.housenumber:"",street:data.street!=undefined?data.street:"",
          district:data.district,postcode:data.postcode,city:data.city,county:data.county,country:data.country})
         
          if(data.name==undefined&&data.housenumber!=undefined){
              return(`${data.housenumber} ${data.street}`)
          }
          else if(data.name!=undefined){
              return(`${data.name}`)
          }
          else if(data.district!=undefined&& data.city!=undefined){
              return(`${data.district}, ${data.city}`)
          }
          else if(data.county!=undefined){
              return(data.county)
          }
          
         
      }
    async function getLocationNameFromCoordinates(coordinates){
        
        const options={
            method:"GET",
            url:'https://nominatim.openstreetmap.org/reverse',
            params:{lat:coordinates.lat,lon:coordinates.lng,addressdetails:1,format:"geocodejson"}
        }

       return await axios.request(options).then((response)=>processLocationName(response.data.features[0].properties.geocoding)).catch((e)=>console.log(e))
        
        
    }


    return (
        <div className="mapHolder">
             
            <MapContainer  id="map"  center={[43.5095122,16.4759378]} zoom={13} schrollWheelZoom={false} whenReady={setMap}>
          <TileLayer attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"/>
            
            
            
           
            
            <GetWhereIsClickedLatLng />
            
            
            {gpsLocation!=undefined&&<IconComponent type={typeOfIcon.redIcon} paneName="gpsLocation" position={gpsLocation} title="your location"/>}
            {points.startPoint!=undefined&&<IconComponent type={typeOfIcon.greenIcon} paneName="startPoint" position={points.startPoint}  title="selected start location"/>}
            {points.endPoint!=undefined&&<IconComponent type={typeOfIcon.blueIcon} paneName="endPoint" position={points.endPoint}  title="selected end location"/>}
            {clickedLatLng!=undefined&&<IconComponent type={typeOfIcon.yellowIcon} paneName="selectedLocation" position={clickedLatLng}  title="selected location"/>}
                
            {polygons!=undefined&&<Polyline pathOptions={{color:'red'}} positions={polygons} />}
            
            
            </MapContainer>
            
            <div className="restOfTheApp">
            <img onClick={()=>setCollapsed(prevCollapse=>!prevCollapse)} src="https://toppng.com/uploads/preview/menu-icon-png-3-lines-11552739283bazga05wbc.png" style={{width:"30px",height:"30px",textAlign:"start"}}/>
            <div  className="collapseAndExpand">
            <GPSLocation setGpsLocation={setGpsLocation} shoWLocationOnMap={showGpsLocationOnMap} />
            <h3>{placeName}</h3>
            <InputFields collapseDiv={collapsed} setCursor={setCursor} showLocation={showGpsLocationOnMap} getRoute={getRoute} setPointsNameAndLatLng={setPointsNameAndLatLng} pointsName={pointsName}  />
            
            {directions!=undefined&&<DirectionsComponents />}
            </div>
            </div>

        </div>
    )
}

export default CustomMap