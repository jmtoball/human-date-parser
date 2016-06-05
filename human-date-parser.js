if (typeof require === 'function') {
  var moment = require('moment');
}
(function(exports){

  function normalizeString(dateString) {
    // Lowercase
    dateString = dateString.toLowerCase();
    // Normalize whitespace
    dateString = dateString.replace(/\s+/mg, ' ');
    return dateString;
  }

  var HumanDate = Object.create({
    parse: function (dateString, relativeTo) {
      if (typeof relativeTo === 'undefined') {
        relativeTo = moment();
      }
      var date = this.parseDate(dateString, relativeTo);
      var dateWithTime = this.parseTime(dateString, date);
      return dateWithTime;
    },

    parseRelativeWeekDays: function (dateString, relativeTo) {
      var weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      var sign = 1;
      for (targetIdx = 0; targetIdx < weekDays.length; targetIdx++) {
        var currentIdx = weekDays.indexOf(relativeTo.format('dddd').toLowerCase());
        var weekDay = weekDays[targetIdx];
        if (dateString.match(weekDay)) {
          var diff = targetIdx - currentIdx;
          if (dateString.match("last " + weekDay)) {
            if (targetIdx >= currentIdx) {
              return diff - 7;
            }
          } else {
            if (targetIdx <= currentIdx) {
              return 7 + diff;
            }
          }
          return diff;
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
        diff.minutes = 0 - relativeTo.minutes();
        diff.seconds = 0 - relativeTo.seconds();
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

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = HumanDate;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return HumanDate;
      });
    }
    else {
      window.HumanDate = HumanDate;
    }
  }
})();
