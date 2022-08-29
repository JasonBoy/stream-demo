import { Readable, Writable } from 'node:stream'
import fs from 'node:fs'
import { sleep } from './utils.js'

const url = 'https://www.bilibili.com'

async function fetchData() {
  const response = await fetch(url)
  const size = response.headers.get('content-length')
  let readableByteStream = response.body
  // 解码
  readableByteStream = readableByteStream.pipeThrough(
    new TextDecoderStream('utf-8')
  )
  let chunks = 0
  for await (const stringChunk of readableByteStream) {
    console.log('----------')
    console.log(stringChunk)
    console.log('-----chunk end-----')
    chunks++
  }
  console.log('total chunks: ', chunks, ', size: ', size)
  // console.log(response.headers)
}

function createReadableStream() {
  let pullCount = 0
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array([1, 2, 3]))
      controller.enqueue({ a: 1 })
      controller.enqueue('line-1')
      controller.enqueue('line-2')
      console.log('desiredSize:', controller.desiredSize)
      // controller.close();
    },
    pull(controller) {
      console.log('in pulll desiredSize:', controller.desiredSize)
      if (pullCount >= 2) {
        controller.close()
        return
      }
      controller.enqueue(`line-${pullCount + 3}`)
      pullCount++
      console.log('in pulll after enqueue desiredSize:', controller.desiredSize)
    },
    cancel(reason) {
      console.log('canceled: ', reason)
    }
  })
}
async function consumeReadableStream() {
  const readableStream = createReadableStream()

  // const reader = readableStream.getReader()
  for await (const chunk of readableStream) {
    console.log(typeof chunk, ':', chunk)
    //
    // if (chunk === 'line-3') {
    //   // reader.cancel(new Error('too many lines'))
    //   return
    // }
  }
  console.log('readableStream state:', readableStream)
}

function createWritableStream() {
  return new WritableStream({
    start(controller) {
      console.log('write start...')
      this.ret = ''
    },
    write(chunk, controller) {
      console.log('write chunk: ', chunk)
      this.ret += `${chunk}_`
    },
    close() {
      console.log('writable stream close, ret:')
      // console.log(this.ret)
    },
    abort(err) {
      console.log('writable stream abort: ', err)
    }
  })
}

async function consumeWritableStream() {
  const writableStream = createWritableStream()
  const writer = writableStream.getWriter()
  writer.write('a')
  await writer.ready
  writer.write('b')
  await writer.ready
  writer.write('c')
  await writer.close()
  console.log('done write')
  writer.releaseLock()
}

function createTransformStream() {
  return new TransformStream({
    start(controller) {
      console.log('transform start...')
      controller.enqueue('start chunk...\n')
    },
    async transform(chunk, controller) {
      console.log('transform chunk...')
      await sleep(1000)
      controller.enqueue(String(chunk).toUpperCase() + '\n\n')
    },
    flush(controller) {
      controller.enqueue('final chunk...')
    }
  })
}

async function consumeTransformStream() {
  const rs = createReadableStream()
  const ts = createTransformStream()
  const ws = createWritableStream()
  const wsFile = Writable.toWeb(
    fs.createWriteStream('./dist/transform-to-file.txt')
  )
  const [r1, r2] = rs.pipeThrough(ts).tee()
  r1.pipeTo(ws)
  r2.pipeTo(wsFile)
  // rs.pipeTo(ws)
}

async function consumeTransformStreamFile() {
  const rs = createReadableStream()
  const ts = createTransformStream()
  const ws = Writable.toWeb(
    fs.createWriteStream('./dist/transform-to-file.txt')
  )
  rs.pipeThrough(ts).pipeTo(ws)
}

async function fetchAndGunzipFile(url) {
  url =
    url ||
    // 'https://shjd-boss.bilibili.co/session_replay_data/LTqWw5mhSueIZEQFNShd8/VIHHT3I8wJByvaYLXwDYV'
    'https://shjd-boss.bilibili.co/session_replay_data/LTqWw5mhSueIZEQFNShd8/nGICINv_APzQnZ2Lj-RDt'

  let ret = ''
  let size = 0
  let gunzipSize = 0
  const res = await fetch(url)
  await res.body
    .pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          size += chunk.byteLength
          controller.enqueue(chunk)
        }
      })
    )
    .pipeThrough(new DecompressionStream('gzip'))
    .pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          gunzipSize += chunk.byteLength
          controller.enqueue(chunk)
        }
      })
    )
    .pipeThrough(new TextDecoderStream())
    .pipeTo(
      new WritableStream({
        start() {
          this.count = 0
        },
        write(chunk) {
          this.count++
          console.log(chunk.length)
          ret += chunk
        },
        close() {
          console.log('count:', this.count)
        }
      })
    )
  return {
    str: ret,
    size,
    gunzipSize
  }
}

;(async function run() {
  // fetchData()
  // consumeReadableStream()
  // consumeWritableStream()
  // consumeTransformStream()
  // consumeTransformStreamFile()

  const { size, gunzipSize, str } = await fetchAndGunzipFile()
  const ret = JSON.parse(str)
  console.log(ret)
  console.log('length: ', ret.length)
  console.log(`size [${size}] -> [${gunzipSize}]`)
})()
