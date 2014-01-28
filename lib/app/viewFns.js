module.exports = function (app) {
  app.view.fn('t', function () {
    var args = Array.prototype.slice.call(arguments, 0)
      , language = this.model.get('$lang.defaultLocale') || 'en'
      , translationInput = {}
      , translationPath = '';

    switch (args.length) {
      case 0:
        return '';
      case 1:
        translationPath = args[0];
        break;
      case 2:
        if (typeof args[1] === 'object') {
          translationPath = args[0];
          translationInput = args[1];
        } else {
          language = args[0];
          translationPath = args[1];
        }
        break;
      case 3:
        if (typeof args[2] === 'object') {
          language = args[0];
          translationInput = args[2];
          translationPath = args[1];
        } else {
          translationInput[args[1]] = args[2];
          translationPath = args[0];
        }
        break;
      default:
        if (args.length % 2) {
          translationPath = args[0];
          var i = 1;
        } else {
          language = args[0];
          translationPath = args[1];
          var i = 2;
        }
        for (i; i < args.length - 1; i+=2) {
          translationInput[args[i]] = args[i + 1];
        }
        break;
    }

    var viewPath = 't_' + language + '_' + translationPath.replace(/\./g, '_');
    var viewFn = app.view.getFns[viewPath];
    if (viewFn) return viewFn(translationInput);
    var translation = this.model.at('$lang.dictionary').at(language).get(translationPath);
    viewFn = Function('MessageFormat', 'return ' + translation)({locale: {en: function(){} }});
    if (!viewFn) return translationPath;
    app.view.fn(viewPath, viewFn);
    return viewFn(translationInput);
  });
};