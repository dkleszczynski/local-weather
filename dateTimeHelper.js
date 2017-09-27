var DateTimeHelper = function() {
    this.trimDate = function(date) {
    	var arr = date.split(" ");
    	arr.pop();
    	return arr.join(" ");
    }

    this.customTime = function(string) {
    	var separators = [':', ' '];
    	var arr = string.split(new RegExp(separators.join('|'), 'g'));
    	this.hours = Number(arr[0]);
    	this.minutes = Number(arr[1]);

    	if (arr[2] == "pm") {
    		this.hours += 12;
    	}
    }

    this.isNightTime = function(sunrise, sunset, currentTime) {
    	var sunriseHours = extractHours(sunrise);
    	var sunsetHours = extractHours(sunset);
    	var currentHours = extractHours(currentTime);

    	if (currentHours < sunriseHours || currentHours > sunsetHours) {
    		return true;
    	}
    	else {
    		return false;
    	}
    }

    function extractHours(text) {
    	/*Extracts hours and minutes and converts to hours
    		1. Split by ' '
    		2. Find string in an array containing :
    		3. Split this element by :
    		4. Count hours from hours and minutes
    	*/

    	var text = String(text);
    	var arr = text.split(' ');
    	var index = arr.findIndex(function(string) {
    		if (string.includes(':')) {
    			return true;
    		}
    		else {
    			return false;
    		}
    	});

    	var timeArr = arr[index].split(':');
    	return parseInt(timeArr[0]) + parseInt(timeArr[1]) / 60;
    }
}
