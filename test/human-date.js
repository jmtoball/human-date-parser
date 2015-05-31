var expect = require('chai').expect,
    moment = require('moment'),
    humanDate = require('../human-date.js'),
    inputs = require('./inputs.json');

var now = moment("2015-01-15T09");

function getDateFragment(date, unit) {
  unit = unit.replace(/s$/, '');
  if (["year", "month", "week", "day", "hour", "minute", "second"].indexOf(unit) >= 0) {
    if (unit == "day") {
      unit = "date";
    }
    return date[unit]();
  } else {
    throw 'Unsuspported unit ' + unit;
  }
}
function applyInput(input, outputs) {
  it('should turn ' + input + ' into ' + JSON.stringify(outputs), function () {
    var result = humanDate.parse(input, now);
    var unit, output, value, diff;
    if (typeof outputs.relative !== 'undefined') {
      output = outputs.relative;
      for (unit in output) {
        value = output[unit];
        diff = getDateFragment(result, unit) - getDateFragment(now, unit);
        expect(diff).to.equal(value);
      }
    }
    if (typeof outputs.absolute !== 'undefined') {
      output = outputs.absolute;
      for (unit in output) {
        value = output[unit];
        expect(getDateFragment(result, unit)).to.equal(value);
      }
    }
  });
}

function applyInputs(inputs, method) {
  for (var input in inputs[method]) {
    var outputs = inputs[method][input];
    applyInput(input, outputs);
  }
}

describe('#parse', function () {
  applyInputs(inputs, "parseDate");
  applyInputs(inputs, "parseTime");
  applyInputs(inputs, "parse");
});
