
var markers = [];//will contain the markers for stops
var infoWindows = [];//will contain infowindow objects for markers;
var animation_time = 4500 //in milliseconds
//Used for animation
var map;//Map Object
var directionsService;

var details = {
  number:document.getElementById("number"),
  type:document.getElementById("type"),
  cargo:document.getElementById("cargo"),
  load:document.getElementById("load"),
 destination:document.getElementById("destination"),
  eta:document.getElementById("eta"),
  time:document.getElementById("time"),
};

var vehicle = {
  number:"MH 04 GH ABCD",
  type: "Flat Bed",
  cargo: "Steel",
  load: "20 Metric Tonnes",
  destination:"Vidyavihar",
  time:"1 hour",
  eta: "8th May, 3:00 P.M ",
  coords:[{
    latitude:19.075267,
    longitude:72.905104,
    timestamp:"1:00 PM"
  },{
    latitude:19.068223,
    longitude:72.899730,
    timestamp:"1:20 PM"
  },
    {
    latitude:19.065803,
    longitude:72.889966,
    timestamp:"1:40 PM"
  },{
    latitude:19.069554, 
    longitude:72.891981, 
    timestamp:"2:00 PM"
  }]
};



function initMap() {
  //Set up directions service
  directionsService = new google.maps.DirectionsService();
  
  //Map zooming and centering
  var mapOptions = {
    zoom: 15,
    center:  new google.maps.LatLng(19.068344, 72.897535) };

  //Bind map to the HTML div element
   map = new google.maps.Map(document.getElementById("map"), mapOptions);
  
  //Polyline settings
  polyline = new google.maps.Polyline({
    geodesic: true,
    strokeColor: '#554496',
    strokeOpacity: 1.0,
    strokeWeight: 5
  });
  
  //Bind polyline to map
  polyline.setMap(map);
  
  //Initiate request for path
  getPath(vehicle.coords);
  
};
function getPath(coords){
  //Create request object to send to directions service
  var req = {
    origin: new google.maps.LatLng(coords[0].latitude,coords[0].longitude),
    destination:  new google.maps.LatLng(coords[coords.length - 1].latitude,coords[coords.length - 1].longitude),
    travelMode:google.maps.TravelMode.DRIVING,
 
  };
  req.waypoints = [];
  for(var i = 1;i< coords.length - 1;i++){
    req.waypoints[i-1] = {
      location:new google.maps.LatLng(coords[i].latitude,coords[i].longitude),
      stopover:false
    }
  }
  
  //send the request to directions service
  directionsService.route(req, function(result, status) {
    //Plot the lines   
    plotPath(result.routes);
  });
};

function plotPath(routes){
  var polylineIndex = 0;
  var path;
  //path has coordinates for all lines
  path = routes[0].overview_path;
  //set timer to add a new coordinate to polylines path,hence display a new line
 
    var drawTimer =  window.setInterval(function(){
    //add coordinates to polyline till we have added all coordinates
    if(polylineIndex < path.length){
      polyline.getPath().push(path[polylineIndex]);
    polylineIndex++;
      
    }
    else{
      addMarkers(vehicle.coords);
      window.clearInterval(drawTimer);
    }
  },animation_time/path.length);
  
};

function addMarkers(coords){
    var i = 0;//iterator
    
   //Every 200ms add a new marker and bind an infoWindow with it
    var timer = window.setInterval(function() {
        if (i < coords.length) {
           var contentString = "<div>Reached at "+ coords[i].timestamp +" </div>";
            var marker = new google.maps.Marker({
              
                animation: google.maps.Animation.DROP,
                position: {lat:coords[i].latitude,lng:coords[i].longitude},
            });
            
          var infoWindow = new google.maps.InfoWindow({
    content: contentString
  });
    
    //When marker is clicked display infoWindow
    marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });
          markers.push(marker);
          infoWindows.push(infoWindow);
            marker.setMap(map);
            i++;
        } else {
            window.clearInterval(timer);
        }
    }, 200);
};
  
function setDetails(details,vehicle){
  for(var key in details){
  details[key].innerHTML = vehicle[key];}
};

$(document).ready(function(){
  setDetails(details,vehicle);
});