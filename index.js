/** @format */

'use strict';

const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');
const MimeNode = require('nodemailer/lib/mime-node');

const jdfId = 'jdffileid';
const fileId = 'testingfile';

// Build our simple JMF Message
const JMF_MESSAGE = xmlbuilder
    .create('JMF')
    .att('xmlns', 'http://www.CIP4.org/JDFSchema_1_1')
    .ele('Command', {ID: 'make-me-a-sandwich', Type: 'SubmitQueueEntry'})
    .ele('QueueSubmissionParams', {
        ReturnJMF: 'www.frontierlabel.com',
        URL: `cid:${jdfId}`
    })
    .end({pretty: true});

const JDF = xmlbuilder
    .create('JDF')
    .att('xmlns', 'http://www.CIP4.org/JDFSchema_1_1')
    .att('ID', 'JDF005')
    .att('JobID', 'ANOTHER TEST 5')
    .att('Status', 'Ready')
    .att('Type', 'Combined')
    .att('Types', 'LayoutPreparation DigitalPrinting');

const resourcePool = JDF.ele('ResourcePool');
resourcePool
    .ele('RunList', {
        Class: 'Parameter',
        ID: 'RL001',
        NPage: 8,
        Status: 'Available'
    })
    .ele('LayoutElement')
    .ele('FileSpec', {
        MimeType: 'application/pdf',
        URL: `cid:${fileId}`
    });

resourcePool.ele('DigitalPrintingParams', {
    Class: 'Parameter',
    ID: 'DPP001',
    Status: 'Available'
});

resourcePool.ele('Component', {
    Class: 'Quantity',
    ComponentType: 'FinalProduct',
    ID: 'C001',
    Status: 'Unavailable'
});

const resourceLinkPool = JDF.ele('ResourceLinkPool');

resourceLinkPool.ele('RunListLink', {rRef: 'RL001', Usage: 'Input'});
resourceLinkPool.ele('DigitalPrintingParamsLink', {rRef: 'DPP001', Usage: 'Input'});
resourceLinkPool.ele('ComponentLink', {Amount: '508', rRef: 'C001', Usage: 'Output'});

const JDF_TICKET = JDF.end({pretty: true});

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

async function main() {
    // There is no way to set the contentType Manually for the parent
    // So I have to do this manually
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
