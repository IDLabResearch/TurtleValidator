var N3 = require('n3'), fs = require('fs'), N3Util = N3.Util;

if (!process.argv[2]) {
	console.log('RDF N3/NTriples/Turtle file validator');
	console.log('Usage: $ node N3Validator.js <path-to-file>');
	process.exit(1);
}

console.log('Validating ' + process.argv[2]);

var parser = N3.Parser(), turtleStream = fs.createReadStream(process.argv[2]);

var errorCount = 0, warningCount = 0;

var regexp = {
	'dateTime' : /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[0-1]|0[1-9]|[1-2][0-9])?T(2[0-3]|[0-1][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)??(Z|[+-](?:2[0-3]|[0-1][0-9]):[0-5][0-9])?$/,
	'double' : /[-+]?\d*([.]\d+)?/,
	'float' : /[-+]?\d*[.]\d+/,
	'int' : /^[-+]?(0|[1-9]\d*)$/
};

parser.parse(turtleStream, function(error, triple, prefixes) {
	if (error) {
		console.log(error);
		errorCount++;
	}

	if (triple) {
		if (N3Util.isLiteral(triple.object)) {
			var value = N3Util.getLiteralValue(triple.object);
			var type = N3Util.getLiteralType(triple.object);

			type = type.replace('http://www.w3.org/2001/XMLSchema#', '');
			
			if (regexp[type] && !regexp[type].test(value)) {
				console.log('WARNING: xsd:', type, 'does not validate for literal. {', triple.subject, triple.predicate, triple.object, '}');
				warningCount++;
			}
		}
	} else {
		console.log('Validation done:', errorCount, 'errors and', warningCount ,'warnings found.');
	}
});
