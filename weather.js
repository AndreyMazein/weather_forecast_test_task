$(document).ready(function(){

    var currentWeatherInformation = {};
    var listOfCities = [];

    $("#addCityButton").click(function() {
        var cityName = $("#inputCityName").val();
        //console.log(cityName);
        getCityWeatherInformation(cityName);
        $("#inputCityName").val("");

    });

    $("#cityList").click(function (event) {

        var target = event.target;

        if(target.tagName == 'SPAN'){
            var nameOfDeletedCity = target.parentNode.parentNode.childNodes[0].innerHTML;
            target.parentNode.parentNode.remove();

            for(var i =0; i<listOfCities.length; i++){
                if(listOfCities[i].name==nameOfDeletedCity)break;
            }
            listOfCities.splice(i,1);
            return;
        }

        while (target != this) {
            if (target.tagName == 'TD' ) {
                var nameOfCity = target.parentNode.childNodes[0].innerHTML;
                getCityWeatherInformation(nameOfCity)
            }
            return;
        }
        target = target.parentNode;
    });

    $("#day1").click(function() {openTab(event, 'day1Tab')});
    $("#day2").click(function() {openTab(event, 'day2Tab')});
    $("#day3").click(function() {openTab(event, 'day3Tab')});
    $("#day4").click(function() {openTab(event, 'day4Tab')});
    $("#day5").click(function() {openTab(event, 'day5Tab')});


    function getCityWeatherInformation(cityName) {

        $.ajax({
            type: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/forecast?q='+ cityName + '&units=metric&APPID=3ae403324a57d7d8c19c25a3b891b1b7',
            dataType: "jsonp",
            callbackParameter: 'callback',
            timeout: 4000,

            success: function (data) {
                currentWeatherInformation = data;
                swhowWeatherOfCurrentCity();
                addNewCityToTheList();
            },

            error: function (jqXHR, textStatus) {
                alert("You've entered inexistent city, please try again");
                $("#loadGif").css("display","none");
            },

            beforeSend: function () {
                $("#loadGif").css("display","block");
            },
        });

    }

    function openTab(evt, cityName) {
        var i, x, tablinks;
        x = document.getElementsByClassName("tab");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < x.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" w3-light-grey", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " w3-light-grey";
    }

    function addNewCityToTheList() {
        var curentCity = {"name": currentWeatherInformation.city.name, "coord":currentWeatherInformation.city.coord};
        if(!inArrayOfCity(curentCity)){
            listOfCities[listOfCities.length] = curentCity;
            $('#cityList').prepend(
                '<tr >'+
                '<td >'+ curentCity.name +'</td>'+
                '<td >(lon:'+ curentCity.coord.lon + ' lat:' +curentCity.coord.lat+ ')</td>'+
                '<td><span class="w3-closebtn">&times;</span></td>'+
                '</tr>'
            );
        }
        function inArrayOfCity(city) {
            for(var j = 0; j<listOfCities.length; j++){
                if(listOfCities[j].name==city.name) return true;
            }
            return false;
        }
    }

    function swhowWeatherOfCurrentCity() {
        //$("#weatherInfo").text(JSON.stringify(currentWeatherInformation.list));
        $("#nameOfCurrentCity").text(currentWeatherInformation.city.name);
        $("#coorOfCurrentCity").text("(lon: " +  currentWeatherInformation.city.coord.lon + ", lat: " + currentWeatherInformation.city.coord.lat+ ")");

        var myWetherInfo = {};
        for(var i =1; i< currentWeatherInformation.list.length ; i++){
            var prevDate = currentWeatherInformation.list[i-1].dt_txt.split(" ")[0];
            var currentDate = currentWeatherInformation.list[i].dt_txt.split(" ")[0];
            //console.log("prevDate:" + prevDate + " currentDate:" + currentDate + " i:" + i);
            if(currentDate!=prevDate) break;
        }
        //console.log(currentWeatherInformation.list.length);
        //console.log("I " + i);
        var breakPoint = i;
        //console.log("BreakPoint " + breakPoint);

        myWetherInfo.day1 = currentWeatherInformation.list.slice(0,breakPoint);
        myWetherInfo.day2 = currentWeatherInformation.list.slice(breakPoint,breakPoint+8);
        myWetherInfo.day3 = currentWeatherInformation.list.slice(breakPoint+8,breakPoint+16);
        myWetherInfo.day4 = currentWeatherInformation.list.slice(breakPoint+16,breakPoint+24);
        myWetherInfo.day5 = currentWeatherInformation.list.slice(breakPoint+24,breakPoint+32);

        //console.log(myWetherInfo);

        $("#day1").text(timeConverter(myWetherInfo.day1[0].dt));
        $("#day2").text(timeConverter(myWetherInfo.day2[0].dt));
        $("#day3").text(timeConverter(myWetherInfo.day3[0].dt));
        $("#day4").text(timeConverter(myWetherInfo.day4[0].dt));
        $("#day5").text(timeConverter(myWetherInfo.day5[0].dt));

        $('#day1weather').remove();
        $('#day2weather').remove();
        $('#day3weather').remove();
        $('#day4weather').remove();
        $('#day5weather').remove();

        $('#day1Tab').append(
            '<table id="day1weather" class="w3-table-all w3-hoverable">'+
            '<thead>'+
            '<tr class="w3-teal">'+
            '<th>Time</th>'+
            '<th>Temperature</th>'+
            '<th>Weather type</th>'+
            '<th>Humidity</th>'+
            '<th>Pressure</th>'+
            '<th>Cloudiness</th>'+
            '<th>Wind speed</th>'+
            '<th>Wind direction</th>'+
            '</tr>'+
            '</thead>'+
            '</table>'
        );

        for (var j=0; j< myWetherInfo.day1.length; j++){
            $('#day1weather').append(
                '<tr >'+
                '<td >'+ myWetherInfo.day1[j].dt_txt.split(" ")[1] +'</td>'+
                '<td >'+ myWetherInfo.day1[j].main.temp +'</td>'+
                '<td >'+ myWetherInfo.day1[j].weather[0].main +'</td>'+
                '<td >'+ myWetherInfo.day1[j].main.humidity +'</td>'+
                '<td >'+ myWetherInfo.day1[j].main.grnd_level +'</td>'+
                '<td >'+ myWetherInfo.day1[j].clouds.all +'</td>'+
                '<td >'+ myWetherInfo.day1[j].wind.speed +'</td>'+
                '<td >'+ myWetherInfo.day1[j].wind.deg +'</td>'+
                '</tr>'
            );
        }

        $('#day2Tab').append(
            '<table id="day2weather" class="w3-table-all w3-hoverable">'+
            '<thead>'+
            '<tr class="w3-teal">'+
            '<th>Time</th>'+
            '<th>Temperature</th>'+
            '<th>Weather type</th>'+
            '<th>Humidity</th>'+
            '<th>Pressure</th>'+
            '<th>Cloudiness</th>'+
            '<th>Wind speed</th>'+
            '<th>Wind direction</th>'+
            '</tr>'+
            '</thead>'+
            '</table>'
        );
        for (var j=0; j< myWetherInfo.day2.length; j++){
            $('#day2weather').append(
                '<tr >'+
                '<td >'+ myWetherInfo.day2[j].dt_txt.split(" ")[1] +'</td>'+
                '<td >'+ myWetherInfo.day2[j].main.temp +'</td>'+
                '<td >'+ myWetherInfo.day2[j].weather[0].main +'</td>'+
                '<td >'+ myWetherInfo.day2[j].main.humidity +'</td>'+
                '<td >'+ myWetherInfo.day2[j].main.grnd_level +'</td>'+
                '<td >'+ myWetherInfo.day2[j].clouds.all +'</td>'+
                '<td >'+ myWetherInfo.day2[j].wind.speed +'</td>'+
                '<td >'+ myWetherInfo.day2[j].wind.deg +'</td>'+
                '</tr>'
            );
        }
        $('#day3Tab').append(
            '<table id="day3weather" class="w3-table-all w3-hoverable">'+
            '<thead>'+
            '<tr class="w3-teal">'+
            '<th>Time</th>'+
            '<th>Temperature</th>'+
            '<th>Weather type</th>'+
            '<th>Humidity</th>'+
            '<th>Pressure</th>'+
            '<th>Cloudiness</th>'+
            '<th>Wind speed</th>'+
            '<th>Wind direction</th>'+
            '</tr>'+
            '</thead>'+
            '</table>'
        );
        for (var j=0; j< myWetherInfo.day3.length; j++){
            $('#day3weather').append(
                '<tr >'+
                '<td >'+ myWetherInfo.day3[j].dt_txt.split(" ")[1] +'</td>'+
                '<td >'+ myWetherInfo.day3[j].main.temp +'</td>'+
                '<td >'+ myWetherInfo.day3[j].weather[0].main +'</td>'+
                '<td >'+ myWetherInfo.day3[j].main.humidity +'</td>'+
                '<td >'+ myWetherInfo.day3[j].main.grnd_level +'</td>'+
                '<td >'+ myWetherInfo.day3[j].clouds.all +'</td>'+
                '<td >'+ myWetherInfo.day3[j].wind.speed +'</td>'+
                '<td >'+ myWetherInfo.day3[j].wind.deg +'</td>'+
                '</tr>'
            );
        }
        $('#day4Tab').append(
            '<table id="day4weather" class="w3-table-all w3-hoverable">'+
            '<thead>'+
            '<tr class="w3-teal">'+
            '<th>Time</th>'+
            '<th>Temperature</th>'+
            '<th>Weather type</th>'+
            '<th>Humidity</th>'+
            '<th>Pressure</th>'+
            '<th>Cloudiness</th>'+
            '<th>Wind speed</th>'+
            '<th>Wind direction</th>'+
            '</tr>'+
            '</thead>'+
            '</table>'
        );
        for (var j=0; j< myWetherInfo.day4.length; j++){
            $('#day4weather').append(
                '<tr >'+
                '<td >'+ myWetherInfo.day4[j].dt_txt.split(" ")[1] +'</td>'+
                '<td >'+ myWetherInfo.day4[j].main.temp +'</td>'+
                '<td >'+ myWetherInfo.day4[j].weather[0].main +'</td>'+
                '<td >'+ myWetherInfo.day4[j].main.humidity +'</td>'+
                '<td >'+ myWetherInfo.day4[j].main.grnd_level +'</td>'+
                '<td >'+ myWetherInfo.day4[j].clouds.all +'</td>'+
                '<td >'+ myWetherInfo.day4[j].wind.speed +'</td>'+
                '<td >'+ myWetherInfo.day4[j].wind.deg +'</td>'+
                '</tr>'
            );
        }
        $('#day5Tab').append(
            '<table id="day5weather" class="w3-table-all w3-hoverable">'+
            '<thead>'+
            '<tr class="w3-teal">'+
            '<th>Time</th>'+
            '<th>Temperature</th>'+
            '<th>Weather type</th>'+
            '<th>Humidity</th>'+
            '<th>Pressure</th>'+
            '<th>Cloudiness</th>'+
            '<th>Wind speed</th>'+
            '<th>Wind direction</th>'+
            '</tr>'+
            '</thead>'+
            '</table>'
        );
        for (var j=0; j< myWetherInfo.day5.length; j++){
            $('#day5weather').append(
                '<tr >'+
                '<td >'+ myWetherInfo.day5[j].dt_txt.split(" ")[1] +'</td>'+
                '<td >'+ myWetherInfo.day5[j].main.temp +'</td>'+
                '<td >'+ myWetherInfo.day5[j].weather[0].main +'</td>'+
                '<td >'+ myWetherInfo.day5[j].main.humidity +'</td>'+
                '<td >'+ myWetherInfo.day5[j].main.grnd_level +'</td>'+
                '<td >'+ myWetherInfo.day5[j].clouds.all +'</td>'+
                '<td >'+ myWetherInfo.day5[j].wind.speed +'</td>'+
                '<td >'+ myWetherInfo.day5[j].wind.deg +'</td>'+
                '</tr>'
            );
        }

        $("#mainDiv").css("display","block");
        $("#loadGif").css("display","none");

        function timeConverter(UNIX_timestamp){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var month = months[a.getMonth()];
            var date = a.getDate();
            return date + " " + month;
        }
    }

});