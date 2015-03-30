/**
 * A small handful of number utilities I've been using in my work
 */
numberUtils = {
  // currency formatter taken from http://www.josscrowcroft.com/2011/code/format-unformat-money-currency-javascript/
  // default args: 0, 2, "$", ",", "."
  formatMoney: function(number, decimal_places, currency_symbol, thousands_seperator, decimal_seperator) {
    number = number || 0;
    decimal_places = !isNaN(decimal_places = Math.abs(decimal_places)) ? decimal_places : 2;
    currency_symbol = currency_symbol !== undefined ? currency_symbol : '$';
    thousands_seperator = thousands_seperator || ',';
    decimal_seperator = decimal_seperator || '.';

    var negative = number < 0 ? '-' : '';
    var i = parseInt(number = Math.abs(+number || 0).toFixed(decimal_places), 10) + '';
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return currency_symbol + negative
      + (j ? i.substr(0, j) + thousands_seperator : '')
      + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands_seperator)
      + (decimal_places
        ? decimal_seperator + Math.abs(number - i).toFixed(decimal_places).slice(2)
        : "");
  },

  // Remove non-numeric chars from a string (except decimal point & minus sign)
  // and return a numeric value. Any falsey argument returns zero. Anything that
  // makes parseFloat return NaN after the character replacement also returns 0.
  unformatNumber: function(value) {
    var unformatted;

    value = value || 0;

    // just return value if it's already a number
    if (typeof value === 'number') {
      return value;
    }

    unformatted = parseFloat(value.replace(/[^0-9-.]/g, ''));
    return isNaN(unformatted) ? 0 : unformatted;
  },

  // take a number, return a string that's front-padded with zeroes to the specified length
  padZeros: function(num, length) {
    var padded_str = '' + num;

    while (padded_str.length < length) {
      padded_str = '0' + padded_str;
    }
    return padded_str;
  }
};