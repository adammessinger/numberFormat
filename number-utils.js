'use strict';

/**
 * A small handful of number formatting utilities I've been using in my work
 */

// String.prototype.trim polyfill for numberFormat.unformatMoney
if (!String.prototype.trim) {
  (function() {
    // Make sure we trim BOM and NBSP
    var rgx_trim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    String.prototype.trim = function() {
      return this.replace(rgx_trim, '');
    };
  })();
}

var numberFormat = {
  // currency formatter taken from http://www.josscrowcroft.com/2011/code/format-unformat-money-currency-javascript/
  // default args: 0, 2, "$", ",", "."
  formatMoney: function(number, decimal_places, currency_symbol, thousands_separator, decimal_separator) {
    number = number || 0;
    decimal_places = !isNaN(decimal_places = Math.abs(decimal_places)) ? decimal_places : 2;
    currency_symbol = currency_symbol !== undefined ? currency_symbol : '$';
    thousands_separator = thousands_separator || ',';
    decimal_separator = decimal_separator || '.';

    var negative = number < 0 ? '-' : '';
    var i = parseInt(number = Math.abs(+number || 0).toFixed(decimal_places), 10) + '';
    var j = i.length > 3 ? i.length % 3 : 0;

    return currency_symbol + negative
      + (j ? i.substr(0, j) + thousands_separator : '')
      + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands_separator)
      + (decimal_places
        ? decimal_separator + Math.abs(number - i).toFixed(decimal_places).slice(2)
        : "");
  },

  // Remove non-numeric chars from a string (except decimal point & leading minus)
  // and return a numeric value. Only a leading minus sign (or hyphen-minus
  // character) is interpreted as indicating the number is negative. Any falsey
  // argument returns zero. Anything that makes parseFloat return NaN after the
  // character replacement also returns 0.
  unformatMoney: function(value) {
    var unformatted, is_negative;

    value = value || 0;

    // just return value if it's already a number
    if (typeof value === 'number') {
      return value;
    }

    // Still here? Let's make sure we're dealing with a string.
    value = ('' + value).trim();
    // NOTE: Those two minuses may look the same in your editor, but they are
    // two different characters -- minus and hyphen-minus.
    is_negative = (value[0] === '-' || value[0] === '−');
    unformatted = parseFloat(value.replace(/[^0-9.]/g, '')) * (is_negative ? -1 : 1);

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