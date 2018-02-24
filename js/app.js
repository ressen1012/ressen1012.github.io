//MODEL
//global initial locations 
var locations = [{
        name: 'San Diego Zoo',
        latlng: {
            lat: 32.7353,
            lng: -117.1490
        },
        street: '2920 Zoo Dr',
        city: 'San Diego, CA',
        zipcode: 92101,
        phone: '(619) 231-1515',
        url: 'www.sandiegozoo.org/',
        fsId: '4a369f12f964a520c19d1fe3',
        visible: ko.observable(true)
    },
    {
        name: 'USS Midway Museum',
        latlng: {
            lat: 32.7137,
            lng: -117.1751
        },
        street: '910 N Harbor Dr',
        city: 'San Diego, CA',
        zipcode: 92101,
        phone: '(619) 544-9600',
        url: 'www.midway.org/',
        fsId: '4b19744cf964a5209fdd23e3',
        visible: ko.observable(true)
    },
    {
        name: 'Petco Park',
        latlng: {
            lat: 32.7076568,
            lng: -117.1569049
        },
        street: '100 Park Blvd',
        city: 'San Diego, CA',
        zipcode: 92101,
        phone: '(619) 795-5555',
        url: 'www.mlb.com/padres',
        fsId: '4b15503df964a5202eb023e3',
        visible: ko.observable(true)
    },
    {
        name: 'Hard Rock San Diego',
        latlng: {
            lat: 32.7080764,
            lng: -117.1597637
        },
        street: '207 5th Ave',
        city: 'San Diego, CA',
        zipcode: 92101,
        phone: '(619) 233-4323',
        url: 'www.hardrockhotelsd.com',
        fsId: '4a68a94ff964a520c9ca1fe3',
        visible: ko.observable(true)
    },
    {
        name: 'Air & Space Museum',
        latlng: {
            lat: 32.7263215,
            lng: -117.1542858
        },
        street: '2001 Pan American Plz',
        city: 'San Diego, CA',
        zipcode: 92101,
        phone: '(619) 234-8291',
        url: 'sandiegoairandspace.org/',
        fsId: '4b368d52f964a520ce3725e3',
        visible: ko.observable(true)
    },
    {
        name: 'Seaport Village',
        latlng: {
            lat: 32.7094908,
            lng: -117.1708757
        },
        street: '849 West Harbor Dr',
        city: 'San Diego, CA',
        zipcode: 92101,
        phone: '(619) 235-4014',
        url: 'www.seaportvillage.com',
        fsId: '4a354db0f964a520c79c1fe3',
        visible: ko.observable(true)
    },
    {
        name: 'Maritime Museum',
        latlng: {
            lat: 32.7209,
            lng: -117.1740
        },
        street: '1492 N Harbor Dr',
        city: 'San Diego, CA',
        zipcode: 92101,
        phone: '(619) 234-9153',
        url: 'www.sdmaritime.org/',
        fsId: '4e769ff9d22d80eb33bd111f',
        visible: ko.observable(true)
    },
    {
        name: 'Westfield Horton Plaza',
        latlng: {
            lat: 32.7134337,
            lng: -117.1625332
        },
        street: '324 Horton Plaza',
        city: 'San Diego, CA',
        zipcode: 92101,
        phone: '(619) 239-8180',
        url: 'www.westfield.com/hortonplaza',
        fsId: '465a059af964a52022471fe3',
        visible: ko.observable(true)
    },
    {
        name: 'House of Blues',
        latlng: {
            lat: 32.7164556,
            lng: -117.1621267
        },
        street: '1055 5th Ave',
        city: 'San Diego, CA',
        zipcode: 92101,
        phone: '(619) 299-2583',
        url: 'www.houseofblues.com/sandiego',
        fsId: '428d2880f964a520ac231fe3',
        visible: ko.observable(true)
    }
];

//Constructor to make location - MODEL
var Location = function(data) {
    'use strict';
    var self = this;
    self.name = data.name;
    self.latlng = data.latlng;
    self.street = data.street;
    self.address = data.city + " " + data.zipcode;
    self.phone = data.phone;
    self.url = data.url;
    self.image = data.image;
    self.marker = data.marker;
};

//VIEWMODEL
var ViewModel = function() {
    'use strict';
    var self = this;

    this.locationList = ko.observableArray([]);
    //this.markers = ko.observableArray([]);

    locations.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));
    });

    this.currentLocation = ko.observable(this.locationList()[0]);

    this.selectLocation = function(selectedLocation) {
        self.currentLocation(selectedLocation);
    };

    //viewModel display location marker-info on click
    this.displayMarkerInfo = function(location) {
        google.maps.event.trigger(location.marker, 'click');
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
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function(loc) {
                if (loc.name.toLowerCase().indexOf(query) > -1) {
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

//Nav Hamburger Button Option
(function() {
    'use strict';
    var navElement = $('body'),
        navBarButton = navElement.find('.nav-bar-button');
    navBarButton.on('click', function(e) {
        navElement.toggleClass('nav-open');
        e.preventDefault();
    });
})();

//VIEW - map variable
var map, marker, i;

//global locations markers array with empty objects
var marker = [];

//map initialize function
function initMap() {
    'use strict';
    //create new map - centered and zoomed at specified coordinate
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 32.7111966,
            lng: -117.1667929
        },
        zoom: 14,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        }
    });

    //resize and center map on selecttion
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    //infoWindow variable
    var myInfowindow = new google.maps.InfoWindow();
    //Google Street-view API variable
    var streetViewAPI = 'https://maps.googleapis.com/maps/api/streetview?size=250x125&location=';

    //For loop to create array of markers using the locations array
    for (var i = 0; i < locations.length; i++) {
        /* jshint loopfunc: true */
        //get location coodinates from the location array for position variable
        var position = locations[i].latlng;
        var title = locations[i].name;
        var street = locations[i].street;
        var address = locations[i].city + " " + locations[i].zipcode;
        var phone = locations[i].phone;
        var url = locations[i].url;
        var image = streetViewAPI + locations[i].latlng.lat + ', ' + locations[i].latlng.lng + '&fov=120&heading=235.78&pitch=10';
        var venueId = locations[i].fsId;

        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            street: street,
            adreess: address,
            phone: phone,
            url: url,
            image: image,
            animation: google.maps.Animation.DROP,
            icon: 'ressen1012.github.io/goggle_marker.png',
            id: venueId
        });
        //push the newly created marker into markers array
        locations[i].marker = marker;

        //create click eventListener to open infoWindow and bounce pin for each markers
        marker.addListener('click', (function(marker, i) {
            return function() {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        marker.setAnimation(null);
                    }, 2250);
                }
                fourSquareAPI(this);
                map.setZoom(15);
                map.setCenter(marker.getPosition());
            };
        })(marker, i));
    }
    ko.applyBindings(new ViewModel());

    //function to populate infoWindow when a marker is clicked
    //only one marker to open on the markers location
    function populateInfoWindow(marker, infowindow) {
        //check infoWindow is open
        if (infowindow.marker != marker) {
            infowindow.marker = marker;

            infowindow.setContent('<strong>' + marker.title + '</strong><br>' +
                '<br><img src="' + marker.image + '"><br>' +
                '<strong>' + (marker.users).toLocaleString('en') + '</strong>' + ' Foursquare users ' + 'checked-in here ' + '<br>' + '<strong>' + (marker.checkIns).toLocaleString('en') + '</strong>' + ' times. It is been rated ' +
                '<strong>' + (marker.rating * 10) + '%!' + '</strong>' +
                '<br> <img src='ressen1012.github.io/Foursquare-attr.png'>' +
                '<br>' + marker.street +
                '<br>' + address +
                '<br>' + marker.phone +
                '<br>' + '<br><a href="http://' + marker.url + '" target="_blank">' + marker.url + '</a>');

            infowindow.open(map, marker);
            //clear marker property when infowindow is closed
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
                map.setCenter(marker.getPosition());
                map.setZoom(14);
            });
        }
    }

    // FourSquare API call using AJAX
    function fourSquareAPI(marker) {
        var myFourSquareClientID = 'ENF2BNPOADPIFMLQV5PYZIHC5B5WHXPEXI0QX1GYFIINBOHM';
        var myFourSquareClientSecret = '5WZ4AP1SVQO50DSOBYZMJKQXI4I2X03G4G0DIXBT4NONMCNX';
        var venuesId = marker.id;
        var myFourSquareURL = 'https://api.foursquare.com/v2/venues/' + venuesId + "?client_id=" + myFourSquareClientID + "&client_secret=" + myFourSquareClientSecret + "&v=20180214";

        $.ajax({
            dataType: "json",
            url: myFourSquareURL,
            success: function(data) {
                console.log(data);
                marker.users = data.response.venue.stats.usersCount;
                marker.checkIns = data.response.venue.stats.checkinsCount;
                marker.rating = data.response.venue.rating;
                //console.log(checkIns);
                //console.log(users);
                //console.log(rating);
                populateInfoWindow(marker, myInfowindow);
            },
            error: function(e) {
                myInfowindow.setContent('<strong>' + marker.title + '</strong><br>' +
                    '<br><img src="' + marker.image + '"><br>' +
                    '<strong>' + 'Sorry, FourSquare data is not reachable!' + '</strong>' + '<br>' +
                    '<br>' + marker.street +
                    '<br>' + address +
                    '<br>' + marker.phone +
                    '<br>' + '<br><a href="http://' + marker.url + '" target="_blank">' + marker.url + '</a>');
                myInfowindow.open(map, marker);
            }
        });
    }
}

// error handling function on maps
mapError = function() {
    alert('Google Maps failed to load!');
};
