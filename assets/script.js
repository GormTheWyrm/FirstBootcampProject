// first we need to get the user's location using their input
//then we need to get the time for that location and display it (using an API? or JS might 
//have that feature built in, idk)
//then we need to pull up an image based on the location 
//then we need to list times in major cities around the world
//we also need to render an interactive globe that shows you where you are on the globe (Google API?)
const localTimeEl
const globeEL
const worldTimeEl
const locationImageEl
var locationEl

//Making sure the JS loads after the page loads
$(window).load();
//saving user input to localStorage
$('#save').on('click', function(){

    $('input[type="text"]').each(function(){    
        var id = $(this).attr('id');
        var value = $(this).val();
       localStorage.setItem(id, value);
        
    });   
});

$('#load').on('click', function(){
    $('input[type="text"]').each(function(){    
        var id = $(this).attr('id');
        var value = localStorage.getItem(id);
        
        $(this).val(value);
        
    }); 
});