(function(expect) {
  'use strict';

  describe('numberUtils', function() {
    describe('formatMoney', function() {
      it('should return a string', function() {
        var formatted = numberUtils.formatMoney(1);

        expect(formatted).to.be.a('string');
      });

      it('should default to 2 decimal places', function() {
        var formatted = numberUtils.formatMoney(1.123);

        expect(formatted.substr(3)).to.have.length(2);
      });

      it('should round result if 0 passed for decimal_places', function() {
        var rounded_up = numberUtils.formatMoney(1.5, 0);
        var rounded_down = numberUtils.formatMoney(1.49, 0);
        expect(rounded_up).to.equal('$2');
        expect(rounded_down).to.equal('$1');
      });

      it('should default to "$" currency symbol', function() {
        var formatted = numberUtils.formatMoney(1);

        expect(formatted[0]).to.equal('$');
      });

      it('should default to "," thousands separator', function() {
        var formatted = numberUtils.formatMoney(1000);

        expect(formatted[2]).to.equal(',');
      });

      it('should default to "." decimal separator', function() {
        var formatted = numberUtils.formatMoney(1);

        expect(formatted[2]).to.equal('.');
      });

      it('should group numbers by thousands', function() {
        var formatted = numberUtils.formatMoney(1000000000);

        expect(formatted[2]).to.equal(',');
        expect(formatted[6]).to.equal(',');
        expect(formatted[10]).to.equal(',');
      });

      it('should proccess alternate currency formats', function() {
        var Costa_Rico = numberUtils.formatMoney(1000000, 2, '₡', '.', ',');
        var Ukraine = numberUtils.formatMoney(1000000, 2, '₴', ' ', ',');
        var Switzerland = numberUtils.formatMoney(1000000, 2, 'Fr. ', "'", '.');

        expect(Costa_Rico).to.equal('₡1.000.000,00');
        expect(Ukraine).to.equal('₴1 000 000,00');
        expect(Switzerland).to.equal("Fr. 1'000'000.00");
      });
    });

    describe('unformatMoney', function() {
      var testee = numberUtils.unformatMoney;

      it('should return a number', function() {
        expect(testee('1')).to.be.a('number');
      });

      it('should return the numeric representation of a string', function() {
        expect(testee('1')).to.equal(1);
        expect(testee('100 goats')).to.equal(100);
        expect(testee('1,000,000')).to.equal(1000000);
        expect(testee('$1,000,000.00')).to.equal(1000000);
      });

      it('should remove any passed currency_symbol before processing', function() {
        expect(testee("Fr. 1'000'000.00", 'Fr. ')).to.equal(1000000);
      });

      it('should respect alternate thousands_separator arg when passed', function() {
        expect(testee('₡1.000.000', null, '.')).to.equal(1000000);
      });

      it('should respect alternate decimal_separator arg when passed', function() {
        expect(testee('₴1 000 000,99', null, null, ',')).to.equal(1000000.99);
      });

      it('should remove non-numeric characters except decimal and leading minus', function() {
        var just_non_numbers = testee('1!2@3#4$5%6a7`89₴01');
        var nonnum_and_decimal = testee('1!2@3#4$5%6a7`.89₴01');
        var nonnum_and_leading_minus = testee('-1!2@3#4$5%6a7`89₴01');
        var nonnum_and_decimal_and_leading_minus = testee('-1!2@3#4$5%6a7`.89₴01');
        var nonnum_and_internal_minus = testee('1!2@3#4$5%6a7`8-9₴01');
        var nonnum_and_decimal_and_internal_minus = testee('1!2@3#4$5%6a7`.8-9₴01');
        var nonnum_and_leading_and_internal_minus = testee('-1!2@3#4$5%6a7`8-9₴01');
        var nonnum_and_decimal_and_leading_and_internal_minus = testee('-1!2@3#4$5%6a7`.8-9₴01');

        expect(just_non_numbers, 'string includes non-numbers')
          .to.equal(12345678901);
        expect(nonnum_and_decimal, 'non-numbers and a decimal')
          .to.equal(1234567.8901);
        expect(nonnum_and_leading_minus, 'non-numbers and a leading minus')
          .to.equal(-12345678901);
        expect(nonnum_and_decimal_and_leading_minus, 'non-numbers, decimal, and leading minus')
          .to.equal(-1234567.8901);
        expect(nonnum_and_internal_minus, 'non-numbers plus internal minus')
          .to.equal(12345678901);
        expect(nonnum_and_decimal_and_internal_minus, 'non-numbers, decimal, and internal minus')
          .to.equal(1234567.8901);
        expect(nonnum_and_leading_and_internal_minus, 'non-numbers, leading minus, and internal minus')
          .to.equal(-12345678901);
        expect(nonnum_and_decimal_and_leading_and_internal_minus, 'non-numbers, decimal, leading minus, and internal minus')
          .to.equal(-1234567.8901);
      });
    });
  });
})(chai.expect);