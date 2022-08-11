import { Transform, PassThrough } from 'node:stream'

// > ll | node src/node-stream.js

function upperCaseStream() {
  process.stdin
  .pipe(
    new Transform({
      transform(chunk, encoding, callback) {
        console.log('chunk encoding: ', encoding)
        callback(null, chunk.toString().toUpperCase())
      }
    })
  )
  .pipe(process.stdout)  
}

upperCaseStream()

// process.stdin.pipe(new PassThrough()).pipe(process.stdout)
