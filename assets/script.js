var cacheKey = 'knownCities';

// Get starting data from local storage

var cities = JSON.parse(localStorage.getItem(cacheKey));

console.log(cities);

if ( ! cities) {

    cities = [];   

}

// Start
function searchWeather ( city ) {

    $("#search").on("click",function () {

        fetchWeather ($("#cityInput").val())
    
    });

    console.log(city);

    
    addNewCity (city);

    // fetchWeather (city);

}

// Current weather API
function fetchWeather ( city ) {

    var  queryParams = $.param ({
        q: city,
        appid: "38de077e0549347b184b65ca263020d2"
    })
           
    queryUrl = "https://api.openweathermap.org/data/2.5/weather?" + queryParams;

    console.log(queryUrl);

        
    $.ajax({
        
        url: queryUrl,
        method: "GET"
        
    }).then(function (response) {

        cities[city] = {

            name: response.name,
            temp: Math.round(((parseInt(response.main.temp) - 273.15) * 1.80 + 32)*10)/10,
            humidity: response.main.humidity,
            windSpeed: response.wind.speed,
            lon: response.coord.lon,
            lat: response.coord.lat
            
        };

        console.log(response);

        localStorage.setItem(cacheKey, JSON.stringify( cities));

        displayCities (cities);

        displayWeather(response);

        fetchUV (response.coord);

        fetchForecast (city);

        
    });

}

// Display
function displayWeather (cityData) {

    // var cityData = fetchWeather(city);

    console.log(cityData);

    var temp = Math.round(((parseInt(cityData.main.temp) - 273.15) * 1.80 + 32)*10)/10
    $("#cityData").empty();
    

    $("#cityData").append("<h3>" + cityData.name + " (" + moment().format('l') + ")" + "</h3>")
    $("#cityData").append("<p>" + "Temperature: " + temp + " °F" + "</p>")
    $("#cityData").append("<p>" + "Humidity: " + cityData.main.humidity + "%" + "</p>")
    $("#cityData").append("<p>" + "Wind Speed: " + cityData.wind.speed + " MPH" + "</p>")  

}

// UV Index API
function fetchUV (coord) {

    var  queryParams = $.param ({
        lon: coord.lon,
        lat: coord.lat,
        appid: "38de077e0549347b184b65ca263020d2",
         
    })

    console.log(coord.lon);
    console.log(coord.lat);
           
    queryUrl = "https://api.openweathermap.org/data/2.5/uvi?" + queryParams;

    console.log(queryParams);

        
    $.ajax({
        
        url: queryUrl,
        method: "GET"
        
    }).then(function (response) {

        console.log("UVI");
        console.log(response);
        console.log(response.value);

        displayUV(response);

    });
};

// Display UV
function displayUV (response) {

    $("#cityData").append("<p>" + "UV Index: " + response.value + "</p>")
    
}

// Forecast API
function fetchForecast (city) {

    var  queryParams = $.param ({
        q: city,        
        appid: "38de077e0549347b184b65ca263020d2"
    })
           
    queryUrl = "https://api.openweathermap.org/data/2.5/forecast?" + queryParams;

    console.log(city);

    console.log(queryParams);

        
    $.ajax({
        
        url: queryUrl,
        method: "GET"
        
    }).then(function (response) {
        
        console.log(response);
        var forecastData = {};

        for (i = 0; i < response.list.length; i++) {

            console.log(response.list[i].dt_txt);
            console.log(response.list[i].main.temp);
            console.log(response.list[i].main.humidity);

            var date = moment(response.list[i].dt_txt).format('l');
            var tempFValue = Math.round(((parseInt(response.list[i].main.temp) - 273.15) * 1.80 + 32)*10)/10;
            var humidityFValue = response.list[i].main.humidity;
            
            
               
            if ( date in forecastData) {   
                
                console.log("Date in object?" + date in forecastData);
                                
                forecastData[date].tempF.push(tempFValue);
                forecastData[date].humidityF.push(humidityFValue);

            } else {
                                
                forecastData[date] = {'tempF':[],'humidityF':[]};
                forecastData[date].tempF.push(tempFValue);
                forecastData[date].humidityF.push(humidityFValue);

            }

            

            
        }

        console.log (forecastData);
        console.log(Object.values(forecastData));
        
        console.log(Object.keys(forecastData));
   

        $("#forecast").empty();

        for ( i = 0; i < Object.keys(forecastData).length; i++ ) {
            
            var dateData = $("<div>");
            dateData.addClass("card");

            var dateF = Object.keys(forecastData)[i];
            
            if (moment().format('l') != dateF) {
                
                dateData.append("<h5>" + dateF + "</h5>");

                
                $("#forecast").append(dateData);

            }

           
        }

       

    });

}

// Display Forecast
function displayForecast (cityData) {



}

// Add new city

function addNewCity ( city ) {

    console.log (" Add New City")
    
    if (cities.indexOf(city) < 0 ) {

        console.log (" Add New City")

        cities.push(city);

        localStorage.setItem (cacheKey, JSON.stringify( cities));

    };

}

function displayCities (cities) {

    console.log(cities);

}



// searchWeather ($("#cityInput").val());
searchWeather ($("#cityInput").val());

