import { client } from './db'
import Util from './util'
import moment from 'moment'

export class Cleanup {

    constructor(dbService) {
        this.processingQueues = new Map();
        this.dbService = dbService;
    }

    init() {
        console.log('Initializing clean up tool...')
        setInterval(() => {
            this.cleanUp()
        }, 10000)
    }

    addToMapOfProcessingQs(name, expirationTime) {
        console.log('adding to cleanup map')
        this.processingQueues.set(name, expirationTime)
    }

    deleteFromMapOfProcessingQs(name) {
        console.log('deleting from cleanup map')
        delete cleanup.processingQueues.delete(name)
    }

    cleanUp () {
        let cont = true;
        console.log(`Beginning clean up...`)
        while (cont) {
            let currTime = Util.generateTimestamp();
            let processingQs = this.processingQueues;
            console.log(`currTime ${currTime}`)

            for (let [name, expireTime] of processingQs) {
                console.log(`name ${name} currTime ${currTime} expireTime ${expireTime}`)
                if (expireTime < currTime) {
                    console.log(`name ${name} has expired`)
                    let msg = {
                        'id' : Util.generateUuid(),
                        'text' : res.body,
                        'timestamp' : Util.generateTimestamp()
                    }

                    this.dbService.addToQueue(JSON.stringify(msg))
                    this.dbService.deleteProcessingQueue(`processingQueue:${key}`)
                    this.processingQueues.delete(key);
                } else {
                    //since map is sorted by insertion the rest will have a later
                    //expiration time
                    cont = false;
                }
            }
            cont = false;
        }
    }


}
