
function GPSLocation({shoWLocationOnMap,setGpsLocation}){
       
   
    function setGpsLocations(e){
        setGpsLocation({lat:e.coords.latitude,lng:e.coords.longitude})
        shoWLocationOnMap({lat:e.coords.latitude,lng:e.coords.longitude})
    }
    
    return (
        <div onClick={()=>navigator.geolocation.getCurrentPosition(setGpsLocations)} id="mapIcons">
            <h3 >Lokacija</h3>
        </div>
    )
}

export default GPSLocation