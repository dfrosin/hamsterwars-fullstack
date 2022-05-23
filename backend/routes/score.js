import express from 'express'
const router = express.Router()

import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../database/firebase.js'

router.get('/:challenger/:defender', async (req, res) => {
  let score = { challengerWins: 0, defenderWins: 0 }
  const challenger = req.params.challenger
  const defender = req.params.defender
  const firstColRef = query(
    collection(db, 'matches'),
    where('winnerId', '==', challenger),
    where('loserId', '==', defender)
  )
  const secondColRef = query(
    collection(db, 'matches'),
    where('winnerId', '==', defender),
    where('loserId', '==', challenger)
  )

  const firstSnapshot = await getDocs(firstColRef)
  const secondSnapshot = await getDocs(secondColRef)
  firstSnapshot.docs.forEach((snapshot) => {
    const data = snapshot.data()
    if (data.winnerId === challenger) {
      score.challengerWins++
    } else {
      score.defenderWins++
    }
  })
  secondSnapshot.docs.forEach((snapshot) => {
    const data = snapshot.data()
    if (data.winnerId === challenger) {
      score.challengerWins++
    } else {
      score.defenderWins++
    }
  })
  res.status(200).send(score)
})

export default router
