const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'sensa-app',
  brokers: ['13.201.19.44:9092']
});

const producer = kafka.producer();

const initProducer = async () => {
  await producer.connect();
};

const sendMessage = async (topic, messageObj) => {
  console.log(messageObj)
  await producer.send({
    topic,
    messages: [
      { value: JSON.stringify(messageObj),

       }
    ]
  });

  console.log(`Sent message to topic: ${topic}`);
};

module.exports = {
  initProducer,
  sendMessage,
};
