#!/usr/bin/env node
const amqp = require('amqplib');
const confs = require('./conf');

(async function () {
    const connection = await amqp.connect('amqp://' + confs.host);

    await connection.createChannel().then(function (ch) {
        const msg = process.argv.slice(2).join(' ') || "Hello World!";

        ch.assertQueue(confs.queueName, { durable: true });
        ch.sendToQueue(confs.queueName, new Buffer(msg), { persistent: true });
        console.log(" [x] Sent '%s'", msg);
    });
    //connection.close(); 
    //process.exit(0);
    console.log('closing');
    setTimeout(function () { connection.close(); process.exit(0) }, 500);

})();

