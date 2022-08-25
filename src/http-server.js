import http from 'node:http'
import fs from 'node:fs'

const server = http.createServer()

const filename = './dist/big-file.txt'
const filename2g = './dist/big-file-5m.txt'
const filename_1_3g = './dist/big-file-3m.txt'
const filename_1_5g = './dist/big-file-1_5g.txt'
const filename_1_5g_plus_1 = './dist/big-file-1_5g_plus_1.txt'

server.on('request', (req, res) => {
  console.log(req.url, req.headers.origin)
  
  // add cors
  res.setHeader('access-control-allow-origin', req.headers['origin'] || '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  if (req.method.toLowerCase() === 'options') {
    res.end()
    return
  }
  // res.end(`[${req.method}]-${req.url}`)
  switch (req.url) {
    case '/file':
      {
        fs.readFile(filename, (err, data) => {
          if (err) throw err

          res.end(data)
        })
      }
      break
    case '/file-2g':
      {
        fs.readFile(filename2g, (err, data) => {
          if (err) throw err

          res.end(data)
        })
      }
      break
    case '/stream-2g':
      {
        const src = fs.createReadStream(filename2g)
        src.pipe(res)
      }
      break
    case '/stream-1-34g':
    {
      const src = fs.createReadStream(filename_1_3g)
      src.pipe(res)
    }
      break
    case '/stream-1-5g':
    {
      const src = fs.createReadStream(filename_1_5g)
      src.pipe(res)
    }
      break
    case '/stream-1-5g-1':
    {
      const src = fs.createReadStream(filename_1_5g_plus_1)
      src.pipe(res)
    }
      break
    default: {
      const src = fs.createReadStream(filename)
      src.pipe(res)
    }
  }
})

server.listen(3030)
