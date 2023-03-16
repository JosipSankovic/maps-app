import { useEffect, useState } from "react";
import {Pane,MapContainer, TileLayer, useMap, useMapEvents, Marker, LayerGroup, LayersControl, Popup, Polyline} from "react-leaflet"
import L, { Layer, point } from "leaflet"
import {easyButton} from "source-map-js/lib/source-map-consumer"
import "./CustomMap.css"
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
function CustomMap(){
    const [gpsLocation,setGpsLocation]=useState();
    const [clickedLatLng,setClickedLatLng]=useState();
    const [clickedPlace,setClickedPlace]=useState()
    const [placeName,setPlaceName]=useState();
    const [map, setMap]=useState();
    const [polygons,setPolygons]=useState();
    const [points,setPoints]=useState({startPoint:undefined,endPoint:undefined})
    const [selectedPoint,setSelectedPoint]=useState();
    const [directions,setDirections]=useState()




    function getLocationNameFromCoordinates(coordinates){
        const options={
            method:"GET",
            url:'https://nominatim.openstreetmap.org/reverse',
            params:{lat:coordinates.lat,lon:coordinates.lng,addressdetails:1,format:"geocodejson"}
        }
        axios.request(options).then((response)=>{
             processLocationName(response.data.features[0].properties.geocoding)
             
        })
    }
    


    function processLocationName(data){
      
      setClickedPlace({name:(data.name!=undefined?data.name:""),  housenumber:data.housenumber!=undefined?data.housenumber:"",street:data.street!=undefined?data.street:"",
        district:data.district,postcode:data.postcode,city:data.city,county:data.county,country:data.country})
        
        if(data.name==undefined&&data.housenumber!=undefined){
            setPlaceName(`${data.housenumber} ${data.street}`)
        }else if(data.name!=undefined){
            setPlaceName(`${data.name}`)
        }else if(data.district!=undefined&& data.city!=undefined){
            setPlaceName(`${data.district}, ${data.city}`)
        }else{
            setPlaceName(county)
        }
        
        
    }

    
   async function getRoute({startPoint,endPoint}){
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
                  [startPoint.lng, startPoint.lat],
                  [endPoint.lng, endPoint.lat]
                ],
                
                snap_preventions: [
                  'motorway',
                  'ferry',
                  'tunnel'
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
        
          let data=await resp.json();
          
          
          data.paths[0].points.coordinates.forEach(x => x.reverse());
          setPolygons(data.paths[0].points.coordinates)
          setDirections(data.paths[0].instructions.map((x)=>x.text))
           

    }
    function GetGPSLocation(){
       
        function shoWLocationOnMap(e){
            setGpsLocation({lat:e.coords.latitude,lng:e.coords.longitude})
            map.target.setView({lat:e.coords.latitude,lng:e.coords.longitude},18)
            getLocationNameFromCoordinates({lat:e.coords.latitude,lng:e.coords.longitude})

        }
        return (
            <div onClick={()=>navigator.geolocation.getCurrentPosition(shoWLocationOnMap)} id="mapIcons">
                <h3 >Lokacija</h3>
            </div>
        )
    }

    
    function SetMarkerOnPosition({position,paneName,title}){
        
        if(position!=undefined){
        return(
        <Pane  name={paneName} style={{ zIndex: 400 }}>
            <Marker  position={position}><Popup><p>{title}</p></Popup></Marker>    
        </Pane>
        )
        }else{
            return null
        }
    }

    function GetWhereIsClickedLatLng(){
        
        const map=useMapEvents({
            click:(event)=>{
                setClickedLatLng(event.latlng)
                getLocationNameFromCoordinates(event.latlng)             
                
                if(selectedPoint=="startPoint"){
                    setPoints({...points,startPoint:event.latlng})
                }else if(selectedPoint=="endPoint"){
                    setPoints({...points,endPoint:event.latlng})

                }
                
                
            }
        })
        
        return null
    }
    function InputFields(){


        return(
            <div className="inputFields">
                <label>StartPoint</label>
                <button onClick={(e)=>setSelectedPoint(e.target.id)} id="startPoint">Select</button>
                <br/>
                <label>EndPoint</label>
                <button onClick={(e)=>setSelectedPoint(e.target.id)} id="endPoint">Select</button>
                <br/>
                <button onClick={()=>getRoute(points)} >Find path</button>
            </div>

        )
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
    
    return (
        <div className="mapHolder">
            <MapContainer  id="map"  center={[43.5095122,16.4759378]} zoom={13} schrollWheelZoom={false} whenReady={setMap}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            
            
            
            
            
            <GetWhereIsClickedLatLng />
            
            
            <SetMarkerOnPosition paneName="gpsLocation" position={gpsLocation} title="your location" />
            {points.startPoint!=undefined&&<SetMarkerOnPosition paneName="startPoint" position={points.startPoint}  title="selected start location"/>}
           {points.endPoint!=undefined&&<SetMarkerOnPosition paneName="endPoint" position={points.endPoint}  title="selected end location"/>}
            {polygons!=undefined&&<Polyline pathOptions={{color:'red'}} positions={polygons} />}
            
            
            </MapContainer>
            <div className="restOfTheApp">
            <GetGPSLocation />
            <h1>{placeName}</h1>
            <InputFields />
            {directions!=undefined&&<DirectionsComponents />}
            </div>
        </div>
    )
}

export default CustomMap