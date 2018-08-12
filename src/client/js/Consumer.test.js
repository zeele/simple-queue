/* eslint-env jest */
import { Consumer } from './Consumer'

jest.mock('./util', () => ({
  generateShortUuid: jest.fn(() => '12345')
}))

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve())
}))

const consumerConfig = {
  getUrl: 'http://localhost:3000/get/'
}
const consumer = new Consumer(consumerConfig)
const { get: mockGet } = require('axios')

test('Consumer reqesting message from queue', () => {
  consumer.getMessages()
  expect(mockGet).toHaveBeenCalledWith('http://localhost:3000/get/12345')
})
