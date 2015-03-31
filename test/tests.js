(function(expect) {
  'use strict';

  describe('numberFormat', function() {
    describe('formatMoney', function() {
      it('should return a string', function() {
        expect(numberFormat.formatMoney(1)).to.be.a('string');
      });

      it('should default to 2 decimal places', function() {
        expect(numberFormat.formatMoney(1.123).substr(3).length).to.equal(2);
      });

      it('should round result if 0 passed for decimal_places option', function() {
        var rounded_up = numberFormat.formatMoney(1.5, { decimal_places: 0 });
        var rounded_down = numberFormat.formatMoney(1.49, { decimal_places: 0 });

        expect(rounded_up).to.equal('$2');
        expect(rounded_down).to.equal('$1');
      });

      it('should default to "$" currency symbol', function() {
        expect(numberFormat.formatMoney(1)[0]).to.equal('$');
      });

      it('should default to "," thousands separator', function() {
        expect(numberFormat.formatMoney(1000)[2]).to.equal(',');
      });

      it('should default to "." decimal separator', function() {
        expect(numberFormat.formatMoney(1)[2]).to.equal('.');
      });

      it('should group numbers by thousands', function() {
        var formatted = numberFormat.formatMoney(1000000000);

        expect(formatted[2]).to.equal(',');
        expect(formatted[6]).to.equal(',');
        expect(formatted[10]).to.equal(',');
        expect(formatted.match(/,/g).length).to.equal(3);
      });

      it('should proccess alternate currency formats', function() {
        var costa_rico = numberFormat.formatMoney(1000000, {
          currency_symbol: '₡',
          thousands_separator: '.',
          decimal_separator: ','
        });
        var ukraine = numberFormat.formatMoney(1000000, {
          currency_symbol: '₴',
          thousands_separator: ' ',
          decimal_separator: ','
        });
        var switzerland = numberFormat.formatMoney(1000000, {
          currency_symbol: 'Fr. ',
          thousands_separator: "'"
        });

        expect(costa_rico).to.equal('₡1.000.000,00');
        expect(ukraine).to.equal('₴1 000 000,00');
        expect(switzerland).to.equal("Fr. 1'000'000.00");
      });
    });

    describe('unformatMoney', function() {
      it('should return a number', function() {
        expect(numberFormat.unformatMoney('1')).to.be.a('number');
      });

      it('should return the numeric representation of a string', function() {
        expect(numberFormat.unformatMoney('1')).to.equal(1);
        expect(numberFormat.unformatMoney('100 goats')).to.equal(100);
        expect(numberFormat.unformatMoney('1,000,000')).to.equal(1000000);
        expect(numberFormat.unformatMoney('-1,000.985')).to.equal(-1000.985);
        expect(numberFormat.unformatMoney('$1,000,000.00')).to.equal(1000000);
        expect(numberFormat.unformatMoney('-$2,000.15: OVERDRAWN')).to.equal(-2000.15);
      });

      it('should only use leading minus or hyphen-minus to determine negativity', function() {
        expect(numberFormat.unformatMoney('−1'), 'leading minus')
          .to.equal(-1);
        expect(numberFormat.unformatMoney('  −1'), 'leading minus + spaces')
          .to.equal(-1);
        expect(numberFormat.unformatMoney('1−'), 'trailing minus')
          .to.equal(1);
        expect(numberFormat.unformatMoney('10−1'), 'inner minus')
          .to.equal(101);
        expect(numberFormat.unformatMoney('-1'), 'leading hyphen-minus')
          .to.equal(-1);
        expect(numberFormat.unformatMoney('  -1'), 'leading hyphen-minus + spaces')
          .to.equal(-1);
        expect(numberFormat.unformatMoney('1-'), 'trailing hyphen-minus')
          .to.equal(1);
        expect(numberFormat.unformatMoney('10-1'), 'inner hyphen-minus')
          .to.equal(101);
      });

      it('should remove non-numeric characters except decimal, while respecting leading minus as negative indicator', function() {
        var unformat = numberFormat.unformatMoney;

        expect(unformat('1!2@3#4$5%6a7`89₴01'), 'string includes non-numbers')
          .to.equal(12345678901);
        expect(unformat('1!2@3#4$5%6a7`.89₴01'), 'non-numbers and a decimal')
          .to.equal(1234567.8901);
        expect(unformat('-1!2@3#4$5%6a7`89₴01'), 'non-numbers and a leading minus')
          .to.equal(-12345678901);
        expect(unformat('-1!2@3#4$5%6a7`.89₴01'), 'non-numbers, decimal, and leading minus')
          .to.equal(-1234567.8901);
        expect(unformat('1!2@3#4$5%6a7`8-9₴01'), 'non-numbers plus internal minus')
          .to.equal(12345678901);
        expect(unformat('1!2@3#4$5%6a7`.8-9₴01'), 'non-numbers, decimal, and internal minus')
          .to.equal(1234567.8901);
        expect(unformat('-1!2@3#4$5%6a7`8-9₴01'), 'non-numbers, leading minus, and internal minus')
          .to.equal(-12345678901);
        expect(unformat('-1!2@3#4$5%6a7`.8-9₴01'), 'non-numbers, decimal, leading minus, and internal minus')
          .to.equal(-1234567.8901);
      });

      it('should remove any passed currency_symbol option before processing', function() {
        expect(numberFormat.unformatMoney("Fr. 1'000'000.00", {
          currency_symbol: 'Fr. '
        })).to.equal(1000000);
      });

      it('should respect alternate thousands_separator option when passed', function() {
        expect(numberFormat.unformatMoney('₡1.000.000', {
          thousands_separator: '.'
        })).to.equal(1000000);
      });

      it('should respect alternate decimal_separator option when passed', function() {
        expect(numberFormat.unformatMoney('₴1 000 000,99', {
          decimal_separator: ','
        })).to.equal(1000000.99);
      });
    });
  });
})(chai.expect);