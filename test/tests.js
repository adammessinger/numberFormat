(function(expect) {
  'use strict';

  describe('numberFormat', function() {
    describe('formatMoney', function() {
      it('should return a string', function() {
        expect(numberFormat.formatMoney(1)).to.be.a('string');
      });

      it('should default to 2 decimal places', function() {
        expect(numberFormat.formatMoney(1.123).substr(3)).to.have.length(2);
      });

      it('should round result if 0 passed for decimal_places', function() {
        var rounded_up = numberFormat.formatMoney(1.5, 0);
        var rounded_down = numberFormat.formatMoney(1.49, 0);

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
      });

      it('should proccess alternate currency formats', function() {
        var costa_rico = numberFormat.formatMoney(1000000, 2, '₡', '.', ',');
        var ukraine = numberFormat.formatMoney(1000000, 2, '₴', ' ', ',');
        var switzerland = numberFormat.formatMoney(1000000, 2, 'Fr. ', "'", '.');

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
        expect(numberFormat.unformatMoney('$1,000,000.00')).to.equal(1000000);
      });

      it('should remove any passed currency_symbol before processing', function() {
        expect(numberFormat.unformatMoney("Fr. 1'000'000.00", 'Fr. ')).to.equal(1000000);
      });

      it('should respect alternate thousands_separator arg when passed', function() {
        expect(numberFormat.unformatMoney('₡1.000.000', null, '.')).to.equal(1000000);
      });

      it('should respect alternate decimal_separator arg when passed', function() {
        expect(numberFormat.unformatMoney('₴1 000 000,99', null, null, ',')).to.equal(1000000.99);
      });

      it('should remove non-numeric characters except decimal and leading minus', function() {
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
    });
  });
})(chai.expect);