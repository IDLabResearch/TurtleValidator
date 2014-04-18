var N3 = require('n3'), fs = require('fs'), N3Util = N3.Util;

if (!process.argv[2]){
	console.log('RDF N3/NTriples/Turtle file validator');
	console.log('Usage: $ node N3Validator.js <path-to-file>');
	process.exit(1);
}

console.log('Validating '+process.argv[2]);

var parser = N3.Parser(),
    turtleStream = fs.createReadStream(process.argv[2]);

var errorCount = 0;

parser.parse(turtleStream, function (error, triple, prefixes){
	if (error){
		console.log(error);
		errorCount++;	   
	}

        if (triple) {
		if (N3Util.isLiteral(triple.object)){
			var value = N3Util.getLiteralValue(triple.object);
			var type = N3Util.getLiteralType(triple.object);

			type = type.replace('http://www.w3.org/2001/XMLSchema#','');
		
			switch(type) {
				case 'float':
				case 'double':
					if (!value.match(/[-+]?\d*[.]\d+/)){
					   console.log('WARNING: datatype does not validate for value ' + value);
					   console.log(triple.subject, triple.predicate, triple.object, '.');	
					}
					break;
				case 'int':
					if (!value.match(/[-+]?\d*/)){
						console.log('WARNING: int does not validate for value ' + value);
						console.log(triple.subject, triple.predicate, triple.object, '.');
					}	

			}

		}		
	} else {
	        console.log("Validation done: "+ errorCount + " errors found.");
	}
});
