(function(expect) {
  'use strict';

  describe('numberUtils', function() {
    describe('formatMoney', function() {
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

      it('should default to "," thousands seperator', function() {
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
  });
})(chai.expect);