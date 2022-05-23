import express from 'express'
const router = express.Router()

import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../database/firebase.js'

router.get('/:id', async (req, res) => {
  let matches = []
  const q = query(
    collection(db, 'matches'),
    where('winnerId', '==', req.params.id)
  )
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    matches.push(doc.data())
  })
  if (matches.length > 0) {
    res.status(200).send(matches)
    return
  }
  res
    .status(404)
    .send('The provided id has not won any matches or does not exist')
})

export default router
