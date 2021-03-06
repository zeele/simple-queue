import axios from 'axios'
import Util from './util'

export class Consumer {
  constructor (config = {}) {
    const {getUrl, deleteUrl, interval} = config
    this.getUrl = getUrl
    this.deleteUrl = deleteUrl
    this.shortId = ''
    this.processingMessage = false
    this.interval = interval
  }

  init () {
    console.log('Initializing consumer...')
    // Commenting this out to prevent overuse of CPU resources
    // This below code could work if there's a feature like
    // long polling
    // while (!this.processingMessage) {
    //   this.getMessages()
    //   this.deleteProcessingQueue()
    // }

    setInterval(() => {
      this.getMessages()
     // this.deleteProcessingQueue()
    }, this.interval)
  }

  processMessages (data) {
    console.log(`Consumer ${this.shortId} Processing data`)
    console.log(`Consumer ${this.shortId} Finished processing messages`)
    return data
  }

  getMessages () {
    this.processingMessage = true
    this.shortId = Util.generateShortUuid()
    console.log(`Consumer ${this.shortId}: Requesting messages`)

    this.get().then(data => {
      return Promise.resolve(this.processMessages(data))
    })
  }

  get () {
    return axios.get(this.getUrl + this.shortId)
      .then(res => res.data)
      .catch(err => console.log(`Error getting message, url: ${this.getUrl + this.shortId} ${err}`))
  }

  deleteProcessingQueue () {
    console.log(`Send request to delete processing Queue ${this.shortId}`)
    this.processingMessage = false

    return axios.post(this.deleteUrl + this.shortId)
      .then(({data}) => {
        return data.status
      })
      .catch(err => console.log(`Consumer ${this.shortId}: error deleting processing queue: ${err}`))
  }
}
