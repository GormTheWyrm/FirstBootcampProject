// first we need to get the user's location using their browser input
//then the globe goes to that user's position based on latitude and longitude
//then we need to get the time for that location and display it
//then we need to pull up an image based on the location 
//then we have a few cities listed on the bottom where if they click them the 
//city pops up in a marker and the globe goes to it.


//this is the globe script. Copied and pasted from WEBGLEARTH.
function initialize() {
    var options = {atmosphere: false, center: [position.coords.latitude, position.coords.longitude], zoom: 5 };
    var earth = new WE.map('earth_div', options);
    WE.tileLayer('http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxZoom: 5,
      attribution: 'NASA'
    }).addTo(earth);
  }