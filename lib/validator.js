var N3 = require('n3');

var validate =  function (turtleStream, callback) {
  var parser = N3.Parser({ format: 'text/turtle' });
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
      feedback.errors.push(error.message);
    }

    if (triple) {
      if (triple.object.termType === 'literal') {
        var value = triple.object.value;
        var type = triple.object.datatype;

        type = type.replace('http://www.w3.org/2001/XMLSchema#', '');
        if (regexp[type] && !regexp[type].test(value)) {
          feedback.warnings.push('xsd:', type, 'does not validate for literal. {', triple.subject.value, triple.predicate.value, triple.object.value, '}');
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
