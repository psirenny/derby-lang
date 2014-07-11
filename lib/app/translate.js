var traverse = require('traverse');

module.exports = function (options) {
  return function (lang, path, params) {
    var model = this.model;
    var context = lang.context;
    var formats = lang.formats;
    var defaultLocale = lang.defaultLocale;
    var translation = traverse(lang.dictionary).get(path);
    var code = 'return ' + context.locale[defaultLocale];
    if (!formats.locale[defaultLocale]) formats.locale[defaultLocale] = Function(code);
    code = context.inc + 'return ' + translation;
    var fn = Function('MessageFormat', code)(formats);
    return fn ? fn(translation) : path.join('.');
  };
};
