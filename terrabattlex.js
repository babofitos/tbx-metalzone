// ==UserScript==
// @name        metal zone
// @namespace   https://github.com/babofitos/tbx-metalzone.git
// @include     http://www.terrabattlex.com/
// @version     1.3
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

  [].map.call(trs, function(tr) {
    return [].map.call([].slice.call(tr.children, 0), function(td) {
      return td;
    })
  }).reduce(function(a, b) {
    return a.concat(b)
  }).forEach(setColor);

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

function formatDayTime(date) {
  var hour = date.getHours();
  var current12Hour = convert12Hour(hour);
  var period = calcPeriod(hour);
  var day = convertNumToDay(date.getDay());

  return day + ', ' + current12Hour + period;
}

function calcNextDate(date) {
  return new Date(date.getTime() + 3600000);
}

function setColor(td) {
  var html = td.innerHTML;
  var zoneTime = html;

  var date = new Date();
  var nextDate = calcNextDate(date);

  var timeAndPeriod = formatDayTime(date);
  var nextTimeAndPeriod = formatDayTime(nextDate);

  if (zoneTime == timeAndPeriod) {
    td.style.color = 'green';
  } else if (zoneTime == nextTimeAndPeriod) {
    td.style.color = 'rgb(204, 204, 0)';
  }
}
