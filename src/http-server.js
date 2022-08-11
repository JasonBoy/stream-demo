import http from 'node:http'
import fs from 'node:fs'

const server = http.createServer()

const filename = './dist/big-file.txt'
const filename2g = './dist/big-file-5m.txt'

server.on('request', (req, res) => {
  console.log(req.url)
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
    default: {
      const src = fs.createReadStream(filename)
      src.pipe(res)
    }
  }
})

server.listen(3030)
