var MessageFormat = require('messageformat');
var traverse = require('traverse');

exports.translate = function (options) {
  return function (dict, locale, path, params) {
    if (!dict) return 'missing dictionary';
    if (!locale) return 'missing locale';
    if (!path) return 'missing path';
    path = [locale].concat(path);
    var lang = locale.substring(0, 2);
    var format = this.model.get('$lang.messageformat.locale.' + lang);
    format = Function('locale', 'return ' + format)();
    var messageformat = new MessageFormat(locale, format);
    var text = traverse(dict).get(path) || path.join('.');
    var translate = messageformat.compile(text);
    return translate(params);
  };
};
