import redis from 'redis'

export class DbService {
    constructor(){
        this.client = redis.createClient()
    }

    init() {
        this.client.flushall()

        this.client.on('connect', function() {
            console.log('Redis client connected')
        })

        this.client.on('error', function (err) {
            console.log('Something went wrong ' + err)
        })
    }

    addToQueue(msg) {
        this.client.lpush('queue', msg)
        return msg.id
    }

    deleteProcessingQueue(name) {
        console.log(`Deleting ${name}`)
        this.client.del(name)
    }

    moveQToProcessingQueue(src, dest) {
        this.client.rename(src, dest)
    }
}

