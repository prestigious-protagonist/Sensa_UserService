
const {sendMessage, initProducer} = require('./producer')
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const { Kafka } = require('kafkajs');
const sendBasicEmail = require('../../service/email-service'); // adjust path if needed
const {deleteAccount, deleteConnections} = require('./utilities');
const connectDB = require('../connectDB');

const kafka = new Kafka({
  clientId: 'sensa-app',
  brokers: ['13.201.19.44:9092']
});

const consumer = kafka.consumer({ groupId: 'email-group' });

const startConsumer = async () => {
  
  await connectDB()
  await consumer.connect();
  await consumer.subscribe({ topic: 'send-email', fromBeginning: false });
  await consumer.subscribe({ topic: 'profile-deletion', fromBeginning: false });
  
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const { email, username, id, msg } = JSON.parse(message.value.toString());
  
      if (topic === 'send-email') {
        console.log("came")
        sendBasicEmail(
          "jaskaranyt123@gmail.com",
          email,
          "Response from Sensa",
          msg
        );
        console.log(`Activation email sent to ${email}`);
      
      } else if (topic === 'profile-deletion') {
        // Call different function here
        
        console.log(`Profile deletion function triggered for ${email}`);
        await deleteAccount(email); 
        console.log(`Connection deletion function triggered for ID: ${id}`);
        await deleteConnections(id);
        await initProducer()
        sendMessage('send-email', {
          email: email,
          msg: "why did u leave us"
        });
      
        console.log("completed")
      
      } else {
        console.warn(`Unhandled topic: ${topic}`);
      }
    },
  });
  
};

startConsumer().catch(console.error);
