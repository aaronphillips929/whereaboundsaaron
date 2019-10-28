//create empty variables so they can be accessed by every function//
var map;
var service;
var infowindow;
var geocoder;
var bounds;

let MAX_PLACES = 5;


// callback function for the google map API. Initialize the map related fields 
// but has the option to do other things in the future that depend on the map
// loading
function initMap() {
    init();
}


// initialize and place the map
// initialize the geocoder
function init() {
    geocoder = new google.maps.Geocoder;
    // TODO: change to selected preview city instead of Austin
    var cityLat = 30.2672;
    var cityLng = -97.7431;
    var city = new google.maps.LatLng(cityLat, cityLng);
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById("map"), {
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        },
        disableDefaultUI: true,
        zoomControl: true,
        center: city,
        zoom: 14.5
    });  
}

// turn an address or city to a lat/lng
// calls the findPlaces function
function geocodeLatLng(address) {
    geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
        if (results[0]) {
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            displayCity(lat, lng);
            console.log(displayCity);
            var latlng = lat + "," + lng
            // here is where we can call other functions, it's the 'good' path
            findPlaces(latlng);
            return latlng;
        } else {
            console.log('No results found');
        }
    } else {
        console.log('Geocoder failed due to: ' + status);
    }
    });
}

function displayCity(lat, lng) {
    //to display map before pins are placed//
    var cityLat = parseFloat(lat);
    var cityLng = parseFloat(lng);
    var city = new google.maps.LatLng(cityLat, cityLng);
    //declare bounds value to be available later for pins//
    bounds = new google.maps.LatLngBounds();
    //center map on city without default controls other than zoom//
    map = new google.maps.Map(document.getElementById("map"), {
        center: city,
        zoom: 14.5,
        disableDefaultUI: true,
        zoomControl: true,
    });
}

// pins each place on the map
function pinPlaces(places) {
    var placesLength = maxPlaces(places);
    for (var i = 0; i < placesLength; i++) {
        createMarker(places[i], i + 1);
    }
}

// creates the actual pin
function createMarker(place, number) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        //set text color to white for better contrast on red markers//
        label: {text: String(number), color: "white"}
    });
    //after markers are created, the map window will resize to include all markers//
    bounds.extend(marker.position);
    map.fitBounds(bounds);

    google.maps.event.addListener(marker, "click", function() {
        //when marker is clicked, display place name and location in bubble//
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.vicinity + '</div>');
        infowindow.open(map, this);
        //set window to the marker as center on the map//
        map.setCenter(marker.getPosition());
        var label = marker.label.text;
        selectPlace(label);
    });
}

// function to explicitly search for a city
// by city name or zip code
function searchCity(cityName) {
    displayWeather(cityName);
    geocodeLatLng(cityName);
}

// when search is clicked search and display results
$("#search-button").on("click", function(event) {
    event.preventDefault();
    var cityName = $("#search-bar").val();
    geocodeLatLng(cityName);
});

// returns whichever is less to avoid out of range errors
function maxPlaces(places) {
    if (places.length < MAX_PLACES) {
        return places.length;
    }
    return MAX_PLACES;
}

// highlights the place associated with the selected pin
function selectPlace(placeNumber) {
    clearPlacesBackground();
    $("#place-" + placeNumber).addClass("selected-place");  
}

// clears all highlighted places
function clearPlacesBackground() {   
    for (var i = 1; i <= MAX_PLACES; i++) {
        var selectedPlace = $("#place-" + i);
        if (selectedPlace !== undefined) {
            selectedPlace.removeClass("selected-place");
        }
    }
}