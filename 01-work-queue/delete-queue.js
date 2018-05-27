#!/usr/bin/env node
const amqp = require('amqplib');
const confs = require('./conf');

(async function () {
    const connection = await amqp.connect('amqp://' + confs.host);

    await connection.createChannel().then(function (ch) {
        ch.deleteQueue(confs.queueName, { durable: true });
    });
    //connection.close(); 
    //process.exit(0);
    console.log('closing');
    setTimeout(function () { connection.close(); process.exit(0) }, 500);

})();

