The purpose of this package is to demonstrate how to create a mime package for HP Production Pro in Node.

* Clone this repo
* Run `node index.js` from the project root

This will generate the file test.mjm. This file can be submitted to the DFE.

* Using Postman Submit at `POST` request to your local DFE `http://<dfeipaddress>:8080/dpp/jmf/<dfename>`
* Set the `Content-Type` header to `multipart/related`
* For the body choose `binary`
* Select the `testing.mjm` file

If all went well, you should see the job in your queue on the DFE. If not, the DFE tends to have helpful error response messages

