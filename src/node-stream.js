import { Transform, PassThrough, Readable, Writable } from 'node:stream'
import fs from 'node:fs'

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

// upperCaseStream()

// process.stdin.pipe(new PassThrough()).pipe(process.stdout)

async function fetchFileAndSave() {
  const res = await fetch('http://localhost:3030/stream-2g', {headers: {origin: 'http://localhost:3030'}})
  const [r1, r2] = res.body.tee()

  await Promise.all([
    r1.pipeTo(Writable.toWeb(fs.createWriteStream('./dist/copied-tee-1.txt'))),
    r2.pipeTo(Writable.toWeb(fs.createWriteStream('./dist/copied-tee-2.txt'))),
  ])
  console.log('done')



  // let readable = Readable.fromWeb(res.body)
  // readable.pipe(fs.createWriteStream('./dist/copied1.txt'))
  // const ws = readable.pipe(fs.createWriteStream('./dist/copied2.txt'))
  // ws.on('finish', () => {
  //   console.log('done')
  // })
  // ws.on('error', err => {
  //   console.error('err: ', err)
  // })
}
fetchFileAndSave()
