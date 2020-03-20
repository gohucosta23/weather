

// get the weather api Key
// setup variables
// setup ajax call
// break down functions
// get the city input from HTML
// get search button from HTML
// Dynamically create cards to display weather

window.onload = function(){


    const searchHistory = 5;
    var date = moment().format("L");
    var apiKey = "506386d3ffc6a9ccad173225d3669b28";
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?&appid=" + apiKey;
    var cities = JSON.parse(localStorage.getItem("cities")) || [];

    if (cities &&  cities.length > 0) {
        while (cities.length > searchHistory) {
            cities.shift();
        }

        search(cities[cities.length - 1]);
    }


    function getWeather() {

       
        $.ajax({

            url: queryURL,
            method: "GET"

        })
            .then(function (response) {
                
                $("#weatherDisplay").empty(); 
        

                var iconcode = response.weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                var uvLat = response.coord.lat;
                var uvLon = response.coord.lon;
                uvIndex(uvLon, uvLat);

                var weatherDisplay = $("<div>");
                weatherDisplay.attr("id", "weather");

                $("#weatherDisplay").append(weatherDisplay);
                $("#weather").append(
                    "<h2>" + response.name + "  (" + date + ") <img src =" + iconurl + "></h2>",
                    "<h3><strong>Temperature : " + ((response.main.temp - 273.15) * 1.8 + 32).toFixed(0) + "&#176;F</strong></h3>",
                    "<h4><strong>Wind Speed : " + response.wind.speed + " mph</strong></h4>",
                    "<h4><strong>Humidity : " + response.main.humidity + "%</strong></h4>",
                    "<h4 id='uvindex'></h4>"

                );

            })
    }

    function search(city) {
        
        queryURL = "http://api.openweathermap.org/data/2.5/weather?&appid=" + apiKey + "&q=" + city;  
        
               
        getWeather();
        fiveDay(city);    
        renderCities();
        city = "";
    }

    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        var city = $("#citySearch").val().trim();
        
        if(city != null){
            
            cities.push(city);
            while (cities.length > searchHistory) {
                cities.shift();
            }
    
            localStorage.setItem("cities",JSON.stringify(cities));
        }

        search(city);
    })

    function renderCities() {

        $("#searchResults").empty();
       

        for (var i=0; i < cities.length; i++){            
            
            var savedCities = $("<button>");
            savedCities.attr("class", "savedCities");
            savedCities.attr("data-name", cities[i]);
            $("#searchResults").prepend(savedCities);
            savedCities.text(cities[i]);
            
        }
              
    }
    $(document).on("click", ".savedCities", function(){
        console.log("clicked");
        city = $(this).attr("data-name");
        search(city);
    })
    

    function uvIndex(uvLon, uvLat) {
        var queryUVURL = "http://api.openweathermap.org/data/2.5/uvi?appid=15e701943db0eab65638c75f992c9b15&lat=" + uvLat + "&lon=" + uvLon;

        $.ajax({

            url: queryUVURL,
            method: "GET"

        })
            .then(function (response) {

                
                var UV = response.value;
                $("#uvindex").text("UV Index : " + UV);
                if (UV < 3) {
                    $("#uvindex").css("backgroundColor", "green");
                }
                if (UV > 3 && UV < 6) {
                    $("#uvindex").css("backgroundColor", "yellow");
                }
                if (UV > 6 && UV < 8) {
                    $("#uvindex").css("backgroundColor", "orange");
                }
                if (UV > 8 && UV < 11) {
                    $("#uvindex").css("backgroundColor", "red");
                }
                if (UV > 11) {
                    $("#uvindex").css("backgroundColor", "purple");
                }

            })
    }
    function fiveDay(city) {

        var fiveDayQuery = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

        $.ajax({

            url: fiveDayQuery,
            method: "GET"
        })
            .then(function (response) {

                $("#futureDisplay").empty();
                

                for (var i = 7; i < response.list.length; i += 8) {

                    var iconcode = response.list[i].weather[0].icon;
                    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

                    
                    var fiveDayDisplay = $("<div>");
                    fiveDayDisplay.attr("id", "futureDisplay" + i);
                    fiveDayDisplay.addClass("rounded");

                    var temp = response.list[i].main.temp;
                    var humidity = response.list[i].main.humidity;
                    var dates = response.list[i].dt_txt.substring(0,10);
                    var date = new moment(dates);
                    var formatedDate = date.format("MM/DD/YYYY");
                   

                    $("#futureDisplay").append(fiveDayDisplay);
                    $("#futureDisplay" + i).append(
                        "<h4>" + formatedDate + "</h4>",
                        "<h2><img src =" + iconurl + "></h2>",
                        "<h4>Temp: " + ((temp - 273.15) * 1.8 + 32).toFixed(0) + "&#176;F</h4>",
                        "<h4>Humidity: " + humidity + "%</h4>"
                        
                    )
                   
                }

            })

    }
    
}


    


