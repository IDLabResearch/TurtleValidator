#!/usr/bin/env node

/*! @license ©2014 Miel Vander Sande - Multimedia Lab / iMinds / Ghent University */
/* Command-line utility to validate Turtle files. */

var N3 = require('n3'),
  fs = require('fs'),
  N3Util = N3.Util,
  http = require('http');
  url = require('url'),
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

var args = process.argv.slice(2);

if (args.length > 1 || (args.length > 0 && (args[0] === "-h" || args[0] === "--help")))
  return help();

if (args.length === 0) {
  validate(process.stdin, showValidation);
} else if (args.length > 0) {
  // Create a stream from the file, whether it is a local file or a http stream
  var parsedUrl = url.parse(args[0]);
  switch (parsedUrl.protocol) {
  case 'https:':
    http = require('https');
  case 'http:':
    http.get(parsedUrl.href, function (res) {
      validate(res, showValidation);
    }).on('error', function (e) {
      console.log("Got error: " + e.message);
    });
    break;
  case null:
    validate(fs.createReadStream(parsedUrl.href), showValidation);
    break;
  default:
    console.log('Cannot access %s: "%s" not supported', parsedUrl.href, parsedUrl.protocol)
  }
}

// Use stdio as an input stream
function showValidation(feedback) {
  feedback.errors.forEach(function (error) {
    console.log(error);
  });
  feedback.warnings.forEach(function (warning) {
    console.log(warning);
  });
  console.log("Validator finished with " + feedback.warnings.length + " warnings and " + feedback.errors.length + " errors.");
}
