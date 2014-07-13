var findit = require('findit');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

module.exports = function (options) {
  return function (req, res, next) {
    var model = req.getModel();
    var dir = require.resolve('messageformat');
    var finder = findit(path.resolve(dir, '../locale'));
    var sandbox = {MessageFormat: {locale: {}}};
    var context = vm.createContext(sandbox);

    finder.on('file', function (file) {
      var code = fs.readFileSync(file, 'utf8');
      var locale = path.basename(file, '.js');
      vm.runInContext(code, context);
      code = sandbox.MessageFormat.locale[locale].toString();
      model.set('$lang.messageformat.locale.' + locale, code);
    });

    finder.on('end', next);
  };
};
