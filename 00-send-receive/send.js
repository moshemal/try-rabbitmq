#!/usr/bin/env node
const amqp = require('amqplib');
const confs = require('./conf');

(async function () {
    const connection = await amqp.connect('amqp://' + confs.host);

    await connection.createChannel().then(function (ch) {
        const msg = 'Hello World!';

        ch.assertQueue(confs.queueName, { durable: false });
        // Note: on Node 6 Buffer.from(msg) should be used
        ch.sendToQueue(confs.queueName, new Buffer(msg));
        console.log(" [x] Sent %s", msg);
    });
    //connection.close(); 
    //process.exit(0);
    console.log('closing');
    setTimeout(function () { connection.close(); process.exit(0) }, 500);

})()

