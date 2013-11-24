var _ = require('lodash')
  , compiler = require('./lib/compiler')
  , memoryCache = require('memory-cache')
  , views = require('./lib/views');

module.exports = function (app, options) {
  options = _.defaults(options || {}, {
    cache: {expiration: 0},
  });

  views.create(app, options);

  function getTranslations(callback) {
    var translations = memoryCache.get('translations');
    if (translations) return callback(null, translations);
    compiler.compile(options, function (err, translations) {
      if (err) return callback(err);
      memoryCache.put('translations', translations, options.cache.expiration);
      callback(null, translations);
    });
  }

  app.get('*', function (page, model, params, next) {
    if (model.get('$lang.translations')) return next();
    getTranslations(function (err, translations) {
      if (err) return next(err);
      model.set('$lang.translations', translations);
      next();
    });
  });
};