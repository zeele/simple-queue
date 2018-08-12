const axios = require('axios');

export class Producer {
    constructor(config = {}) {
        const {url, interval = 10000} = config;
        this.url = url;
        this.interval = interval;
    }

    init() {
        console.log('Initializing producer...');
        setInterval(() => this.addMessage(), this.interval);
    }

    addMessage() {
        axios.post(this.url, "a message")
            .catch(err => console.log(`Producer: error adding message ${err}`));
    }
}