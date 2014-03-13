var findit = require('findit')
  , fs = require('fs')
  , path = require('path')
  , vm = require('vm');

module.exports = function (options) {
  return function () {
    return function (req, res, next) {
      var model = req.getModel()
        , dir = path.resolve(require.resolve('messageformat'), '../locale')
        , find = findit(dir)
        , sandbox = {MessageFormat: {locale: {}}}
        , context = vm.createContext(sandbox);

      find.on('file', function (file) {
        if (path.extname(file) !== '.js') return;
        var code = fs.readFileSync(file, {encoding: 'utf8'});
        vm.runInContext(code, context);
      });

      find.on('end', function () {
        model.set('$lang.context', {});
        model.set('$lang.defaultLocale', 'en');
        model.set('$lang.dictionary', {});
        model.set('$lang.formats', context.MessageFormat);
        model.set('$lang.translations', {});
        next();
      });
    };
  }
};