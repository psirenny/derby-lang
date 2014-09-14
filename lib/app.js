var MessageFormat = require('messageformat');
var traverse = require('traverse');

exports.translate = function (options) {
  return function (dict, locale, path, params) {
    if (!locale) return 'missing locale';
    if (!path) return 'missing path';
    if (!dict) return 'missing dictionary';
    if (!dict.messageformat) dict.messageformat = {};
    if (!dict.messageformat.locale) dict.messageformat.locale = {};
    if (!dict.strings) dict.strings = {};
    if (typeof path === 'string') path = [path];
    path = [locale].concat(path);
    var lang = locale.substring(0, 2);
    var format = dict.messageformat.locale[lang];
    format = format || this.model.get('$lang.messageformat.locale.' + lang);
    format = Function('locale', 'return ' + format)();
    var messageformat = new MessageFormat(locale, format);
    var text = traverse(dict.strings).get(path) || path.join('.');
    var translate = messageformat.compile(text);
    return translate(params || {});
  };
};
