/** @format */

const xmlbuilder = require('xmlbuilder');

module.exports.createMessage = jdfId => {
    return xmlbuilder
        .create('JMF')
        .att('xmlns', 'http://www.CIP4.org/JDFSchema_1_1')
        .ele('Command', {ID: 'make-me-a-sandwich', Type: 'SubmitQueueEntry'})
        .ele('QueueSubmissionParams', {
            ReturnJMF: 'www.frontierlabel.com',
            URL: `cid:${jdfId}`
        })
        .end({pretty: true});
};

module.exports.createTicket = fileId => {
    const JDF = xmlbuilder
        .create('JDF')
        .att('xmlns', 'http://www.CIP4.org/JDFSchema_1_1')
        .att('ID', 'JDF005')
        .att('JobID', 'ANOTHER TEST 7')
        .att('Status', 'Ready')
        .att('Type', 'Combined')
        .att('Types', 'LayoutPreparation DigitalPrinting');

    const resourcePool = JDF.ele('ResourcePool');
    resourcePool
        .ele('RunList', {
            Class: 'Parameter',
            ID: 'RL001',
            Status: 'Available'
        })
        .ele('LayoutElement')
        .ele('FileSpec', {
            MimeType: 'application/pdf',
            URL: `cid:${fileId}`
        });

    resourcePool.ele('Component', {
        Class: 'Quantity',
        ComponentType: 'FinalProduct',
        ID: 'C001',
        Status: 'Unavailable'
    });

    const resourceLinkPool = JDF.ele('ResourceLinkPool');

    resourceLinkPool.ele('RunListLink', {rRef: 'RL001', Usage: 'Input'});
    resourceLinkPool.ele('ComponentLink', {Amount: '510', rRef: 'C001', Usage: 'Output'});

    return JDF.end({pretty: true});
};
