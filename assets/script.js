var cacheKey = 'weatherByCity';

// Get starting data from local storage

var citiesStore = JSON.parse(localStorage.getItem(cacheKey));

if ( ! citiesStore) {

    citiesStore = {};   

}

// Display city's data
function renderCityData (city) {

    console.log(city)

    var cityData = getCityData(city);

    if ( ! cityData) {

        console.log("return");

        return;
                
    }

    // Render the data to the html

    console.log(cityData);
    console.log("render html")

}


// Get cities data
function getCityData (city) {

    if ( citiesStore[city]) {

        return citiesStore[city];

    } else {

        fetchCityData (city);

        return false;

    }
    
}



// Fetch new data from the API
function fetchCityData (city) {

    var APIkey = "&appid=38de077e0549347b184b65ca263020d2",
        url = "https://api.openweathermap.org/data/2.5/weather?q=",
        cityName = "Santa Rosa,California",
        
        queryUrl = url + cityName + APIkey;
        console.log(queryUrl);

        
    $.ajax({
        
        url: queryUrl,
        method: "GET"
        
    }).then(function (response) {

        citiesStore[city] = {

            name: response.city.name,
            temp: response.list[0].main.temp,

        };

        console.log(response);

        localStorage.setItem(cacheKey, JSON.stringify( citiesStore));

        renderCityData (city);

    });


}

renderCityData ('Santa Rosa, CA')