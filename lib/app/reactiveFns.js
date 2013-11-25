module.exports = function (app) {
  app.on('model', function (model) {
    model.fn('locales', function (translations) {
      return Object.keys(translations);
    });
  });

  app.get('*', function (page, model, params, next) {
    model.start('locales', '$lang.locales', '$lang.translations');
    next();
  });
};