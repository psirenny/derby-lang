var _ = require('lodash');

module.exports = function (app) {
  app.view.fn('t', function () {
    var model = app.model;
    var args = Array.prototype.slice.call(arguments, 0);
    var language = model.get('$lang.defaultLocale') || 'en';
    var translationInput = {};
    var translationPath = '';

    // option parsing
    switch (args.length) {
      case 0:
        return '';
      case 1:
        // t('foo.bar')
        translationPath = args[0];
        break;
      case 2:
        if (typeof args[1] === 'object') {
          // t('foo.bar', {baz: 5})
          translationPath = args[0];
          translationInput = args[1];
        } else {
          // t('en', 'foo.bar')
          language = args[0];
          translationPath = args[1];
        }
        break;
      case 3:
        if (typeof args[2] === 'object') {
          // t('en', 'foo.bar', {baz: 5})
          language = args[0];
          translationInput = args[2];
          translationPath = args[1];
        } else {
          // t('foo.bar', 'baz', 5)
          translationInput[args[1]] = args[2];
          translationPath = args[0];
        }
        break;
      default:
        if (args.length % 2) {
          // t('foo.bar', 'baz', 5, 'bip', 6)
          translationPath = args[0];
          var i = 1;
        } else {
          // t('en', 'foo.bar', 'baz', 5, 'bip', 6)
          language = args[0];
          translationPath = args[1];
          var i = 2;
        }

        // merge parameters into input object
        for (i; i < args.length - 1; i+=2) {
          translationInput[args[i]] = args[i + 1];
        }

        break;
    }

    // get language context/formats required by messageFormat.js
    var $context = model.at('$lang.context');
    var $formats = model.at('$lang.formats');

    // default format to English
    var code = 'return ' + $context.get('locale.' + language)
    $formats.setNull('locale.' + language, Function(code)());

    // return if translation path unset
    if (!translationPath) return '';

    // convert translation path to view function path
    // i.e. foo.bar.baz => t_en_foo_bar_baz
    var viewPath = 't_' + language + '_';
    viewPath += translationPath.replace(/\./g, '_');

    // lookup translation in cached view function
    var viewFn = app.view.getFns[viewPath];

    // if found, run translation on input
    if (viewFn) return viewFn(translationInput);

    // otherwise, lookup translation in dictionary
    var $translation = model
      .at('$lang.dictionary')
      .at(language)
      .at(translationPath);

    var translation = $translation.get();

    // do not translate object/arrays
    // i.e. foo => {bar: 'foo.bar', baz: 'foo.baz'}
    if (typeof translation === 'object') {
      function convert(key) {
        var keypath = translationPath + '.' + key;
        var val = $translation.get(key);
        if (typeof val !== 'object') return keyath;
        function subprop(subkey) { return [subkey, keypath + '.' + subkey]; }
        return _(val).keys().map(subprop).zipObject().value();
      }

      return _(translation).keys().map(convert).value();
    }

    // create translation function
    code = $context.get('inc') + 'return ' + translation;
    viewFn = Function('MessageFormat', code)($formats.get());

    // return translation path on error
    if (!viewFn) return translationPath;

    // cache translation as view function
    app.view.fn(viewPath, viewFn);

    // run translation on input
    return viewFn(translationInput);
  });
};
