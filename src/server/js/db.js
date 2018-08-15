import redis from 'redis'

export class DbService {
  constructor () {
    this.client = redis.createClient()
  }

  init () {
    this.client.flushall()

    this.client.on('connect', function () {
      console.log('Redis client connected')
    })

    this.client.on('error', function (err) {
      console.log('Something went wrong ' + err)
    })
  }

  addToQueue (msg) {
    this.client.lpush('queue', JSON.stringify(msg))
    return Promise.resolve(msg.id)
  }

  addToFrontOfQueue (msg) {
    console.log(`Adding to front of queue ${msg}`)
    this.client.rpush('queue', msg)
  }

  deleteProcessingQueue (name) {
    console.log(`Deleting ${name}`)
    this.client.del(name)
  }

  moveQToProcessingQueue (src, dest) {
    console.log(`Moving ${src} to ${dest}`)
    this.client.rename(src, dest)
  }

  getMessagesFromList (name, fn) {
    console.log(`Retrieving messages from ${name}`)
    this.client.lrange(name, 0, -1, (err, result) => {
      if (err) {
        console.log('Error getting values from list')
      } else {
        fn(result)
      }
    })
  }
}
