import axios from 'axios'

export class Producer {
  constructor (config = {}) {
    const {url, interval = 10000} = config
    this.url = url
    this.interval = interval
  }

  init () {
    console.log('Initializing producer...')
    setInterval(() => this.addMessage(), this.interval)
  }

  addMessage (text = 'foo') {
    axios.post(this.url, text)
      .catch(err => console.log(`Producer: error adding message ${err}`))
  }
}
