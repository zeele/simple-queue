import { DbService } from './db'
import express from 'express'
import Util from './util'
import { Cleanup } from './cleanup'

const app = express()
app.use(express.json())
const port = 3000

console.log('Starting app...')
const dbService = new DbService()
dbService.init()

const cleanup = new Cleanup()
cleanup.init()

app.listen(port, () => console.log(`Server is listening on port ${port}`))

app.post('/add', (req, res) => {
  let msg = {
    'id': Util.generateUuid(),
    'text': res.body,
    'timestamp': Util.generateTimestamp()
  }

  dbService.addToQueue(msg).then(id => res.send(id))
})

app.post('/delete/:uuid', (req, res) => {
  const name = 'processingQueue:' + req.params.uuid
  dbService.deleteProcessingQueue(name)
  cleanup.deleteFromMapOfProcessingQs(name)
})

app.get('/get/:uuid', (req, res) => {
  console.log('Received request from consumer for messages')
  let name = `processingQueue:${req.params.uuid}`

  dbService.moveQToProcessingQueue('queue', name)
  cleanup.addToMapOfProcessingQs(name, Util.generateExpTime())
  dbService.getMessagesFromList(name).then(result => res.send(result))
})
