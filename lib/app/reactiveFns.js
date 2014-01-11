module.exports = function (app) {
  app.on('model', function (model) {
    model.fn('$lang.locales', function (dictionary) {
      return Object.keys(dictionary);
    });
  })
};