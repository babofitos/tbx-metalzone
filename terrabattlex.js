// ==UserScript==
// @name        metal zone
// @namespace   https://github.com/babofitos/tbx-metalzone.git
// @include     http://www.terrabattlex.com/
// @version     1.1
// @grant       none
// ==/UserScript==
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var timer = setInterval(checkScheduleLoad, 500);

function checkScheduleLoad() {
  var schedule = document.querySelector('#metal_zone_schedule');
  if (schedule.innerHTML !== 'Loading...') {
    clearInterval(timer);
    main();
  }
}

function main() {
  var tbody = document.querySelector('#metal_zone_schedule table tbody');
  var trs = tbody.children;
  var tdNodes = [];

  for (var i = 0; i < trs.length; i++) {
    var tr = trs[i];
    var tds = tr.children;
    
    for (var j = 1; j < tds.length; j++) {
      var td = tds[j];

      tdNodes.push(td);
    };
  };

  tdNodes.forEach(setColor);
}

function convertNumToDay(day) {
  return days[day];
}

function convert12Hour(hour) {
  return ((hour + 11) % 12 + 1);
}

function calcPeriod(hour) {
  if (hour >= 0 && hour < 12) {
    return 'AM';
  } else {
    return 'PM';
  }
}

function calcNextDay(dayIndex) {
  dayIndex += 1;
  
  return dayIndex % days.length;
}

function isNextDay(hour) {
  return hour === 0;
}

function calcNextHour(hour) {
  hour += 1;
  
  return hour % 24;
}

function setColor(td) {
  var html = td.innerHTML;
  var zoneTime = html;
  var date = new Date();

  var hour = date.getHours();
  var current12Hour = convert12Hour(hour);
  var period = calcPeriod(hour);
  var day = convertNumToDay(date.getDay());

  var nextHour = calcNextHour(hour);
  var next12Hour = convert12Hour(nextHour);
  var nextPeriod = calcPeriod(nextHour);
  var nextDay = isNextDay(nextHour) ? convertNumToDay(calcNextDay(date.getDay())) : day;
  
  var timeAndPeriod = day + ', ' + current12Hour + period;
  var nextTimeAndPeriod = nextDay + ', ' + next12Hour + nextPeriod;

  if (zoneTime == timeAndPeriod) {
    td.style.color = 'green';
  } else if (zoneTime == nextTimeAndPeriod) {
    td.style.color = 'rgb(204, 204, 0)';
  }

}
