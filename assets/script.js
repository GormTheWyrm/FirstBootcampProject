// first we need to get the user's location using their browser input
//then the globe goes to that user's position based on latitude and longitude
//then we need to get the time for that location and display it
//then we need to pull up an image based on the location
//then we have a few cities listed on the bottom where if they click them the
//city pops up in a marker and the globe goes to it.

var cityInfoArray = [];

function getCityInfo() {
  var majorCities = [
    "London, United Kingdom",
    "Beijing, China",
    "Sydney, Australia",
    "Moscow, Russia",
    "Los Angeles, CA, United States of America",
    "richmond, VA"
  ];
  majorCities.forEach(function(city) {
    var geoCodeAPIkey = "700f8122007345be85cf878d02de94cd";
    var geoCodequeryURL = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geoCodeAPIkey}`;
    $.ajax({
      url: geoCodequeryURL,
      method: "GET"
    }).then(function(response) {
      var cityInfoObject = {
        cityName: response.results[0].components.city,
        cityCountry: response.results[0].components.country,
        cityLat: response.results[0].geometry.lat,
        cityLng: response.results[0].geometry.lng
      };
      cityArrayProxy.push(cityInfoObject);
    });
  });
}
getCityInfo();

var changeHandler = {
  set: function(target,property,value){
    console.log("array changed");
    console.log(cityInfoArray);
    if (cityInfoArray.length<6) {
      return (target[property]=value)
    }
    else{
      console.log("done")
      initialize()
      return (target[property] = value);
    }
  }}

var cityArrayProxy = new Proxy(cityInfoArray, changeHandler)

function initialize() {
  var options = { atmosphere: false, center: [37.540726, -77.43605], zoom: 5 };
  var earth = new WE.map("earth_div", options);
  WE.tileLayer("http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg", {
    minZoom: 0,
    maxZoom: 5,
    attribution: "NASA"
  }).addTo(earth);
  // var marker = WE.marker([
  //   cityInfoArray[0].cityLat,
  //   cityInfoArray[0].cityLng
  // ]).addTo(earth);
  // marker
  //   .bindPopup(
  //     "<b>Hello world!</b><br>I am a popup.<br /><span style='font-size:10px;color:#999'>Tip: Another popup is hidden in Cairo..</span>",
  //     { maxWidth: 150, closeButton: true }
  //   )
  //   .openPopup();

  for (var i = 0; i < cityInfoArray.length; i++) {
    (function() {
      var marker = WE.marker([
        cityInfoArray[i].cityLat,
        cityInfoArray[i].cityLng
        ]).addTo(earth);
      marker
        .bindPopup(
        "<b>Hello world!</b><br>I am a popup.<br /><span style='font-size:10px;color:#999'>Tip: Another popup is hidden in Cairo..</span>",
        { maxWidth: 150, closeButton: true }
        ).openPopup();
  })
}}


// function addMarkers() {
//   for (var i = 0; i < cityInfoArray.length; i++) {
//     (function(city) {
//       console.log(city[i]);
//       var markerLat = cityInfoArray[i].cityLat;
//       var markerLng = cityInfoArray[i].cityLng;
//       var marker = WE.marker([markerLat, markerLng]).addTo(map);
//       marker
//         .bindPopup(
//           "<b>Hello world!</b><br>I am a popup.<br /><span style='font-size:10px;color:#999'>Tip: Another popup is hidden in Cairo..</span>",
//           { maxWidth: 150, closeButton: true }
//         )
//         .openPopup();
//     });
//   }
// }


// initialize();

$("#input-button").on("click", function() {
  var geoCodeAPIkey = "356c83d937c04b978709b023ccb3530f";
  var timeZoneAPIkey = "3XNBGBH1XHV0";
  var locationInput = $("#locationInput").val();
  var geoCodequeryURL = `https://api.opencagedata.com/geocode/v1/json?q=${locationInput}&key=${geoCodeAPIkey}`;

  $.ajax({
    url: geoCodequeryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var currentLat = response.results[0].geometry.lat;
    var currentLng = response.results[0].geometry.lng;
    var cityName = response.results[0].components.city;
    var country = response.results[0].components.country;
    var timeZoneQueryURL = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneAPIkey}&format=json&by=position&lat=${currentLat}&lng=${currentLng}`;
    $.ajax({
      url: timeZoneQueryURL,
      method: "GET"
    }).then(function timeZoneSearch(timeResult) {
      console.log(timeResult);
      var timeZone = timeResult.zoneName;
      var currentTimeAtLocation = timeResult.formatted;
      $("#location-div").html(`
          <h1>Current Time: ${currentTimeAtLocation}</h1>
          <h2>Country: ${country} </h2>
          <h2>Time Zone: ${timeZone} </h2>
          <p>GPS coordinates: ${currentLat}, ${currentLng} </p>
          `);
    });
  });
});
