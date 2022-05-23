import express from 'express'
const router = express.Router()

import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../database/firebase.js'

router.get('/', async (req, res) => {
  let hamsters = []
  let result = []
  const colRef = query(collection(db, 'hamsters'), orderBy('defeats', 'desc'))
  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((snapshot) => {
    hamsters.push({ ...snapshot.data(), id: snapshot.id })
  })
  for (let i = 0; result.length < 5; i++) {
    result.push(hamsters[i])
  }
  res.status(200).send(result)
})

export default router
