import express from 'express'
const router = express.Router()

import { collection, getDocs } from 'firebase/firestore'
import { db } from '../database/firebase.js'

router.get('/', async (req, res) => {
  let manyMatches = []
  let hamsters = []

  const colRef = collection(db, 'hamsters')

  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((snapshot) => {
    hamsters.push({ ...snapshot.data(), id: snapshot.id })
  })
  let mostGames = hamsters[0].games
  hamsters.forEach((hamster) => {
    if (hamster.games > mostGames) {
      mostGames = hamster.games
      manyMatches = [hamster.id]
    } else if (hamster.games === mostGames) {
      manyMatches.push(hamster.id)
    }
  })
  res.status(200).send(manyMatches)
})

export default router
