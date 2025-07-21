const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const jsonToYaml = require('json2yaml');
const fs = require('fs');
const path = require('path');
const swaggerOptions = require('../config/swagger.options.js');

const options = swaggerOptions(path.resolve(__dirname, '..'));

const swaggerSpec = swaggerJSDoc(options);

fs.writeFileSync('./docs/docs_swagger2.yaml', jsonToYaml.stringify(swaggerSpec));
fs.writeFileSync('./docs/docs.yaml', jsonToYaml.stringify(swaggerSpec));

console.log('Swagger docs generated!');
