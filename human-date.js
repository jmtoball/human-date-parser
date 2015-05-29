var moment = require('moment');

function normalizeString(dateString) {
  // Lowercase
  dateString = dateString.toLowerCase();
  // Normalize whitespace
  dateString = dateString.replace(/\s+/mg, ' ');
  return dateString;
}

module.exports = Object.create({
  parse: function (dateString, relativeTo) {
    if (typeof relativeTo === 'undefined') {
      relativeTo = moment();
    }
    var date = this.parseDate(dateString, relativeTo);
    var dateWithTime = this.parseTime(dateString, date);
    return dateWithTime;
  },

  parseRelativeWeekDays: function (dateString, relativeTo) {
    var weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    var currentIdx = relativeTo.day() - 1;
    var sign = 1;
    for (targetIdx = 0; targetIdx < weekDays.length; targetIdx++) {
      var weekDay = weekDays[targetIdx];
      if (dateString.match("last " + weekDay)) {
        sign = -1;
        weekDays = weekDays.reverse();
      }
      if (dateString.match(weekDay)) {
        var targetIdx = weekDays.indexOf(weekDay);
        if (targetIdx == currentIdx) {
          return sign * weekDays.length;
        } else if (targetIdx > currentIdx) {
          return sign * (targetIdx - currentIdx);
        } else {
          return sign * (weekDays.length - (targetIdx - currentIdx));
        }
      }
    }
    return 0;
  },

  parseRelativeDates: function (dateString, relativeTo, diff) {
    diff.days += this.parseRelativeWeekDays(dateString, relativeTo);
    // TODO: DRY
    if (dateString.match("tomorrow")) {
      diff.days += 1;
    }
    if (dateString.match("the day after")) {
      diff.days += 1;
    }
    if (dateString.match("the day before")) {
      diff.days -= 1;
    }
    if (dateString.match("yesterday")) {
      diff.days -= 1;
    }
    if (dateString.match("last year")) {
      diff.years = -1;
    }
    if (dateString.match("next year")) {
      diff.years = 1;
    }
    if (dateString.match("last month")) {
      diff.months = -1;
    }
    if (dateString.match("next month")) {
      diff.months = 1;
    }
    if (dateString.match("last week")) {
      diff.weeks = -1;
    }
    if (dateString.match("next week")) {
      diff.weeks = 1;
    }
    return diff;
  },

  parseDate: function (dateString, relativeTo) {
    relativeTo = relativeTo.clone();
    dateString = normalizeString(dateString);
    var diff = { years: 0, months: 0, weeks: 0, days: 0 };
    diff = this.parseRelativeDates(dateString, relativeTo, diff);
    return relativeTo
      .add(diff.years, "years")
      .add(diff.months, "months")
      .add(diff.weeks, "weeks")
      .add(diff.days, "days");
  },

  parseTime: function (dateString, relativeTo) {
    relativeTo = relativeTo.clone();
    dateString = normalizeString(dateString);
    var diff = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    var matchTime = dateString.match(/at (\d\d?):?(\d\d)/);
    if (matchTime) {
      diff.hours = parseInt(matchTime[1]) - relativeTo.hours();
      diff.minutes = parseInt(matchTime[2]) - relativeTo.minutes();
    } else if (dateString.match("noon")) {
      diff.hours = 12 - relativeTo.hours();
    } else if (dateString.match("midnight")) {
      diff.hours = 0 - relativeTo.hours();
      diff.minutes = 0 - relativeTo.minutes();
      diff.seconds = 0 - relativeTo.seconds();
      diff.days = 1;
    }
    return relativeTo
      .add(diff.days, "days")
      .add(diff.hours, "hours")
      .add(diff.minutes, "minutes")
      .add(diff.seconds, "seconds");
  }
});
