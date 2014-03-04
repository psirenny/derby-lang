var compile = require('../app/compile');

module.exports = function (options) {
  return function () {
    return function (req, res, next) {
      var model = req.getModel()
        , formats = model.get('$lang.formats')
        , translations = model.get('$lang.translations');

      for (var locale in formats.locale) {
        var fn = formats.locale[locale];
        model.set('$lang.context.locale.' + locale, fn);
      }

      compile(formats, translations, function (err, dictionary) {
        if (err) return next(err);
        model.set('$lang.dictionary', dictionary);
        next();
      });
    };
  }
};