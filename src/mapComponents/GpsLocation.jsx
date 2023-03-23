
function GPSLocation({shoWLocationOnMap,setGpsLocation}){
       
   
    function setGpsLocations(e){
        setGpsLocation({lat:e.coords.latitude,lng:e.coords.longitude})
        shoWLocationOnMap({lat:e.coords.latitude,lng:e.coords.longitude})
    }
    
    return (
        <div onClick={()=>navigator.geolocation.getCurrentPosition(setGpsLocations)} id="gpsIcons">
            <p><img src="https://img.lovepik.com/free-png/20210926/lovepik-map-location-icon-free-vector-illustration-png-image_401494181_wh1200.png" style={{width:"30px",height:"30px"}}/> Find your location</p>
        </div>
    )
}

export default GPSLocation