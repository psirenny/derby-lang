var findit = require('findit')
  , fs = require('fs')
  , MessageFormat = require('messageformat')
  , path = require('path')
  , traverse = require('traverse')
  , vm = require('vm')

exports.compile = function (options, callback) {
  if (!options.directory) options.directory = 'locale';
  options.directory = path.resolve(path.dirname(require.main.filename), options.directory);

  function getFormats(callback) {
    var dir = path.resolve(require.resolve('messageformat'), '../locale')
      , find = findit(dir)
      , sandbox = {MessageFormat: {locale: {}}}
      , context = vm.createContext(sandbox);

    find.on('file', function (file) {
      if (path.extname(file) !== '.js') return;
      var code = fs.readFileSync(file, {encoding: 'utf8'});
      vm.runInContext(code, context);
    });

    find.on('end', function () {
      callback(context.MessageFormat);
    });
  }

  getFormats(function (formats) {
    var find = findit(options.directory)
      , translations = {};

    find.on('file', function (file) {
      var extname = path.extname(file);
      if (extname !== '.js' && extname !== '.json') return;
      var namespace = path.relative(options.directory, file).split(path.sep);
      var key = path.basename(namespace.pop(), extname);
      if (key !== 'index') namespace.push(key);
      if (extname === '.js') return formats.locale[namespace[0]] = require(file);
      if (extname === '.json') traverse(translations).set(namespace, require(file));
    });

    find.on('end', function () {
      callback(null, traverse(translations).map(function (translation) {
        if (!this.isLeaf) return;
        var locale = this.path[0];
        var messageformat = new MessageFormat(locale, formats.locale[locale]);
        this.update(messageformat.precompile(messageformat.parse(translation)), true);
      }));
    });
  });
};