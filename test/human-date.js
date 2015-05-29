var expect = require('chai').expect,
    moment = require('moment'),
    humanDate = require('../human-date.js');

var now = moment("2015-01-15T09");

function diff(dateString, unit){
  return moment(humanDate.parse(dateString, now)).diff(now, unit);
}

describe('#parse', function () {

  it('should recognize simple date aliases', function () {
    expect(diff("tomorrow", "days")).to.equal(1);
    expect(diff("the day after tomorrow", "days")).to.equal(2);
    expect(diff("yesterday", "days")).to.equal(-1);
    expect(diff("the day before yesterday", "days")).to.equal(-2);
    expect(diff("last year", "years")).to.equal(-1);
    expect(diff("next year", "years")).to.equal(1);
  });

  it('should recognize relative weekdays', function () {
    expect(diff("next friday", "days")).to.equal(1);
    expect(diff("last thursday", "days")).to.equal(-7);
    expect(diff("last monday next week", "days")).to.equal(4);
    expect(diff("friday next week", "days")).to.equal(8);
    expect(diff("tomorrow next week", "days")).to.equal(8);
    expect(diff("friday last week", "days")).to.equal(-6);
    expect(diff("the day before friday last week", "days")).to.equal(-7);
    expect(diff("the day after friday last week", "days")).to.equal(-5);
  });

  it('should recognize combined date and time aliases', function () {
    var tomorrowAtNoon = humanDate.parse("tomorrow at noon", now);
    expect(tomorrowAtNoon.hours()).to.equal(12);
    expect(tomorrowAtNoon.date()).to.equal(16);

    var yesterdayAtNoon = humanDate.parse("yesterday at noon", now);
    expect(yesterdayAtNoon.hours()).to.equal(12);
    expect(yesterdayAtNoon.date()).to.equal(14);

    var tomorrowAtMidnight = humanDate.parse("tomorrow at midnight", now);
    expect(tomorrowAtMidnight.hours()).to.equal(0);
    expect(tomorrowAtMidnight.date()).to.equal(17);

    var lastYearsTomorrowAtMidnight = humanDate.parse("tomorrow last year at midnight", now);
    expect(lastYearsTomorrowAtMidnight.hours()).to.equal(0);
    expect(lastYearsTomorrowAtMidnight.date()).to.equal(17);
    expect(lastYearsTomorrowAtMidnight.year()).to.equal(2014);

    var lastYearsTomorrowAtMidnight = humanDate.parse("yesterday next year at 8:00", now);
    expect(lastYearsTomorrowAtMidnight.hours()).to.equal(8);
    expect(lastYearsTomorrowAtMidnight.date()).to.equal(14);
    expect(lastYearsTomorrowAtMidnight.year()).to.equal(2016);
  });

});
