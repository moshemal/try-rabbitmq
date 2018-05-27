#!/usr/bin/env node

const amqp = require('amqplib');
const confs = require('./conf');

(async () => {
    const connection = await amqp.connect('amqp://' + confs.host);

    await connection.createChannel().then(function (ch) {
        ch.assertQueue(confs.queueName, { durable: false });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", confs.queueName);
        ch.consume(confs.queueName, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, { noAck: true });
    });
})()