var apiKey = "AIzaSyADAEzhWG-Zr1lJeCo5mJmk6Oh_JPIDjUI"


// the meat of our app, find and display all the places for a given lat/lng
function findPlaces(cityCoords) {
    // In this case, the "this" keyword refers to the button that was clicked

    $("#search-bar").empty();
    var cityCoords = cityCoords;
    var type = $("#dropdownMenuButton").val();
    // default to restaurant
    if (type === "") {
        type = "restaurant";
    }
    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + cityCoords + "&radius=1500&type=" + type + "&key=" + apiKey;
  
    console.log(queryURL);
    // Performing our AJAX GET request
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After the data comes back from the API
      .then(function (response) {
          $("#place-list").empty();
            // Storing an array of results in the results variable
            var results = response.results;
            console.log(results);
            var placeIDs = {};
            var resultsLength = maxPlaces(results);

            // use jquery to display each place on the page in #places-list
            // TODO: pretty up, this is difficult to understand
            for (var i = 0; i < resultsLength; i++) {
              placeIDs[i + 1] = results[i].place_id;
              var nameDiv = $("<div>");
              var label = $("<span>");
              label.addClass("label");
              label.text(String(i + 1) + ". ");
              var place = $("<a>").text(results[i].name); 
              place.addClass("place-name");
              place.attr("id", "place-name-" + (i + 1));
              nameDiv.append(label, place);
              var ratingDiv = $("<div>");
              if (results[i].rating !== undefined) {
                //pull rating from results and calculate percentage out of 5 stars//
                var placeRatings = results[i].rating;
                var starTotal = 5;
                var starPercentage = (placeRatings/starTotal) * 100;
                var starPercentageRounded = (Math.round(starPercentage));
                //create a new div to hold both empty and filled stars//
                var stars = $("<div>");
                stars.addClass("stars-outer");
                var place = $("<div>");
                place.addClass("stars-inner");
                //add the filled stars over the empty stars//
                $(stars).append(place);
                //update style width of filled stars (percentage) to cover empty stars//
                $(place).width(starPercentageRounded+"%");
                //put both sets of stars onto the page//
                ratingDiv.append(stars);
              }
              var priceDiv = $("<div>");
              if (results[i].price_level !== undefined) {
                  var price = $("<span>").text(priceToDollar(results[i].price_level));
                  price.addClass("price");
                  priceDiv.append(price);
              }
              var placeDiv = $("<div>");

              // bootstrap grid layout, change the column length here instead of margins 
              var row = $("<div class='row'>");
              var nameCol = $("<div class='col-md-7'>");
              nameCol.append(nameDiv);
              row.append(nameCol);
              var ratingCol = $("<div class='col-md-3'>");
              ratingCol.append(ratingDiv);
              row.append(ratingCol);
              var priceCol = $("<div class='col-md-2'>");
              priceCol.append(priceDiv);
              row.append(priceCol);
              placeDiv.attr("id", "place-" + (i +1));
              placeDiv.addClass("place-info");
              placeDiv.append(row);
              $("#place-list").append(placeDiv);
            }        
            pinPlaces(results);  
            console.log(results);
            
            // add the url of each place given its placeID. this requires a separate api call
            addURLs(placeIDs);    
      });
  };

  
  function addURLs(placeIDs) {
      // loop through our places
      for (var j = 1; j <= MAX_PLACES; j++) {
        // get the query string with the place ID
        var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeIDs[j] + "&key=" + apiKey;
        // clojure to lock in the value of j when we make the .then call
        (function(j) {
            $.ajax({
                method: "GET",
                url: queryURL
            }).then( function(response) {
                // set the href of the place to its site
                var site = response.result.website;
                var placeName = $("#place-name-" + j);
                placeName.attr("href", site);
                placeName.attr("target", "_blank");
                
            });
        })(j);
      }
  }

  // convert our price value to a dolar amount, $/$$/$$$ etc
  function priceToDollar(price) {
      var prices = "";
      for (var i = 0; i < price; i++) {
          prices += "$";
      }
      return prices;
  }


$(document).ready(function() { 
    // dropdown listener to set category
  $("#dropdown-list a").on("click", function(event) {
      event.preventDefault();
      var val = $(this).attr("value");
      var text = $(this).text();
      $("#dropdownMenuButton").val(val);
      $("#dropdownMenuButton").text(text);
  });

  // enable search by clicking 'Explore City' on the carousel
  $(".city-carousel").on("click", function(event) {
    var city = $(this).attr("city-name");
    $("#search-bar").val(city);
    searchCity(city);
  });
});


// pick a random city to display on page load
function randomCity() {
    var cities = ["Hong Kong", "Paris", "Sydney", "Tokyo", "New York City"];
    return cities[Math.floor(Math.random() * 5)];
}

$(window).on("load", function() {
    var city = randomCity();
    $("#search-bar").val(city);
    searchCity(city);
});