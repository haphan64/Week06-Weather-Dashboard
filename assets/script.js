var cacheKey = 'knownCities';

// Get starting data from local storage

var cities = JSON.parse(localStorage.getItem(cacheKey));
    
console.log(cities);

// localStorage.clear(cities);

if ( ! cities) {

    cities = {};   

}

// Start

$("#search").on("click",function () {

    city = $("#cityInput").val();
    
    
    fetchWeather (city);

});

function searchByCity (city) {

    $("#cityInput").val(city);

    $("#search").click();

}

$("body").on("click", '.searched-cities', function () {

    console.log('test');
    searchByCity ($(this).text());      
    
});


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

        
        cities[response.name] = {
            "name": response.name,
            "temp": Math.round(((parseInt(response.main.temp) - 273.15) * 1.80 + 32)*10)/10,
            "humidity": response.main.humidity,
            "windSpeed": response.wind.speed,
            "icon": response.weather[0].icon,
            "lon": response.coord.lon,
            "lat": response.coord.lat
            };
        

        console.log("Print cities");
        console.log(cities);
        console.log(response.weather[0].icon);
        console.log(JSON.stringify( cities));
        console.log("Print cities end");

        localStorage.setItem(cacheKey, JSON.stringify( cities));       

        displayWeather(response);

        fetchUV (response.coord);

        fetchForecast (city);

        console.log(cities);
    });

}

// Display
function displayWeather (cityData) {

    console.log("displayWeather");
    console.log(cityData);

    var temp = Math.round(((parseInt(cityData.main.temp) - 273.15) * 1.80 + 32)*10)/10
    $("#cityData").empty();
    

    $("#cityData").append("<h3>" + cityData.name + " (" + moment().format('l') + ")" + "<img src = " + "https://openweathermap.org/img/wn/" + cityData.weather[0].icon + "@2x.png>" + "</h3>")
    // $("#cityData").append("<img src = " + "https://openweathermap.org/img/wn/" + cityData.weather[0].icon + "@2x.png>")    
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

    console.log("displayUV");

    var uvi = $("<span>");

    uvi.attr("id","uvi-index");

    uvi.attr("class","badge text-white");

    var uviValue = Number(response.value);

    console.log(Number(response.value));

    if (uviValue <=2 ) {

        uvi.attr("id","low");
        
    } else if ( uviValue <= 5 ) {

        uvi.attr("id","moderate");

    } else if ( uviValue <= 7 ) {

        uvi.attr("id","high");

    } else if ( uviValue <= 10 ) {

        uvi.attr("id","very-high");

    } else { uvi.attr("id","extreme");}


    uvi.text("UV Index: " + response.value)

    $("#cityData").append(uvi)
    
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

            var date = moment(response.list[i].dt_txt).format('l');
            var tempFValue = Math.round(((parseInt(response.list[i].main.temp) - 273.15) * 1.80 + 32)*10)/10;
            var humidityFValue = response.list[i].main.humidity;
            var iconF = response.list[i].weather[0].icon;                       
               
            if ( date in forecastData) {   
                
                console.log("Date in object?" + date in forecastData);
                                
                forecastData[date].tempF.push(tempFValue);
                forecastData[date].humidityF.push(humidityFValue);
                console.log("iconF: " +  response.list[i].weather[0].icon);

            } else if (Object.keys(forecastData).length < 5){
                                
                forecastData[date] = {'tempF':[],'humidityF':[],'icon': ""};
                forecastData[date].tempF.push(tempFValue);
                forecastData[date].humidityF.push(humidityFValue);
                forecastData[date].icon = iconF;
                console.log("iconF: " +  response.list[i].weather[0].icon);

            }

                        
        }

               
        displayForecast (forecastData)            
             

    });

}

// Display Forecast
function displayForecast (forecastData) {

    $("#forecast").empty();

    for ( i = 0; i < Object.keys(forecastData).length; i++ ) {
        
        var dateData = $("<div>");
        dateData.addClass("card bg-primary text-white");                          
              

        var dateF = Object.keys(forecastData)[i];
        if (moment().format('l') != dateF) {
            
            dateData.append("<h5>" + dateF + "</h5>");
            // dateData.append("<p>" + avgTempF + "</p>");
            
            $("#forecast").append(dateData);

        }


        dateData.append("<img src = " + "https://openweathermap.org/img/wn/" + forecastData[dateF].icon + "@2x.png>");

        console.log("Average Temp + Humidity");


        // Average Temp for each day
        var tempFdata = forecastData[dateF].tempF;

        var totalTempF = 0;

        for(var t = 0; t < tempFdata.length; t++) {
            totalTempF += tempFdata[t];
        }

        var avgTempF = Math.round((totalTempF / tempFdata.length)*100)/100;

        console.log("avg Temp:" + avgTempF);

        dateData.append("<p>" + "Temp: " + avgTempF + " °F" + "</p>");



        // Average Humidity for each day
        var humidityFdata = forecastData[dateF].humidityF;

        var totalHumidityF = 0;

        for(var h = 0; h < humidityFdata.length; h++) {
            totalHumidityF += humidityFdata[h];
        }

        var avgHumidityF = Math.round(totalHumidityF / humidityFdata.length);
       

        dateData.append("<p>" + "Humidity: " + avgHumidityF + " %" + "</p>");


                    
    }

    console.log(Object.values(forecastData));

  
}

// Add new city

function addNewCity ( city ) {

    console.log (" Add New City")
    
    if (cities.indexOf(city) < 0 ) {

        console.log (" Add New City")

        cities.push(city);

        // cities[city] = {};

        localStorage.setItem (cacheKey, JSON.stringify( cities));
        
        console.log(cities);

    };

}

function displayCities (cities) {

    console.log("cities");
    console.log(cities);

    console.log(Object.keys(cities));

    $("#knownCities").empty();

    for (i = 0; i < Object.keys(cities).length; i++ ) {

        var knownCities = $("<button>");

        knownCities.addClass("btn-block searched-cities");
        
        knownCities.text(Object.keys(cities)[i]);
        
        $("#knownCities").append(knownCities);

    }

    var lastCity = Object.keys(cities)[Object.keys(cities).length - 1];

    searchByCity (lastCity);

}



// searchWeather ($("#cityInput").val());

displayCities (cities);
