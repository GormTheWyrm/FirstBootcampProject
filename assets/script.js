// initializing the globe
function initialize() {
  var options = { atmosphere: false, center: [37.540726, -77.43605], zoom: 5 };
  var earth = new WE.map("earth_div", options);
  WE.tileLayer("https://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg", {
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

  //hardcoded markers with pinned city coords to limit API calls

  var markerSydney = WE.marker([-33.865143, 151.2]).addTo(earth);
  markerSydney
    .bindPopup(
      "<span id='sydneyPopUp' style='color:black'>Sydney, Australia</span>",
      { maxWidth: 60, closeButton: true }
    )
    .openPopup();

  var markerLondon = WE.marker([55.006763, -7.31]).addTo(earth);
  markerLondon
    .bindPopup("<span style='color:black'>London, England</span>", {
      maxWidth: 60,
      closeButton: true
    })
    .openPopup();
  var markerMoscow = WE.marker([55.751, 37.6]).addTo(earth);
  markerMoscow
    .bindPopup("<span style='color:black'>Moscow, Russia</span>", {
      maxWidth: 60,
      closeButton: true
    })
    .openPopup();
  var markerBeijing = WE.marker([39.9, 116.3]).addTo(earth);
  markerBeijing
    .bindPopup("<span style='color:black'>Beijing, China</span>", {
      maxWidth: 60,
      closeButton: true
    })
    .openPopup();
  var markerLosAngeles = WE.marker([34, -118]).addTo(earth);
  markerLosAngeles
    .bindPopup("<span style='color:black'>Los Angeles, CA, USA</span>", {
      maxWidth: 60,
      closeButton: true
    })
    .openPopup();
// event listener embedded in init funciton to run API call for GPS coords for input
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
        if (response.results[0].components.city == undefined) {
          var cityName = locationInput
        }
        else{
        var cityName = response.results[0].components.city;}
// creates new marker on globe at location of user city
  var searchMarker = WE.marker([currentLat, currentLng]).addTo(earth);
  searchMarker.bindPopup(`<span style='color:black'>You typed in: ${cityName}</span>`, {
    maxWidth: 120,
    closeButton: false
  }).openPopup();
  // flyTo() orients globe to show newly added marker
  function flyTo() {
    earth.fitBounds([[currentLat, currentLng - 50], [currentLat, currentLng + 50]]);
    earth.panInsideBounds([[currentLat, currentLng  - 50], [currentLat, currentLng + 50]],
      { heading: 100, tilt: 25, duration: 5 });
    earth.setZoom(3);
  };
  flyTo()
});
});
  //sets where the earth starts out....right now it's richmond. 3.5 is the amount of zoom
  earth.setView([37.540726, -77.43605], 3.5);
}

initialize();
// API keys for calling at various places
var geoCodeAPIkey = "356c83d937c04b978709b023ccb3530f";
var timeZoneAPIkey = "3XNBGBH1XHV0";

// handling for user input
$("#input-button").on("click", function () {
  var locationInput = $("#locationInput").val();
  var geoCodequeryURL = `https://api.opencagedata.com/geocode/v1/json?q=${locationInput}&key=${geoCodeAPIkey}`;
  // first API call takes user input of city and returns GPS coordinates for use in second API
  $.ajax({
    url: geoCodequeryURL,
    method: "GET"
  }).then(function (response) {
    var currentLat = response.results[0].geometry.lat;
    var currentLng = response.results[0].geometry.lng;
    var cityName = response.results[0].components.city;
    var country = response.results[0].components.country;
    var timeZoneQueryURL = `https://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneAPIkey}&format=json&by=position&lat=${currentLat}&lng=${currentLng}`;
    // second API call takes GPS lat and long and returns time info and pushes to HTML
    $.ajax({
      url: timeZoneQueryURL,
      method: "GET"
    }).then(function timeZoneSearch(timeResult) {
      var timeZone = timeResult.zoneName;
      var timeInfoFull = timeResult.formatted;
      var timeInfoArray = timeInfoFull.split(" ");
      var currentDateAtLocation = timeInfoArray[0];
      var timeArray = timeInfoArray[1].split(":");
      var currentTimeAtLocation = `${timeArray[0]}:${timeArray[1]}`;
      $(".location-div").html(`
        <h1>Current Time: ${currentTimeAtLocation}</h1>
        <h1>Current Date: ${currentDateAtLocation}</ha>
        <h2>Country: ${country} </h2>
        <h2>Time Zone: ${timeZone} </h2>
        <p>GPS coordinates: ${currentLat}, ${currentLng} </p>
        `);
    });
  });
  setTimeout(function() {
    updateCityInfo()
  }, 1000);
});
// pinned city info - Array holds objects that are created by getCityInfo()
var cityInfoArray = [];
var majorCitiesArray = [
  "London, United Kingdom",
  "Beijing, China",
  "Sydney, Australia",
  "Moscow, Russia",
  "Los Angeles, CA, United States of America"
];

// runs from load to call for information about pinned cities
// setTimeout() to get around API timeout issue
function getCityInfo() {
  var cityNumber = 0;
  majorCitiesArray.forEach(function(city, index) {
    var geoCodeAPIkey = "700f8122007345be85cf878d02de94cd";
    var geoCodequeryURL = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geoCodeAPIkey}`;
    setTimeout(function() {
      cityNumber++;
      $.ajax({
        url: geoCodequeryURL,
        method: "GET"
      }).then(function(response) {
        var cityInfoObject = {
          cityLat: response.results[0].geometry.lat,
          cityLng: response.results[0].geometry.lng
        };
        var timeZoneQueryURL = `https://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneAPIkey}&format=json&by=position&lat=${cityInfoObject.cityLat}&lng=${cityInfoObject.cityLng}`;
        $.ajax({
          url: timeZoneQueryURL,
          method: "GET"
        }).then(function timeSearch(timeResult) {
          var timeInfoFull = timeResult.formatted;
          var timeInfoArray = timeInfoFull.split(" ");
          var timeArray = timeInfoArray[1].split(":");
          cityInfoObject.cityTime = `${timeArray[0]}:${timeArray[1]}`;
        });
        cityInfoArray.push(cityInfoObject);

        if (cityNumber === majorCitiesArray.length){
        populateCityInfo();
        }
      });
    }, 1000 * index);
  })
}
// called whenever user submits new input to call new time info for pinned cities
// hard codes time difference between cities to limit API calls
function updateCityInfo(){
  cityNumber = 0
  var offsetArray = [8,11,3,17]
  var timeZoneQueryURL = `https://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneAPIkey}&format=json&by=position&lat=${cityInfoArray[0].cityLat}&lng=${cityInfoArray[0].cityLng}`;
  $.ajax({
    url: timeZoneQueryURL,
    method: "GET"
  }).then(function timeSearch(timeResult) {
    var timeInfoFull = timeResult.formatted;
    var timeInfoArray = timeInfoFull.split(" ");
    var timeArray = timeInfoArray[1].split(":");
    cityInfoArray[0].cityTime = `${timeArray[0]}:${timeArray[1]}`;
  });
  for (var i = 1; i < cityInfoArray.length; i++) {
    cityNumber++;
    var startTimeArray = cityInfoArray[0].cityTime.split(":");
    var hrAdjust = +(startTimeArray[0]) + +(offsetArray[i-1]);
    if (hrAdjust > 24) {
      hrAdjust = hrAdjust - 24
    }
    cityInfoArray[i].cityTime = `${hrAdjust}:${startTimeArray[1]}`;
    if(cityNumber === majorCitiesArray.length-1) {
          populateCityInfo();
        };
      };
  }


getCityInfo()
// function to populate time info for pinned cities
function populateCityInfo(){
for (var i = 0; i < majorCitiesArray.length; i++) {
  var timeToPopulate = cityInfoArray[i].cityTime
  // ----------------error resolution for LAX time not populating---------------------------
  if (timeToPopulate === undefined) {
    timeToPopulate = cityInfoArray[i].cityTime;
  $(`#city${i + 1}`).html(`
  <p>${majorCitiesArray[i]}</p>
  <p>Time: <b>big oof</b></p>`);
  }
  // ---------------------------------------------------------------------------------------
  else{
  $(`#city${i+1}`).html(`
  <p>${majorCitiesArray[i]}</p>
  <p>Time: <b>${timeToPopulate}</b></p>`);
  }
}}
// populates html from page load
function populateCityInfoStart() {
  for (var i = 0; i < majorCitiesArray.length; i++) {
    $(`#city${i + 1}`).html(`
  <p>${majorCitiesArray[i]}</p>
  <p>Time:</p>`);
  }
}
populateCityInfoStart()
// prevent enter key from reloading page from input box
$(document).ready(function() {
  $(window).keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

