var MessageFormat = require('messageformat');
var traverse = require('traverse');

exports.translate = function (options) {
  return function (dict, lang, path, params) {
    path = [lang].concat(path);
    var locale = lang.substring(0, 2);
    var format = this.model.get('$lang.messageformat.locale.' + locale);
    format = Function('locale', 'return ' + format)();
    var messageformat = new MessageFormat(locale, format);
    var text = traverse(dict).get(path) || path.join('.');
    var translate = messageformat.compile(text);
    return translate(params);
  };
};
