// Listen for messages
//document.addEventListener('DOMContentLoaded');

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
	var userInfo = document.getElementsByClassName("user-info");
	var user = userInfo[0].childNodes[2].textContent;
	user = user.replace(/\W+/g, "");
	console.log("This schedule is for "+user);
	
	//times and locations are the shift information
	var shiftDates = document.getElementsByTagName("th"); //tr columns (calendar dates)
	var shiftDays = document.getElementsByClassName("scheduleColumn"); //td columns
	var times = document.getElementsByClassName("startTime"); //shift begin-end
	var locations = document.getElementsByClassName("scheduleTitle"); //shift location
	var year = document.getElementsByClassName("calendar-title")[0].innerText;
	var hasFollowUp = document.getElementsByClassName("scheduleShiftHasPreceding"); //second part of overnight shifts
	
	var arr = [];

	//these two loop variables will be separate from the for loops
	var timeloop = 0;
    var locloop = 0;

	if (times.length != locations.length){
		alert("The number of shift times and the number of locations do not match!")
	}
	//less than 7 because this goes through the columns for the schedule table
	for (var i = 0; i < 7; i++) {
		//this bit converts date from long to short format
		year = year.substring(year.length-5, year.length);
		var temp = shiftDates[i].innerText +" "+year;
		var date = new Date(temp);
		var month = date.getMonth() + 1
	    var day = date.getDate();
	    var shortDate = month + "/" + day + "/" + year;  
		
		//for every day where there is a shift, get that info
		for (var j = 0; j < shiftDays[i].children.length; j++) {			
			//hopefully this if statement fixes overnights			
			if (shiftDays[i].children[j].classList.contains("scheduleShiftHasPreceding"))
			{
				continue;
			}
			//do check for covered by someone else
			var locationSplit = locations[locloop].innerText;
			locationSplit = locationSplit.split(" ");
			console.log(locationSplit.length);
			if(locationSplit.length != 1) {
				console.log("comparing "+user+" to "+locationSplit[locationSplit.length-1]);
				if (user.localeCompare(locationSplit[locationSplit.length-1]) != 0)
				{
					locloop++;
					timeloop++;
					continue;
				}
			}
		
			arr.push({
    		day: shortDate,
    		shiftTime: times[timeloop].innerText,
    		places: locations[locloop].innerText
    		});
			
			//console.log(shortDate+ " "+times[timeloop].innerText+" "+locations[locloop].innerText);
    		timeloop++;
    		locloop++;    		
		}	
	}
	//if no shifts, return null so that we can prevent errors
	if (arr.length === 0){
	alert("returning null");
	arr = null;
	}
	//double checking to see if message is from popup
	if (msg.from === 'popup') {
		response(arr);
	}
    });

