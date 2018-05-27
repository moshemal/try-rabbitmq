#!/usr/bin/env node

const amqp = require('amqplib');
const confs = require('./conf');

(async () => {
    const connection = await amqp.connect('amqp://' + confs.host);

    await connection.createChannel().then(function (ch) {
        ch.prefetch(1);
        ch.assertQueue(confs.queueName, { durable: true });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", confs.queueName);
        
        function handleMsg(msg){
            if(!msg){
                console.log('no message');
                ch.cancel(handleMsg.consumerTag);
                process.exit(0);
                return;
            }
            var secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function () {
                console.log(msg.content.toString() + " [x] Done");
                ch.ack(msg);
            }, secs * 1000);
        }

        ch.consume(confs.queueName, handleMsg, { noAck: false }).then( res => {
            handleMsg.consumerTag = res.consumerTag;
        } );
    });
})()