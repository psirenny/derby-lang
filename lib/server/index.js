var _ = require('lodash')
  , compiler = require('./compiler')
  , memoryCache = require('memory-cache');

module.exports = function (options) {
  options = _.defaults(options || {}, {
    cache: {expiration: 0},
  });

  function getTranslations(callback) {
    var translations = memoryCache.get('translations');
    if (translations) return callback(null, translations);
    compiler.compile(options, function (err, translations) {
      if (err) return callback(err);
      memoryCache.put('translations', translations, options.cache.expiration);
      callback(null, translations);
    });
  }

  return function (req, res, next) {
    var model = req.getModel();
    getTranslations(function (err, translations) {
      if (err) return next(err);
      model.set('$lang.defaultLocale', 'en');
      model.set('$lang.translations', translations);
      next();
    });
  };
};