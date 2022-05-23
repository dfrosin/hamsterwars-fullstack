import express from 'express'
const router = express.Router()

import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../database/firebase.js'

router.get('/:id', async (req, res) => {
  let beatenHamsters = []
  const colRef = query(
    collection(db, 'matches'),
    where('winnerId', '==', req.params.id)
  )
  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((snapshot) => {
    const data = snapshot.data()
    if (!beatenHamsters.includes(data.loserId)) {
      beatenHamsters.push(data.loserId)
    }
  })
  if (beatenHamsters.length === 0) {
    res.status(404).send(`Hamster was not found or hasn't won any games`)
    return
  }
  res.status(200).send(beatenHamsters)
})

export default router
