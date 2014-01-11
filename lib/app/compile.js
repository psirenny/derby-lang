var MessageFormat = require('messageformat')
  , traverse = require('traverse');

module.exports = function (formats, translations, callback) {
  callback(null, traverse(translations).map(function (translation) {
    if (this.level < 2) return;
    if (!this.isLeaf) return;
    var locale = this.path[0];
    var messageformat = new MessageFormat(locale, formats.locale[locale]);
    this.update(messageformat.precompile(messageformat.parse(translation)), true);
  }));
};