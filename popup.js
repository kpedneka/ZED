function getInfo(info) {
    //this is the calendar initialization
    var cal = ics();

    //if there is data that was sent back
    if (info != null) {
        for (var i = 0; i < info.length; i++) {    
            console.log(info[i]);
            //we want to break up the time string           
            var times = info[i].shiftTime;
            times = times.replace(' ', '');
            eventTime = times.split("-");

            //do stuff to get the time in the right format for ics.js
            var st = info[i].day+" "+eventTime[0];
            var et = info[i].day+""+eventTime[1];
            if(st.charAt(st.length-2) == 'P' && et.charAt(et.length-2) == 'A')
            {
                var tomorrow = new Date(info[i].day);
                tomorrow.setDate(tomorrow.getDate() + 1);
                var dd = tomorrow.getDate();
                var mm = tomorrow.getMonth() + 1;
                var yyyy = tomorrow.getFullYear();

                et = mm + '/'+ dd + '/'+ yyyy+eventTime[1];

                //console.log(et);
            }
            //end product, good for ics.js
            startTime = st.substring(0, st.length-2)+" "+st.substring(st.length-2, st.length);
            endTime = et.substring(0, et.length-2)+" "+et.substring(et.length-2, et.length);
            
            //console.log(info[i].day+", "+info[i].places+", "+startTime+", "+endTime);
            cal.addEvent(info[i].places, "You have a shift", "OIT Labs", startTime, endTime);
        }

     document.getElementById('data').textContent = 'Success';
	 document.getElementById('data').className = 'glyphicon glyphicon-ok-sign';
	 document.getElementById('clicky').className = "btn btn-success";
    cal.download("Week of "+info[0].day+" work schedule");
    }
    //if info is null, then it will print failed
    else {
        document.getElementById('data').textContent = 'Failed. No shifts here?';
		document.getElementById('clicky').className = "btn btn-danger";
    }
}

function start () {
    chrome.tabs.query({
            currentWindow: true,
            active: true
        }, 
        function(tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup'},
        getInfo);
        });

}
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("clicky").addEventListener('click', start);
    });