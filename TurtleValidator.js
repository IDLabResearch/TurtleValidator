#!/usr/bin/env node
/*! @license ©2014 Miel Vander Sande - Multimedia Lab / iMinds / Ghent University */
/* Command-line utility to validate Turtle files. */

var N3 = require('n3'),
    fs = require('fs'),
    N3Util = N3.Util,
    http = require('http'),
    fs = require('fs'),
    validate = require('./lib/validator.js');

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
  validate(process.stdin, function (feedback) {
    feedback.errors.forEach(function (error) {
      console.log(error);
    });
    feedback.warnings.forEach(function (warning) {
      console.log(warning);
    });
    console.log("Validator finished with " + feedback.warnings.length + " warnings and " + feedback.errors.length + " errors.");
  });
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
