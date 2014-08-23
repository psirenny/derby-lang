var lib = require('..');
var should = require('chai').should();

describe('derby-lang', function () {
  it('should be an object', function () {
    lib.should.be.an('object');
  });

  describe('app', function () {
    it('should be an object', function () {
      lib.app.should.be.an('object');
    });

    describe('translate', function () {
      lib.app.should.have.property('translate');
      lib.app.translate.should.be.a('function');
    });
  });

  describe('server', function () {
    it('should be a function', function () {
      lib.server.should.be.an('function');
    });

    describe('load', function () {
      it('should be a function', function () {
        lib.server.should.have.property('load');
        lib.server.load.should.be.a('function');
      });

      it('should return an object', function (done) {
        lib.server.load(function (err, lang) {
          lang.should.be.an('object');
          lang.should.have.property('messageformat');
          lang.messageformat.should.be.an('object');
          lang.messageformat.should.have.property('locale');
          lang.messageformat.locale.should.be.an('object');
          lang.messageformat.locale.should.not.be.empty;
          done();
        });
      });
    });
  });
});
