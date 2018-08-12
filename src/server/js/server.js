import { DbService } from './db'
import express from 'express'
import Util from './util'
import { Cleanup } from "./cleanup";

const app = express()
app.use(express.json())
const port = 3000

console.log('Starting app...')
const dbService = new DbService()
dbService.init()

const cleanup = new Cleanup();
cleanup.init(dbService);

app.listen(port, () => console.log(`Server is listening on port ${port}`))

app.post('/add', (req, res) => {
    let msg = {
        'id' : Util.generateUuid(),
        'text' : res.body,
        'timestamp' : Util.generateTimestamp()
    }

    return dbService.addToQueue(JSON.stringify(msg));
})

app.post('/delete/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    console.log(`Deleting ${queueName}`)
    dbService.deleteProcessingQueue(`processingQueue:${uuid}`)
    cleanup.deleteFromMapOfProcessingQs(name)
})

app.post('/get/:uuid', (req, res) => {
    let result;
    let name = `processingQueue:${req.params.uuid}`
    dbService.moveQToProcessingQueue('queue', name)
    cleanup.addToMapOfProcessingQs(name, Util.generateExpTime())

    console.log(`Creating ${name}`)

    let ids;
    // result = client.lrange(`${name}`, 0, -1, (err, result) => {
    //     if (err) {
    //         console.log('Error getting values from processing queue');
    //     } else {
    //         ids = result.map(msg => {
    //            console.log(msg);
    //            let obj = JSON.parse(msg);
    //            return obj.id;
    //         });
    //     }
    // });

    res.send(ids);
});

