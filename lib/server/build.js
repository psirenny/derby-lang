var compile = require('../app/compile');

module.exports = function (options) {
  return function () {
    return function (req, res, next) {
      var model = req.getModel()
        , formats = model.get('$lang.formats')
        , translations = model.get('$lang.translations');

      compile(formats, translations, function (err, context, dictionary) {
        if (err) return next(err);
        model.set('$lang.context', context);
        model.set('$lang.dictionary', dictionary);
        next();
      });
    };
  }
};