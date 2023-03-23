import {Pane,Marker,Popup} from "react-leaflet"
export const typeOfIcon={
    greenIcon:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    blueIcon:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    redIcon:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    yellowIcon:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png'
}
export default function IconComponent({position,paneName,title,type}){
    if(position!=undefined){
        return(
            
        <Pane  name={paneName} style={{ zIndex: 400 }}>
           
            <Marker icon={new L.Icon({
    iconUrl: type,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
    })}  position={position}><Popup><p>{title}</p></Popup></Marker>    
        </Pane>
        )
        }else{
            return null
        }
}

