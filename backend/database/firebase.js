import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Funkar i senaste versionen och troligtvis ett måste i kommande versioner
// import firebaseConfig from './firebaseConfig.json' assert { type: 'json' }
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
// const firebaseConfig = require('./firebaseConfig.json')

let firebaseConfig
if (process.env.PRIVATE_KEY) {
  firebaseConfig = JSON.parse(process.env.PRIVATE_KEY)
} else {
  firebaseConfig = require('./firebaseConfig.json')
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

export { db }
