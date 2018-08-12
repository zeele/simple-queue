import Util from './util'
import { DbService } from './db'

export class Cleanup {
  constructor (dbService) {
    this.processingQueues = new Map()
    this.dbService = new DbService()
  }

  init () {
    console.log('Initializing clean up tool...')
    this.dbService.init()
    setInterval(() => {
      this.cleanUp()
    }, 10000)
  }

  addToMapOfProcessingQs (name, expirationTime) {
    console.log(`Adding ${name} to cleanup map`)
    this.processingQueues.set(name, expirationTime)
  }

  deleteFromMapOfProcessingQs (name) {
    console.log('Deleting from cleanup map')
    this.processingQueues.delete(name)
  }

  cleanUp () {
    console.log(`Beginning clean up...`)
    let currTime = Util.generateTimestamp()
    let processingQs = this.processingQueues

    for (let [key, expireTime] of processingQs) {
      if (expireTime < currTime) {
        console.log(`key ${key} has expired`)
        this.addMessagesToQueue(key, currTime)
        this.deletePQueue(key)
      } else {
        break
      }
    }
  }

  addMessagesToQueue (key, currTime) {
    console.log(`About to add messages from expired ${key} to queue`)
    this.dbService.getMessagesFromList(key, (results) => {
      for (let result of results) {
        let msg = JSON.parse(result)
        msg.timestamp = currTime
        this.dbService.addToFrontOfQueue(JSON.stringify(msg))
      }
    })
  }

  deletePQueue (key) {
    this.processingQueues.delete(key)
    this.dbService.deleteProcessingQueue(key)
  }
}
