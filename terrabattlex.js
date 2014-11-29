// ==UserScript==
// @name        metal zone
// @namespace   https://github.com/babofitos/tbx-metalzone.git
// @include     http://www.terrabattlex.com/
// @version     1
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

function convertHour(hour) {
  if (hour > 12) {
    hour = hour - 12;
    return hour.toString() + 'PM';
  } else {
    return hour.toString() + 'AM';
  }
}

function calcNextHour(dayAndHour) {
  var day = dayAndHour[0];
  var hourAndPeriod = separateHourFromPeriod(dayAndHour[1]);
  var hour = hourAndPeriod[0];
  var period = hourAndPeriod[1];

  hour = calc24Hour(hour, period);
  hour += 1;
  period = calcPeriod(hour, period);
  if (hour == 24) {
    hour = 12;
    dayAndHour[0] = days[loopDay(days.indexOf(day))];
  } else if (hour > 23) {
    hour -= 24;
    dayAndHour[0] = days[loopDay(days.indexOf(day))];
  } else if (hour > 12) {
    hour -= 12;
  } 
  dayAndHour[1] = hour.toString() + period;

  return dayAndHour;
}

function calc24Hour(hour, period) {
  if (period == 'PM') {
    hour += 12;
  
  }
  return hour;
}

function calcPeriod(hour, period) {
  if (hour == 12 || hour == 24) {
    period = period == 'AM' ? 'PM' : 'AM';
  }

  return period;
}

function separateHourFromPeriod(hourAndPeriod) {
  var divider = hourAndPeriod.indexOf('A');
  divider = divider > -1 ? divider : hourAndPeriod.indexOf('P');
  
  var hour = +hourAndPeriod.slice(0, divider);
  return [hour, hourAndPeriod.slice(divider)];
}

function loopDay(dayIndex) {
  dayIndex += 1;

  if (dayIndex == days.length) {
    return 0;
  }
  return dayIndex;
}

function getCurrentTime() {
  var date = new Date();
  var day = convertNumToDay(date.getDay());
  var hour = convertHour(date.getHours());

  return [day, hour];
}

function parseTime(time) {
  var both = time.split(',');
  both[1] = both[1].trim();

  return both;
}

function setColor(td) {
  var html = td.innerHTML;
  var zoneTime = parseTime(html);
  var current = getCurrentTime();
  var copyCurrent = current.slice(0);
  var nextHour = calcNextHour(copyCurrent);

  if ((zoneTime[0] == current[0]) && (zoneTime[1] == current[1])) {
    td.style.color = 'green';
  } else if ((zoneTime[0] == nextHour[0]) && (zoneTime[1] == nextHour[1])) {
    td.style.color = 'rgb(204, 204, 0)';
  }

}