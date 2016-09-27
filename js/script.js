// The Modeldata contains data about the locations and their respective co-ordinates.
var Modeldata = ko.observableArray([
    {name: 'Fullerton', lat: 33.8704, lng:-117.9243},
    {name: 'Huntington Beach', lat: 33.6603, lng:-117.9992, },
    {name: 'Cal State Fullerton ', lat: 33.8829, lng:-117.8869},
    {name: 'Hollywood Sign', lat:34.1341 , lng:-118.3215},
    {name: 'Universal Studios Hollywood', lat: 34.1381, lng:-118.3534},
    {name: 'Disney Land ', lat:33.8121 , lng:-117.9190}
   
]);
function errors()
{
	window.alert(" Google maps not loaded properly , please reload the page");
}
// This function is the view model 
function getModel(map) {

 
console.log("hssad");
var self=this;
// creating the new instance of the info window.
var infowindow = new google.maps.InfoWindow();


for (i = 0 ; i < Modeldata().length; i++) {

	    // creating the marker objects.
	    Modeldata()[i].pin ={
	    	name:ko.observable(Modeldata()[i].name),
	    lat:ko.observable(Modeldata()[i].lat),
	    lng:ko.observable(Modeldata()[i].lng),
	    marker:new google.maps.Marker({
			position: new google.maps.LatLng(Modeldata()[i].lat,Modeldata()[i].lng),
			animation: google.maps.Animation.DROP,
			map: map,
			animation: google.maps.Animation.DROP,
        icon: 'images/beachflag.png'
	    }) 
	}
	    
		var tempname = Modeldata()[i].pin.name();

		// registering the infowindow to the event listener , for the click event.
		//[1] This code was inspired from the stack overflow website.
     google.maps.event.addListener(Modeldata()[i].pin.marker, 'click', function(pin, infowindow, tempname) {

	return function() {
					
	self.Wikinyt(tempname, infowindow);       
		infowindow.open(map, pin.marker);  
		pin.marker.setAnimation(google.maps.Animation.BOUNCE);
					
				};
		}(Modeldata()[i].pin, infowindow, tempname));
	
}

// creating the observables.
self.places = ko.observableArray(Modeldata());

self.input = ko.observable('');

// This function is a knockout computed function . This filters the user input 
self.search = ko.computed(function() {
 self.currentLocations = ko.observableArray();
for(i=0;i<self.places().length;i++){
			var searchIndex = self.places()[i].name.toLowerCase().search(self.input().toLowerCase());
			console.log(searchIndex);


			
			if (searchIndex >= 0) {
				
				self.places()[i].pin.marker.setVisible(true);
				
				self.currentLocations.push(self.places()[i]); 
			} 
			else {
				
				self.places()[i].pin.marker.setVisible(false); 
			}

		}
	
		
		return self.currentLocations(); 

	});
// this function gets executed when ever the user clicks on the pin or the Locations list
self.locationClicked = function(item) {
	console.log(item.name+" clicked ");
	
	
		
		google.maps.event.trigger(item.pin.marker, 'click');


	}




	

// This function makes the AJAX calls to the various api's like Wikipedia and Nytimes to retreive the articles . The below code was inspired from the AJAX course with the Udacity
var k=0;var x=0;
self.Wikinyt = function(tempname, infowindow) {


	if (x>0){
		$( "#nyt" ).empty();

	}
	
var nytimes='https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+tempname+'&sort=newest&api-key=aa096c0fc20945bf8998ad95e382f1a3'
     $.getJSON(nytimes,function(data){
     	x++;
        
        articles=data.response.docs;
        console.log(articles);

        // adding only 5 NY times articles to the DOM
        for(var i=0;i<5;i++)
        {
            var article=articles[i];
            $('#nyt').append('<li >'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'</li>'+'<hr>');
            console.log(article.headline.main);
            var div = document.getElementById('nyt');
            
	
        };
    
     	}).done(function(val1) {
		
	}).fail(function(val2){
		alert("Wikipedia resources did not load. Please refresh page.");
		
	});

		
		var wikiPlacesUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=' + tempname;

		// Making use of the google street view. The street view is added to the infowindow.
		var streeturl='http://maps.googleapis.com/maps/api/streetview?size=800x400&location='+tempname+'';
		infowindow.setContent('<img class="bgimg" height="100" width="180" src="'+streeturl+'">'+'<h3>'+tempname);

		if (k>0){
		$( "#wiki" ).empty();

		}

					
		$.ajax({
			url: wikiPlacesUrl,
			dataType: 'jsonp',
			success: function(data) {
				k++;

				console.log(data);

				var nameOfLocation = data.query.search[0].name;
				var url = 'https://en.wikipedia.org/wiki/' + tempname;

				
				$("#wiki").append('</h3>' + '<a href="' + url + '">' + 'Wikipedia Article for ' + tempname + '</a>');
				
				}
		}).done(function(val1) {
		
	}).fail(function(jqXHR, textStatus, errorThrown){
		alert("Wikipedia resources did not load. Please refresh page.");
	});

	};
};