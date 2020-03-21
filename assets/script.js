// first we need to get the user's location using their input
//then we need to get the time for that location and display it (using an API? or JS might
//have that feature built in, idk)
//then we need to pull up an image based on the location
//then we need to list times in major cities around the world
//we also need to render an interactive globe that shows you where you are on the globe (Google API?)

//variables for stuff...not sure if needed right now. put it up though.
//
// const localTimeEl
// const globeEL
// const worldTimeEl
// const locationImageEl
// const initLocationEl
// <script src="http://www.webglearth.com/v2/api.js"></script>
// //Making sure the JS loads after the page loads...don't know if this is needed
// $(window).load();
// //calling to the element in the HTML
// var x = document.getElementById("location-div");
// //getting the location from the browser
// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }
// //this is not needed but was included in the copy and paste from W3 schools. figured it
// //would be good to use to test how we get the data from the browser location
// //into the globe function
// function showPosition(position) {
//   x.innerHTML = "Latitude: " + position.coords.latitude +
//   "<br>Longitude: " + position.coords.longitude;
// }
// //initializing the function on page load
// getLocation();
// //this is the globe script. Copied and pasted from WEBGLEARTH. Not sure if any styling
// //is needed here since it's in the index.html
// function initializeGlobe() {
//     //not sure how to get the lat and long data from the first function into this function to init
//     //the globe
//     var options = {atmosphere: false, center: [position.coords.latitude, position.coords.longitude], zoom: 5 };
//     var earth = new WE.map('earth_div', options);
//     WE.tileLayer('http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
//       minZoom: 0,
//       maxZoom: 5,
//       attribution: 'NASA'
//     }).addTo(earth);
//   }
// //CAN IGNORE EVERYTHING COMMENTED OUT FOR NOW

// //

////////////////////////////////////////////////////////////


// //saving user input to localStorage
// $('#save').on('click', function(){

//     $('input[type="text"]').each(function(){
//         var id = $(this).attr('id');
//         var value = $(this).val();
//        localStorage.setItem(id, value);

//     });
// });
// //loading user input from localStorage
// $('#load').on('click', function(){
//     $('input[type="text"]').each(function(){
//         var id = $(this).attr('id');
//         var value = localStorage.getItem(id);

//         $(this).val(value);

//     });
// });


// //get user location from form....need the class name of input box

// function onClick(event) {
//     var locationEl = $('input#location-div').val();
//     //check to see how the location input is working
//     console.log(locationEl);
// }

function initialize() {
  var options = { atmosphere: false, center: [37.540726, -77.436050], zoom: 5 };
  var earth = new WE.map('earth_div', options);
    WE.tileLayer('http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxZoom: 5,
      attribution: 'NASA'
    }).addTo(earth);
}
initialize()

$("#input-button").on("click", function(){
var geoCodeAPIkey = "356c83d937c04b978709b023ccb3530f";
var timeZoneAPIkey = "3XNBGBH1XHV0";
var locationInput = $("#locationInput").val();
var geoCodequeryURL = `https://api.opencagedata.com/geocode/v1/json?q=${locationInput}&key=${geoCodeAPIkey}`;

$.ajax({
    url: geoCodequeryURL,
    method: "GET"
    }).then(function(response) {
      console.log(response)
      var currentLat = response.results[0].geometry.lat
      var currentLng =response.results[0].geometry.lng
      var cityName = response.results[0].components.city
      var country = response.results[0].components.country

      var timeZoneQueryURL = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneAPIkey}&format=json&by=position&lat=${currentLat}&lng=${currentLng}`;
      $.ajax({
            url: timeZoneQueryURL,
            method: "GET"
          }).then(function timeZoneSearch(timeResult){
            console.log(timeResult)
            var timeZone = timeResult.zoneName
            var currentTimeAtLocation = timeResult.formatted
  $("#location-div").html(`
  <h1>Current Time: ${currentTimeAtLocation}</h1>
  <h2>Country: ${country} </h2>
  <h2>Time Zone: ${timeZone} </h2>
  <p>GPS coordinates: ${currentLat}, ${currentLng} </p>
  `)
          })

  })
    })


