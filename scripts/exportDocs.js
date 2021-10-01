import Swagger2Postman from 'swagger2-to-postman';
import fs from 'fs';
import { logger } from 'loggery';
import os from 'os';
import yaml from 'yamljs';

const printMessage = (msg) => {
  logger().info(
    `
     =============== POSTMAN COLLECTION CREATOR =============\n
     ${msg}
     `
  );
};

const swaggerConverter = new Swagger2Postman();

const swaggerJson = yaml.load(`${__dirname}/../../docs/swagger.yaml`);

swaggerJson.swagger = '2.0';

const conversionResult = swaggerConverter.convert(swaggerJson);

if (conversionResult.status === 'failed') {
  printMessage(
    `Could not export the swagger documentation
     Ensure that "docs/swagger.js" does not have syntax errors.
     Error: ${conversionResult.message}
     `
  );
  process.exit(1);
}

const collection = JSON.stringify(conversionResult.collection, null, 2);

// replace https:///v1 with a postman env variable for flexibility
const collectionVar = collection.replace(
  new RegExp('https:///v1', 'g'),
  '{{baseUrl}}'
);

const fileName = 'andela-meals-postman-collection.json';

const writePath = `${os.homedir()}/Downloads/${fileName}`;

fs.writeFile(writePath, collectionVar, (err) => {
  if (err) {
    printMessage('Unable to create the postman collection file. Try again.');
    process.exit(1);
  } else {
    printMessage(
      `Exported the documentation to postman collection successfully
     Collection file: ~/Downloads/${fileName}`
    );
  }
});