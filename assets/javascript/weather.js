
function displayWeather(cityName) {

    $("#weather-display").empty();

    var cityName;
    if (cityName === undefined) {
        //value from  the search bar set equal to city
        cityName = $("#search-bar").val().trim();
    }
    //capitalize first letter of each city name
    function capitalizeFirstLetter(string) {
        var stringArr = string.split(" ");
        var result = "";
        for (var i = 0; i < stringArr.length; i++) {
            var word = stringArr[i].charAt(0).toUpperCase() + stringArr[i].slice(1);
            result += word + " ";
        }
        return result.trim();
    }
    cityName = capitalizeFirstLetter(cityName);
    
    $("#city-name").text(cityName);
    console.log(cityName);
    
       //  ajax  request using name or zip code              
    var queryUrl = "https://api.weatherbit.io/v2.0/forecast/daily?key=7169e5ccc01a4702a01e93ee6982101a&units=I&days=5&";

    if (isNaN(cityName)) {
        queryUrl += "city=" + cityName;
    } else {
        queryUrl += "postal_code=" + cityName;
    }
    console.log(queryUrl);


    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        var results = response.data;
        console.log(results);
        
        

        var weatherDisplay = $("#weather-display");
            
        //  loop through the weather results
        for (var i = 0; i < results.length; i++) {
            var dayWeather = $("<div>");
            var day = results[i].datetime;
            dayWeather.addClass("card-body");
            dayWeather.addClass("text-center");
            dayWeather.addClass("day-weather");
            dayWeather.addClass("col");

            //min and max temp results
            var maxTemp = results[i].max_temp;
            var minTemp = results[i].min_temp;
            

            var weatherIcon = results[i].weather.icon;
            
            //append day of the week to browser
            var convertedDate = moment(day, "YYYY-MM-DD").format("dd");
            dayWeather.append(convertedDate);

            //add weather icons to browswer
            var icon = $("<img>");

            icon.attr("src", "https://www.weatherbit.io/static/img/icons/" + weatherIcon + ".png")
            dayWeather.append(icon);
            //round high & low temps to whole numbers
            dayWeather.append(Math.floor(maxTemp) + "° ");
            dayWeather.append(Math.floor(minTemp) + "° ");

            weatherDisplay.append(dayWeather);

        }

    });

}
//on click search function to display weather to browswer
$("#search-button").on("click", function (event) {
    event.preventDefault();
    displayWeather();
});
