import express from 'express'
import { config } from './config/config'

const app = express()
const port = config.port

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})