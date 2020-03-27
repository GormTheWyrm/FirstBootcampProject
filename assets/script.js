// first we need to get the user's location using their browser input
//then the globe goes to that user's position based on latitude and longitude
//then we need to get the time for that location and display it
//then we need to pull up an image based on the location
//then we have a few cities listed on the bottom where if they click them the
//city pops up in a marker and the globe goes to it.

//initializing the globe

function initialize() {
  var options = { atmosphere: false, center: [37.540726, -77.43605], zoom: 5 };
  var earth = new WE.map("earth_div", options);
  WE.tileLayer("http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg", {
    minZoom: 0,
    maxZoom: 5,
    attribution: "NASA"
  }).addTo(earth);

  //adding rotation animation
  var before = null;
  requestAnimationFrame(function animate(now) {
    var c = earth.getPosition();
    var elapsed = before ? now - before : 0;
    before = now;
    //elapsed/*number* changes rotation speed
    earth.setCenter([c[0], c[1] + 0.1 * (elapsed / 45)]);
    requestAnimationFrame(animate);
  });
  // function to establish panning for custom marker additions
  function panTo(coords) {
    earth.panTo(coords);
  }

  //adding markers to the globe, just need to add the markers from a variable from the search

  var markerSydney = WE.marker([-33.865143, 151.2]).addTo(earth);
  markerSydney
    .bindPopup(
      "<span id='sydneyPopUp' style='color:black'>Sydey</span>",
      { maxWidth: 120, closeButton: true }
    )
    .openPopup();
//marker for London, England
  var markerLondon = WE.marker([55.006763, -7.31]).addTo(earth);
  markerLondon
    .bindPopup("<span style='color:black'>London</span>", {
      maxWidth: 120,
      closeButton: true
    })
    .openPopup();
  //marker for Moscow, Russia
  var markerMoscow = WE.marker([55.751, 37.6]).addTo(earth);
  markerMoscow
    .bindPopup("<span style='color:black'>Moscow</span>", {
      maxWidth: 120,
      closeButton: true
    })
    .openPopup();
  //marker for Beijing, China
  var markerBeijing = WE.marker([39.9, 116.3]).addTo(earth);
  markerBeijing
    .bindPopup("<span style='color:black'>Beijing</span>", {
      maxWidth: 120,
      closeButton: true
    })
    .openPopup();
    //marker for Los Angeles, CA, USA
  var markerLosAngeles = WE.marker([34, -118]).addTo(earth);
  markerLosAngeles
    .bindPopup("<span style='color:black'>Los Angeles</span>", {
      maxWidth: 120,
      closeButton: true
    })
    .openPopup();

//click function for adding marker to globe
  $("#input-button").on("click", function () {
    var geoCodeAPIkey = "356c83d937c04b978709b023ccb3530f";
    var timeZoneAPIkey = "3XNBGBH1XHV0";
    var locationInput = $("#locationInput").val();
    var geoCodequeryURL = `https://api.opencagedata.com/geocode/v1/json?q=${locationInput}&key=${geoCodeAPIkey}`;

    $.ajax({
      url: geoCodequeryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      var currentLat = response.results[0].geometry.lat;
      var currentLng = response.results[0].geometry.lng;
      var cityName = response.results[0].components.city;
      var atmosphere = true;

//API function adding the marker
      var searchMarker = WE.marker([currentLat, currentLng]).addTo(earth);
      searchMarker.bindPopup(`<span style='color:black'>You typed in: ${cityName}</span>`, {
        maxWidth: 120,
        closeButton: false
      }).openPopup();
      // API function that sends the globe to the location user searched
      function flyTo() {
        earth.fitBounds([[currentLat, currentLng - 50], [currentLat, currentLng + 50]]);
        earth.panInsideBounds([[currentLat, currentLng  - 50], [currentLat, currentLng + 50]],
          { heading: 100, tilt: 25, duration: 5 });
        earth.setZoom(3);
      };
      flyTo()
    });
  });
  // var markerCustom = WE.marker(
  //   [50, -9],
  //   "/img/logo-webglearth-white-100.png",
  //   100,
  //   24
  // ).addTo(earth);
  //sets where the earth starts out....right now it's richmond. 3.5 is the amount of zoom
  earth.setView([37.540726, -77.43605], 3.5);
}

initialize();
var geoCodeAPIkey = "356c83d937c04b978709b023ccb3530f";
var timeZoneAPIkey = "3XNBGBH1XHV0";

$("#input-button").on("click", function () {

  var locationInput = $("#locationInput").val();
  var geoCodequeryURL = `https://api.opencagedata.com/geocode/v1/json?q=${locationInput}&key=${geoCodeAPIkey}`;

  $.ajax({
    url: geoCodequeryURL,
    method: "GET"
  }).then(function (response) {
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
      var timeInfoFull = timeResult.formatted;
      var timeInfoArray = timeInfoFull.split(" ");
      var currentDateAtLocation = timeInfoArray[0];
      var currentTimeAtLocation = timeInfoArray[1];
      $(".location-div").html(`
  <h1>Current Time: ${currentTimeAtLocation}</h1>
  <h1>Current Date: ${currentDateAtLocation}</ha>
  <h2>Country: ${country} </h2>
  <h2>Time Zone: ${timeZone} </h2>
  <p>GPS coordinates: ${currentLat}, ${currentLng} </p>
  `);
    });
  });
});

var cityInfoArray = [];

function getCityInfo() {
  var majorCities = [
    "London, United Kingdom",
    "Beijing, China",
    "Sydney, Australia",
    "Moscow, Russia",
    "Los Angeles, CA, United States of America",
  ];
  majorCities.forEach(function (city) {
    var geoCodeAPIkey = "700f8122007345be85cf878d02de94cd";
    var geoCodequeryURL = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geoCodeAPIkey}`;
    $.ajax({
      url: geoCodequeryURL,
      method: "GET"
    }).then(function (response) {
      var cityInfoObject = {
        cityLat: response.results[0].geometry.lat,
        cityLng: response.results[0].geometry.lng
      };
      var timeZoneQueryURL = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneAPIkey}&format=json&by=position&lat=${cityInfoObject.cityLat}&lng=${cityInfoObject.cityLng}`;
      $.ajax({
        url: timeZoneQueryURL,
        method: "GET"
      }).then(function timeSearch(timeResult) {
        var timeInfoFull = timeResult.formatted;
        var timeInfoArray = timeInfoFull.split(" ");
        cityInfoObject.cityTime = timeInfoArray[1];
      });
      cityInfoArray.push(cityInfoObject);
      console.log(cityInfoArray)
    });
  })
}
// getCityInfo()


