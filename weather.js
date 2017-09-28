var backgroundObject = null;
var helper = new DateTimeHelper();

$(document).ready(function() {
	/*Loading resources*/
	$.getJSON("conditions.json", function(json) {
		backgroundObject = json;
	});

	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
			getLocalWeather(pos.coords.latitude+','+pos.coords.longitude);
	});
    }
	else {
        getLocalWeather('Szczecin');
    }

	$("#locationText").on("dblclick", function() {
		$("#locationInput").prop("placeholder", "city, [region], [country] ...");
		$("#locationInput").removeClass("hidden-xs-up");
		$("#locationText").addClass("hidden-xs-up");

		$("#locationInput").keydown(function( event ) {
			if ( event.which == 13 ) {
				event.preventDefault();

				if ($("#locationInput").prop("value") == "") {
					$("#locationInput").addClass("hidden-xs-up");
					$("#locationText").removeClass("hidden-xs-up");
					return;
				}

				var isValid = getLocalWeather($("#locationInput").prop("value"));

				if (isValid == false) {
					return;
				}

				$("#locationInput").addClass("hidden-xs-up");
				$("#locationText").removeClass("hidden-xs-up");
			}
		});
	});
});

function getLocalWeather(location, woeid) {
	isSuccess = false;

	$.simpleWeather({
    location: location,
    woeid: woeid,
    unit: 'c',
    success: function(weather) {
		var updated = moment(helper.trimDate(weather.updated));
		var updatedText = updated.format("DD.MM.YYYY (HH:mm)");

		var sunrise = new helper.customTime(weather.sunrise);
		sunrise = moment({ hour:sunrise.hours, minute:sunrise.minutes });
		sunrise = sunrise.format("HH:mm");

		var sunset = new helper.customTime(weather.sunset);
		sunset = moment({ hour:sunset.hours, minute:sunset.minutes });
		sunset = sunset.format("HH:mm");

		$("#locationText").text(weather.city + ", " + weather.region + ", " + weather.country);
		$("#updatedText").text(updatedText);
		$("#sunriseText").text("sunrise: " + sunrise);
		$("#sunsetText").text("sunset: " + sunset);

		var tempCode = "min: " + weather.low + " " + weather.units.temp;
		tempCode += " <strong>currently: " + weather.temp;
		tempCode += " " + weather.units.temp + "</strong>";
		tempCode += " max: " + weather.high + " " + weather.units.temp;

		var wind = weather.wind.direction + " " + weather.wind.speed;
		wind += " " + weather.units.speed;

		var otherConditions = " <strong>humidity</strong>: ";
		otherConditions += weather.humidity + " %";
		otherConditions += " <strong>visibility</strong>: ";
		otherConditions += weather.visibility + " " + weather.units.distance;
		otherConditions += " <strong>wind</strong>: " + wind;

		$("#descriptionLine").html("<strong>" + weather.currently + " </strong>");
		$("#tempLine").html(tempCode);
		$("#otherConditions").html(otherConditions);

		var forecast = '';

		for(var i = 1; i < weather.forecast.length - 4; i++) {
			var dayForecast = '<div class="forecast-day">';
			dayForecast += '<p>' + weather.forecast[i].date + '</p>';
			dayForecast += '<img src="' + weather.forecast[i].image + '" ';
			dayForecast += 'class="forecast-image" title="';
			dayForecast += weather.forecast[i].text + '">';
			dayForecast += '<p>min: ' + weather.forecast[i].low + ' ' + weather.units.temp;
			dayForecast += ' max: ' + weather.forecast[i].high + ' ' + weather.units.temp;
			dayForecast += '</p></div>';
			forecast += dayForecast;
		}

		$("#forecastBar").html(forecast);
		var isNight = helper.isNightTime(sunrise, sunset, updated);
		setBackground(weather.currently.toLowerCase(), isNight);

    },
    error: function(error) {
		$("#weather").html('<p>'+error+'</p>');
    }
  });
}

function setBackground(description, isNight) {
	
	if (isNight && isResourceAvailable(description + '_night')) {
		var url = "url('img/" + backgroundObject[description + "_night"];
		url += "')";
		$("#currentSection").css("background-image", url);
	}
	else {
		if (!isResourceAvailable(description)) {
				$("#currentSection").css("background-image", "url('img/woods.png')");
				return;
		}

		var url = "url('img/" + backgroundObject[description];
		url += "')";
		$("#currentSection").css("background-image", url);
	}
}

function isResourceAvailable(key) {
	if (backgroundObject[key])  {
		return true;
	}
	else {
		console.log("Resource for the " + key + " doesn't exist.");
		return false;
	}
}
