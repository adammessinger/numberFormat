'use strict';

/**
 * A small handful of number formatting utilities I've been using in my work
 */

// String.prototype.trim polyfill for numberFormat.unformatMoney in IE < 9
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
  // formatMoney is based on Joss Crowcroft's currency formatter:
  // http://www.josscrowcroft.com/2011/code/format-unformat-money-currency-javascript/
  // 'number' defaults to 0
  // default options: {
  //   decimal_places: 2,
  //   currency_symbol: '$',
  //   thousands_separator: ',',
  //   decimal_separator: '.'
  // }
  formatMoney: function(number, options) {
    var opts;
    number = number || 0;
    options = options || {};
    opts = {
      decimal_places: !isNaN(options.decimal_places = Math.abs(options.decimal_places))
        ? options.decimal_places
        : 2,
      currency_symbol: options.currency_symbol !== undefined
        ? options.currency_symbol
        : '$',
      thousands_separator: options.thousands_separator || ',',
      decimal_separator: options.decimal_separator || '.'
    };

    var negative = number < 0 ? '-' : '';
    var integer_str = parseInt(number = Math.abs(+number || 0).toFixed(opts.decimal_places), 10) + '';
    var thou_sep_no1 = integer_str.length > 3 ? integer_str.length % 3 : 0;

    return negative + opts.currency_symbol
      + (thou_sep_no1 ? integer_str.substr(0, thou_sep_no1) + opts.thousands_separator : '')
      + integer_str.substr(thou_sep_no1).replace(/(\d{3})(?=\d)/g, '$1' + opts.thousands_separator)
      + (opts.decimal_places
        ? opts.decimal_separator + Math.abs(number - integer_str).toFixed(opts.decimal_places).slice(2)
        : "");
  },

  // unformatMoney
  // Remove non-numeric chars from a string (except decimal point & leading minus)
  // and return a numeric value. Only a leading minus sign (or hyphen-minus
  // character) is interpreted as indicating the number is negative. Any falsey
  // argument returns zero. Anything that makes parseFloat return NaN after the
  // character replacement also returns 0.
  // default options: {
  //   currency_symbol: '$',
  //   thousands_separator: ',',
  //   decimal_separator: '.'
  // }
  unformatMoney: function(value, options) {
    var opts, unformatted, is_negative;
    value = value || 0;
    options = options || {};

    // just return value if it's already a number
    if (typeof value === 'number') {
      return value;
    }

    // Still here? Let's make sure we're dealing with a string.
    value = ('' + value).trim();
    // establish defaults
    opts = {
      currency_symbol: options.currency_symbol || '$',
      thousands_separator: options.thousands_separator || ',',
      decimal_separator: options.decimal_separator || '.'
    };
    // NOTE: Those two minuses may look the same in your editor, but they are
    // two different characters -- minus and hyphen-minus.
    is_negative = (value[0] === '-' || value[0] === '−');

    // NOTE: We only care about currency_symbol and thousands_separator if they
    // could be confused with a decimal point by parseFloat. Only bother with
    // decimal_separator if it's not ".".
    if (opts.thousands_separator.indexOf('.') !== -1) {
      opts.thousands_separator = opts.thousands_separator.replace(/\./g, '\\.');
      value = value.replace((new RegExp(opts.thousands_separator, 'g')), '');
    }
    // Since currency_symbol and decimal_separator should only appear once, only
    // their first occurrence is removed/replaced -- no need for regex.
    if (opts.currency_symbol.indexOf('.') !== -1) {
      value = value.replace(opts.currency_symbol, '');
    }
    if (opts.decimal_separator !== '.') {
      value = value.replace(opts.decimal_separator, '.');
    }
    unformatted = parseFloat(value.replace(/[^0-9.]/g, '')) * (is_negative ? -1 : 1);

    return isNaN(unformatted) ? 0 : unformatted;
  },

  // padZeros
  // take a number, return a string that's front-padded with zeroes to the specified length
  padZeros: function(num, length) {
    var padded_str = '' + num;

    while (padded_str.length < length) {
      padded_str = '0' + padded_str;
    }
    return padded_str;
  }
};