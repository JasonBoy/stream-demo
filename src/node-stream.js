import { Transform, PassThrough, Readable, Writable } from 'node:stream'
import fs from 'node:fs'

// > ll | node src/node-stream.js

function upperCaseStream() {
  let chunkCount = 0
  let totalSize = 0
  const out = process.stdin
    .pipe(
      new Transform({
        transform(chunk, encoding, callback) {
          console.log('chunk encoding: ', encoding)
          chunkCount++
          totalSize += chunk.length
          callback(null, chunk.toString().toUpperCase())
        },
        flush(callback) {
          console.log(
            'flush chunk count: ',
            chunkCount,
            ', total size: ',
            totalSize
          )
          callback(null, 'done...')
        }
      })
    )
    .pipe(process.stdout)
  out.on('close', () => {
    console.log('chunk count: ', chunkCount)
  })
}

async function fetchFileAndSave() {
  const res = await fetch('http://localhost:3030/stream-2g', {
    headers: { origin: 'http://localhost:3030' }
  })
  const [r1, r2] = res.body.tee()

  await Promise.all([
    r1.pipeTo(Writable.toWeb(fs.createWriteStream('./dist/copied-tee-1.txt'))),
    r2.pipeTo(Writable.toWeb(fs.createWriteStream('./dist/copied-tee-2.txt')))
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

upperCaseStream()
// process.stdin.pipe(new PassThrough()).pipe(process.stdout)
// fetchFileAndSave()
