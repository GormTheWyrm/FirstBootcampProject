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

  //adding markers to the globe, just need to add the markers from a variable from the search

  var markerSydney = WE.marker([-33.865143, 151.2]).addTo(earth);
  markerSydney
    .bindPopup(
      "<b>Hello world!</b><br>I am a popup.<br /><span style='font-size:10px;color:#999'>Tip: Another popup is hidden in Cairo..</span>",
      { maxWidth: 150, closeButton: true }
    )
    .openPopup();

  var markerLondon = WE.marker([55.006763, -7.31]).addTo(earth);
  markerLondon.bindPopup("<b>Cairo</b><br>Yay, you found me!", {
    maxWidth: 120,
    closeButton: false
  });
  var markerMoscow = WE.marker([55.751, 37.6]).addTo(earth);
  markerMoscow.bindPopup("<b>Cairo</b><br>Yay, you found me!", {
    maxWidth: 120,
    closeButton: false
  });
  var markerBeijing = WE.marker([39.9, 116.3]).addTo(earth);
  markerBeijing.bindPopup("<b>Cairo</b><br>Yay, you found me!", {
    maxWidth: 120,
    closeButton: false
  });
  var markerLosAngeles = WE.marker([34, -118]).addTo(earth);
  markerLosAngeles.bindPopup("<b>Cairo</b><br>Yay, you found me!", {
    maxWidth: 120,
    closeButton: false
  });


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
    //need to add flyTo function
    
  var searchMarker = WE.marker([currentLat, currentLng]).addTo(earth);
  searchMarker.bindPopup("You typed in" + cityName, {
    maxWidth: 120,
    closeButton: false
  });
  function flyto() {
    map.fitBounds([[currentLat,currentLat+100],[currentLng,currentLng+100]]);
    map.panInsideBounds([[currentLat,currentLat+100],[currentLng,currentLng+100]],
    {heading: 90, tilt: 25, duration: 1});
  };

});
});
  var markerCustom = WE.marker(
    [50, -9],
    "/img/logo-webglearth-white-100.png",
    100,
    24
  ).addTo(earth);
  //sets where the earth starts out....right now it's richmond. 3.5 is the amount of zoom
  earth.setView([37.540726, -77.43605], 3.5);
}

initialize();

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
