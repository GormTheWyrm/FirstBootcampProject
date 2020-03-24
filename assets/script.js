// first we need to get the user's location using their browser input
//then the globe goes to that user's position based on latitude and longitude
//then we need to get the time for that location and display it
//then we need to pull up an image based on the location
//then we have a few cities listed on the bottom where if they click them the
//city pops up in a marker and the globe goes to it.


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

$("#input-button").on("click", function () {
  var geoCodeAPIkey = "356c83d937c04b978709b023ccb3530f";
  var timeZoneAPIkey = "3XNBGBH1XHV0";
  var locationInput = $("#locationInput").val();
  var geoCodequeryURL = `https://api.opencagedata.com/geocode/v1/json?q=${locationInput}&key=${geoCodeAPIkey}`;

  $.ajax({
    url: geoCodequeryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response)
    var currentLat = response.results[0].geometry.lat
    var currentLng = response.results[0].geometry.lng
    var cityName = response.results[0].components.city
    var country = response.results[0].components.country

    var timeZoneQueryURL = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneAPIkey}&format=json&by=position&lat=${currentLat}&lng=${currentLng}`;
    $.ajax({
      url: timeZoneQueryURL,
      method: "GET"
    }).then(function timeZoneSearch(timeResult) {
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
