import { Producer } from './Producer'
import { Consumer } from './Consumer'

const consumerConfig = {
  getUrl: 'http://localhost:3000/get/',
  deleteUrl: 'http://localhost:3000/delete/',
  interval: 8000
}

const producerConfig = {
  url: 'http://localhost:3000/add',
  interval: 8000
}

const producer = new Producer(producerConfig)
producer.init()
const consumer = new Consumer(consumerConfig)
consumer.init()

// To see clean up service in action,
// simulate processing Queues timing out by
// uncommenting line 26 in Consumer.js "this.deleteProcessingQueue()"

// Uncomment this to add another consumer
// const consumerConfig2 = {
//   getUrl: 'http://localhost:3000/get/',
//   deleteUrl: 'http://localhost:3000/delete/'
// }
//
// setTimeout(()=> {
//     const consumer2 = new Consumer(consumerConfig2);
//     consumer2.init();
// }, 16000)
