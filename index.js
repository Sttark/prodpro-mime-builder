/** @format */

'use strict';

const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');
const MimeNode = require('nodemailer/lib/mime-node');
const {createMessage, createTicket} = require('./functions');

const jdfId = 'jdffileid';
const fileId = 'testingfile';

// Create the JMF Message
const JMF_MESSAGE = createMessage(jdfId);
// Create the Job Ticket
const JDF_TICKET = createTicket(fileId);
// Get our file content
const FILECONTENT = fs.readFileSync('./testing.pdf');

const nodes = [
    {
        filename: 'testing.jmf',
        content: JMF_MESSAGE,
        encoding: '7bit',
        contentType: 'application/vnd.cip4-jmf+xml',
        headers: [
            {key: 'Content-Transfer-Encoding', value: '7bit'},
            {key: 'Content-Id', value: '<jmfmessage>'},
            {key: 'Content-Disposition', value: 'attachment'}
        ]
    },
    {
        filename: 'testing.jdf',
        content: JDF_TICKET,
        encoding: '7bit',
        contentType: 'application/vnd.cip4-jmf+xml',
        headers: [
            {key: 'Content-Id', value: `<${jdfId}>`},
            {key: 'Content-Transfer-Encoding', value: '7bit'},
            {key: 'Content-Disposition', value: 'attachment'}
        ]
    },
    {
        filename: 'testing.pdf',
        content: FILECONTENT,
        encoding: 'base64',
        contentType: 'application/pdf',
        headers: [
            {key: 'Content-Id', value: `<${fileId}>`},
            {key: 'Content-Transfer-Encoding', value: 'base64'},
            {key: 'Content-Disposition', value: 'attachment'}
        ]
    }
];

/**
 * Create a primary node for the whole package
 * Loop through our children and add them as nodes to the package
 * Write the package to a file
 * @returns {Promise<void>}
 */
async function main() {
    const boundary = 'somesillystufffrontier';
    const node = await new MimeNode('multipart/related', {
        baseBoundary: boundary
    });
    nodes.forEach(attachment => {
        const childNode = node.createChild(attachment.contentType, {
            filename: attachment.filename
        });

        childNode.addHeader(attachment.headers);
        attachment.content = Buffer.from(attachment.content, 'utf8');
        childNode.setContent(attachment.content);
    });

    const raw = await node.build();
    fs.writeFileSync('./testing.mjm', raw);
}

main();
