import axios from 'axios'
import Util from './util'

export class Consumer {
    constructor (config = {}) {
        const {getUrl, deleteUrl } = config
        this.getUrl = getUrl
        this.deleteUrl = deleteUrl
        this.shortId = ''
        this.messages = []
        this.processingMessage = false
    }

    init() {
        console.log('Initializing consumer...');
        // while (!this.processingMessage){
        //         console.log(this.processingMessage);
        //         this.getMessage()
        //         this.processMessage()
        //         this.deleteProcessingQueue()
        // }

        setInterval(() => {
            console.log(this.processingMessage);
            this.getMessage()
 //           this.deleteProcessingQueue()
        }, 5000)
    }

    processMessage() {
        console.log(`Message processing, data: ${JSON.stringify(e.data)}`)
    }

    getMessage() {
        this.processingMessage = true;
        this.shortId = Util.generateShortUuid();
        console.log(`Consumer ${this.shortId}: Requesting messages`)
        return axios.post(this.getUrl + this.shortId)
            .then((e) => { this.messages = e.data })
            .catch(err => console.log(`Consumer ${this.shortId}: error getting message ${err}`))
    }

    deleteProcessingQueue() {
        console.log("Send req to delete processing Queue")
        this.processingMessage = false
        return axios.post(this.deleteUrl + this.shortId)
            .then(({data}) => { return data.status })
            .catch(err => console.log(`Consumer ${this.shortId}: error deleting processing queue: ${err}`))
    }

}