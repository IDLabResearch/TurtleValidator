var N3 = require('n3'),
    N3Util = N3.Util;

var validate =  function (turtleStream, callback) {
  var parser = N3.Parser();
  var errorCount = 0, warningCount = 0;
  var regexp = {
    'dateTime' : /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[0-1]|0[1-9]|[1-2][0-9])?T(2[0-3]|[0-1][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)??(Z|[+-](?:2[0-3]|[0-1][0-9]):[0-5][0-9])?$/,
    'double' : /[-+]?\d*([.]\d+)?/,
    'float' : /[-+]?\d*[.]\d+/,
    'int' : /^[-+]?(0|[1-9]\d*)$/
  };

  var feedback = { warnings : [], errors : []};
  
  parser.parse(turtleStream, function(error, triple, prefixes) {
    if (error) {
      feedback.errors.push(error);
    }

    if (triple) {
      if (N3Util.isLiteral(triple.object)) {
        var value = N3Util.getLiteralValue(triple.object);
        var type = N3Util.getLiteralType(triple.object);

        type = type.replace('http://www.w3.org/2001/XMLSchema#', '');
        if (regexp[type] && !regexp[type].test(value)) {
          feedback.warnings.push('WARNING: xsd:', type, 'does not validate for literal. {', triple.subject, triple.predicate, triple.object, '}');
        }
      }
    } else {
      callback(feedback);
    }
  });
};

if (typeof window !== 'undefined') {
  window.validate = validate;
}

module.exports = validate;
