TurtleValidator
===========
RDF NTriples/Turtle validator using Ruben Verborgh's [N3 NodeJS library](https://github.com/RubenVerborgh/N3.js). Validate Turtle and Ntriples documents on syntax and XSD datatype errors through command line.

© 2014, 2015 - IDLab - Ghent University - imec
Source code: https://github.com/MMLab/TurtleValidator

Install:

    npm install -g turtle-validator

Examples:

    $ ttl <path-to-file ...>
    $ curl http://data.linkeddatafragments.org/dbpedia -H "accept: text/turtle" | ttl
    $ ttl http://triples.demo.thedatatank.com/demo.ttl

## Or install the browser client

```bash
# Equivalent to: npm build
npm install
browserify lib/validator.js -o public/js/ttl.js
```

Then use it in your browser using the index.html in the public folder.
You can run this locally as follows.

```bash
# Equivalent to: npm start
npm install
browserify lib/validator.js -o public/js/ttl.js
ws
```
