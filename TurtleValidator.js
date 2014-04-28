#!/usr/bin/env node

var N3 = require('n3'),
    fs = require('fs'),
    N3Util = N3.Util,
    http = require('http'),
    fs = require('fs');

var validateStream = function (turtleStream) {
  var parser = N3.Parser();
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
};

var help = function () {
  // In all other cases, let's help the user and return some help
  console.log('RDF NTriples/Turtle validator using Ruben Verborgh\'s N3 nodejs library');
  console.log('© 2014 - MMLab - Ghent University - iMinds');
  console.log('Source code: https://github.com/MMLab/TurtleValidator');
  console.log('');
  console.log('Examples:');
  console.log('');
  console.log('  $ ttl <path-to-file>');
  console.log('  $ curl http://data.linkeddatafragments.org/dbpedia -H "accept: text/turtle" | ttl');
  console.log('  $ ttl http://triples.demo.thedatatank.com/demo.ttl');
};

if (process.argv[2] && (process.argv[2] === "-h" || process.argv[2] === "--help") ) {
  help();
} else if (process.argv.length === 2) {
  // Use stdio as an input stream
  validateStream(process.stdin);
} else if (process.argv.length === 3 ) {
  // Create a stream from the file, whether it is a local file or a http stream
  var filename = process.argv[2];
  fs.exists(filename, function (exists) {
    if (exists) {
      try{
        validateStream(fs.createReadStream(filename));
      } catch ( e ) {
        console.error(e);
      } 
    } else {
      try{
        validateStream(http.get(process.argv[2]));
      } catch ( e ) {
        console.error(e);
      }
    }
  });

} else {
  help();
}


