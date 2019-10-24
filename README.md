## Node MIME Builder for Production Pro (HP)

**SAMPLE CODE ONLY** - Not intended for usage in production environments.

The purpose of this package is to demonstrate how to create a mime package for HP Production Pro in Node. All the current tools require JAVA and that is totally not necessary for something so simple.

The `index.js` file is a simple example of all the steps required to make a mime package. In overly simple terms, MIME packages are **text files** that have specific boundaries to combine multiple files into one.

The `functions.js` file creates the XML documents (JMF and JDF) needed. You could load these from files as well. 
Eventually you would have a more robust JDF module so you could configure specific attributes for your specific job.

* Clone this repo
* Run `npm i` fromn the project root
* Run `node index.js` from the project root

This will generate the file `test.mjm`. This file can be submitted to the DFE either via hotfolder or HTTP.

* Using Postman Submit at `POST` request to your local DFE `http://<dfeipaddress>:8080/dpp/jmf/<dfename>`
* Set the `Content-Type` header to `multipart/related`
* For the body choose `binary`
* Select the `testing.mjm` file

If all went well, you should see the job in your queue on the DFE. If not, the DFE tends to have helpful error response messages

