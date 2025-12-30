const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')

const dev = false
const hostname = 'localhost'
const port = process.env.PORT || 3456

// 设置工作目录
const dir = process.env.NEXT_APP_DIR || process.cwd()

const app = next({ dev, hostname, port, dir })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
