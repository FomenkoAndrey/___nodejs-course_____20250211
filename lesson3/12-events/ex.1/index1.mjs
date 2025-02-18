import { EventEmitter } from 'node:events'

const timeoutEventEmitter = new EventEmitter()

timeoutEventEmitter.on('timeoutCustom', () => {
  console.log('Timeout Event occurred!')
})

setTimeout(() => timeoutEventEmitter.emit('timeoutCustom'), 3000)
