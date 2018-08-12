/* eslint-env jest */
import { Producer } from './Producer'

jest.mock('./util', () => ({
  generateTimestamp: jest.fn(() => '10:00:00'),
  generateUuid: jest.fn(() => '12345')
}))

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({}))
}))

const producerConfig = {
  url: 'http://localhost:3000/add',
  interval: 2000
}
const producer = new Producer(producerConfig)
const { post: mockPost } = require('axios')

test('Producer posting messages to queue', () => {
  producer.addMessage().then(result => {
    expect(mockPost).toHaveBeenCalledWith('http://localhost:3000/add',
      'foo')
  })
})
