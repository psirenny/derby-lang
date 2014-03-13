var fs = require('fs')
  , path = require('path')
  , MessageFormat = require('messageformat')
  , traverse = require('traverse');

module.exports = function (formats, translations, callback) {
  var context = traverse(formats).map(function(format) {
    if (this.level < 2) return;
    if (this.isLeaf) this.update(format.toString(), true);
  });

  context.inc = fs.readFileSync(
    path.resolve(require.resolve('messageformat'), '../lib/messageformat.include.js'),
    {encoding: 'utf8'}
  );

  var dictionary = traverse(translations).map(function (translation) {
    if (this.level < 2) return;
    if (!this.isLeaf) return;
    var locale = this.path[0];
    var messageformat = new MessageFormat(locale, formats.locale[locale]);
    this.update(messageformat.precompile(messageformat.parse(translation)), true);
  });

  callback(null, context, dictionary);
};