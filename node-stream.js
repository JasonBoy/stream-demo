import { Readable } from 'node:stream'

// const url = 'http://ad.bilibili.co'
const url = 'http://www.baidu.com'

const response = await fetch(url)
const readableByteStream = response.body
const size = response.headers.get('content-length')
const readableStream = readableByteStream.pipeThrough(
  new TextDecoderStream('utf-8')
)
let chunks = 0
for await (const stringChunk of readableStream) {
  console.log('----------')
  console.log(stringChunk)
  console.log('-----chunk end-----')
  chunks++
}
console.log('total chunks: ', chunks, ', size: ', size)
console.log(response.headers)
