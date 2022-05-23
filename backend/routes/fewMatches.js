import express from 'express'
const router = express.Router()

import { collection, getDocs } from 'firebase/firestore'
import { db } from '../database/firebase.js'

router.get('/', async (req, res) => {
  let fewMatches = []
  let hamsters = []

  const colRef = collection(db, 'hamsters')

  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((snapshot) => {
    hamsters.push({ ...snapshot.data(), id: snapshot.id })
  })
  let leastGames = hamsters[0].games
  hamsters.forEach((hamster) => {
    if (hamster.games < leastGames) {
      leastGames = hamster.games
      fewMatches = [hamster.id]
    } else if (hamster.games === leastGames) {
      fewMatches.push(hamster.id)
    }
  })
  res.status(200).send(fewMatches)
})

export default router
