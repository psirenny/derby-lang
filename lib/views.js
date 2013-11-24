var _ = require('lodash')

exports.create = function (app, options) {
  app.view.fn('_', function () {
    var language = 'en'
      , translationInput = {}
      , translationPath = '';

    switch (arguments.length) {
      case 0:
        return '';
      case 1:
        language = 'en';
        translationPath = arguments[0];
        break;
      case 2:
        if (typeof arguments[1] === 'object') {
          translationPath = arguments[0];
          translationInput = arguments[1];
        } else {
          language = arguments[0];
          translationPath = arguments[1];
        }
        break;
      case 3:
        if (typeof arguments[2] === 'object') {
          language = arguments[0];
          translationInput = arguments[2];
          translationPath = arguments[1];
        } else {
          translationInput[arguments[1]] = arguments[2];
          translationPath = arguments[0];
        }
        break;
      default:
        if (arguments.length % 2) {
          translationPath = arguments[0];
          translationInput = _(arguments).values().rest(1).zipObject().value();
        } else {
          language = arguments[0];
          translationPath = arguments[1];
          translationInput = _(arguments).values().rest(2).zipObject().value();
        }
        break;
    }

    var viewPath = '_' + language + '_' + translationPath.replace(/\./g, '_');
    var viewFn = app.view.getFns[viewPath];
    if (viewFn) return viewFn(translationInput);
    var translation = this.model.at('$lang.translations').at(language).get(translationPath);
    viewFn = Function('MessageFormat', 'return ' + translation)({locale: {en: function(){} }});
    app.view.fn(viewPath, viewFn);
    return viewFn(translationInput);
  });
};