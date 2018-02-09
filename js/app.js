//global locations array
var locations = [ 
	{
        name: 'San Diego Zoo',
        location: {lat: 32.7353, lng: -117.1490},
        street: '2920 Zoo Dr',
        city: 'San Diego, CA 92101',
        phone:'(619) 231-1515',
        url: 'http://zoo.sandiegozoo.org/',
        visible: ko.observable(true)
    },
    {
        name: 'USS Midway Museum',
        location: {lat: 32.7137, lng: -117.1751},
        street: '910 N Harbor Dr',
        city: 'San Diego, CA 92101',
        phone: '(619) 544-9600',
        url: 'https://www.midway.org/',
        visible: ko.observable(true)
    },
    {
        name: 'Petco Park',
        location: {lat: 32.7076568, lng: -117.1569049},
        street: '100 Park Blvd',
        city: 'San Diego, CA 92101',
        phone:'(619) 795-5555',
        url: 'https://www.mlb.com/padres',
        visible: ko.observable(true)
    },
    {
        name: 'The Old Spaghetti Factory',
        location: {lat: 32.7080764, lng: -117.1597637},
        street: '275 Fifth Ave',
        city: 'San Diego, CA 92101',
        phone:'(619) 233-4323',
        url: 'http://www.osf.com/location/san-diego-ca/',
        visible: ko.observable(true)
    },
    {
        name: 'San Diego Air & Space Museum',
        location: {lat: 32.7263, lng: -117.1543},
        street: '2001 Pan American Plaza',
        city: 'San Diego, CA 92101',
        phone:'(619) 234-8291',
        url: 'https://www.balboapark.org/museums/air-space',
        visible: ko.observable(true)
    },
    {
        name: 'Seaport Village',
        location: {lat: 32.7094908, lng: -117.1708757},
        street: '849 West Harbor Dr',
        city: 'San Diego, CA 92101',
        phone:'(619) 235-4014',
        url: 'http://www.seaportvillage.com/',
        visible: ko.observable(true)
    },
    {
        name: 'Maritime Museum of San Diego',
        location: {lat: 32.7209, lng: -117.1740},
        street: '1492 N Harbor Dr',
        city: 'San Diego, CA 92101',
        phone:'(619) 234-9153',
        url: 'https://sdmaritime.org/',
        visible: ko.observable(true)
    },
    {
        name: 'Westfield Horton Plaza',
        location: {lat: 32.7138765, lng: -117.1623614},
        street: '324 Horton Plaza',
        city: 'San Diego, CA 92101',
        phone:'(619) 239-8180',
        url: 'https://www.westfield.com/hortonplaza',
        visible: ko.observable(true)
    },
    {
        name: 'House of Blues San Diego',
        location: {lat: 32.7163643, lng: -117.1600029},
        street: '1055 Fifth Ave',
        city: 'San Diego, CA 92101',
        phone:'(619) 299-2583',
        url: 'http://www.houseofblues.com/sandiego',
        visible: ko.observable(true)
    }
];

//map variable
var map;

//global locations markers array with empty objects
var markers = [];

//map initialize function
function initMap() {
	//create new map - centered and zoomed at specified coordinate
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 32.7218975, lng: -117.1571345},
		zoom: 14
	});
    google.maps.event.addDomListener(window, "resize", function() { 
        var center = map.getCenter(); 
        google.maps.event.trigger(map, "resize"); map.setCenter(center); 
    });
    //create infoWindow
    var myInfowindow = new google.maps.InfoWindow();
    var streetViewAPI = 'https://maps.googleapis.com/maps/api/streetview?size=250x125&location=';

    //For loop to create array of markers using the locations array
    for (var i =0; i < locations.length; i++) {
    	/* jshint loopfunc: true */
        //get location coodinates from the location array for position variable
        var position = locations[i].location;
        var title = locations[i].name;
        var location = 'LatLng:' + ' ' + locations[i].location.lat + ', ' + locations[i].location.lng;
        var street = locations[i].street;
        var city = locations[i].city;
        var phone = locations[i].phone;
        var image = streetViewAPI + locations[i].location.lat + ', ' + locations[i].location.lng + '&fov=120&heading=235.78&pitch=10';
        var url = locations[i].url;
        // create marker and attributes per location
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            location: location,
            street: street,
            city: city,
            phone: phone,
            image: image,
            url: url,
            animation: google.maps.Animation.DROP,
            icon: 'img/goggle_marker.png',
            id: i
        });
        //push the newly marker into markers array
        markers.push(marker);
        viewmodel.locationList()[i].marker = marker;

    //create click eventListener to open infoWindow and bounce pin for each markers
        marker.addListener('click', (function(marker, i) {
            return function () {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function(){ marker.setAnimation(null); }, 2250);
                }
                populateInfoWindow(this, myInfowindow);
                map.setZoom(15);
            };
        }) (marker, i));
    }

    //show/hide locations button bindings using jQuery
    document.getElementById('show-locations').addEventListener('click', showLocations);
    document.getElementById('hide-locations').addEventListener('click', hideLocations);
}


//function to populate infoWindow when a marker is clicked
//only one marker to open on the markers location
function populateInfoWindow(marker, infowindow) {
    //check infoWindow is open
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<strong>' + marker.title + '</strong><br>' +
                            '<br><img src="' + marker.image + '"><br>' +
                            '<em>' + marker.location + '</em><br>' +
                            '<br>'+ marker.street +
                            '<br>' + marker.city +
                            '<br>'+ marker.phone +
                            '<br>' + '<br><a href="http://' + marker.url + '" target="_blank">' + marker.url + '</a>'
                            );
        infowindow.open(map, marker);
        //clear marker property when infowindow is closed
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }
}

//Hide/Show Locations options
var isListVisible = true;

// function to shows all locations in the location list
function showLocations() {
    $("#search-list").show();
    isListVisible = true;
}

//function to hide  all in the location list
function hideLocations() {
    $("#search-list").hide();
    $("#display-buttons").unwrap();
}
$("#show-locations").click(showLocations);
$("#hide-locations").click(hideLocations);

//Model to make location
var Location = function(data) {

    this.name = ko.observable(data.name);
    this.street = ko.observable(data.street);
    this.city = ko.observable(data.city);
    this.phone = ko.observable(data.phone);
    this.url = ko.observable(data.url);

    this.address = ko.computed(function() {
        return this.street() + " " + this.city();
    }, this);
};

//ViewModel
var viewModel = function() {
    var self = this;
    self.locationList = ko.observableArray([]);

    locations.forEach(function(locationItem) {
        self.locationList.push( new Location(locationItem) );
    });

    this.currentLocation = ko.observable( this.locationList()[0] );

    this.selectLocation = function(selectedLocation) {
        self.currentLocation(selectedLocation);
    };
    //search and filter observable object
    self.query = ko.observable('');
    //ko.utils.arrayFilter - filter the items using the filtered text
    self.filteredLocations = ko.computed(function() {
      var query = self.query().toLowerCase();
      if (!query) {
          self.locationList().forEach(function(location) {
          	if (location.marker) {
          		location.marker.setVisible(true);
          	}
          });
          return this.locationList();
      } else {
          return ko.utils.arrayFilter(this.locationList(), function(loc) {
          	  if (loc.name().toLowerCase().indexOf(query) > -1) {
          	  	  loc.marker.setVisible(true);
          	  	return true;
          	  } else {
          	  	  loc.marker.setVisible(false);
          	  	  return false;
          	  }
          });
      }
    }, self);
        //viewModel display location marker-info on click
        self.displayLocationInfo = function(location) {
            google.maps.event.trigger(location.marker, 'click');
        };
    };

var viewmodel = new viewModel();
ko.applyBindings((viewmodel));

//openWeather_API Current Weather by zipcode
var myOpenWeatherAPIKey = '9b5cec924e56cae4b7f3dcefb4ddb746';
var openWeatherMapUrl = "http://api.openweathermap.org/data/2.5/weather?zip=92101,us&APPID=" + myOpenWeatherAPIKey + "&units=imperial";
//using JSON method for retrieving API data
$.getJSON(openWeatherMapUrl, function(data) {
    var parameters = $(".weather-data ul");
    var iconCode = data.weather[0].icon;
    var iconDescription = data.weather[0].main;
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    detail = data.main;
    windspd = data.wind;
    parameters.append('<li>Temp: ' + Math.round(detail.temp) + '° F</li>');
    parameters.append('<li><img style="width: 25px" src="' + iconUrl + '">  ' + iconDescription + '</li>');
}).fail(weatherError = function(e) {
        $(".weather-data").append("OpenWeatherAPI is unable to load!");
    });

//weather API error handling

        
// error handling function on maps
mapError = function() {
    alert('Google Maps failed to load!');
};
