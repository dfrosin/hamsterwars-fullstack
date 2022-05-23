import express from 'express'
const app = express()
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const staticFolder = path.join(__dirname, 'public')

const PORT = process.env.PORT || 8090
const distPath = path.join(__dirname + '/../dist')
import hamsters from './routes/hamsters.js'
import matches from './routes/matches.js'
import matchWinners from './routes/matchWinners.js'
import winners from './routes/winners.js'
import losers from './routes/losers.js'
import defeated from './routes/defeated.js'
import score from './routes/score.js'
import fewMatches from './routes/fewMatches.js'
import manyMatches from './routes/manyMatches.js'

app.use(cors())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.static(distPath))

app.use('/', (req, res, next) => {
  console.log(
    '\x1b[36m"%s\x1b[0m',
    `Request method: ${req.method} occured at: ${req.url}`
  )
  next()
})
app.use(express.static(staticFolder))

app.use('/hamsters', hamsters)
app.use('/matches', matches)
app.use('/matchWinners', matchWinners)
app.use('/winners', winners)
app.use('/losers', losers)
app.use('/defeated', defeated)
app.use('/score', score)
app.use('/fewMatches', fewMatches)
app.use('/manyMatches', manyMatches)

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})
