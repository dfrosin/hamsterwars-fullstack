import express from 'express'
const router = express.Router()

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  orderBy,
  query
} from 'firebase/firestore'
import { db } from '../database/firebase.js'

const colRef = collection(db, 'matches')

router.get('/', async (req, res) => {
  let matches = []

  const collectionRef = query(
    collection(db, 'matches'),
    orderBy('time', 'desc')
  )
  const snapshot = await getDocs(collectionRef)
  snapshot.docs.forEach((snapshot) => {
    matches.push({ ...snapshot.data(), id: snapshot.id })
  })
  console.log(
    '\x1b[33m%s\x1b[0m',
    '--- GET request for all matches occured ---'
  )
  res.status(200).send(matches)
})

router.get('/:id', async (req, res) => {
  let matchId = req.params.id
  const docRef = doc(colRef, matchId)
  const snapshot = await getDoc(docRef)
  const data = snapshot.data()
  if (snapshot.exists()) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      'GET request for a specific match occured',
      data
    )
    res.status(200).send(data)
    return
  }
  res.sendStatus(404)
})

router.post('/', async (req, res) => {
  console.log('\x1b[33m%s\x1b[0m', 'Add match attempt: ', req.body)
  if (req.body.winnerId === undefined || req.body.loserId === undefined) {
    console.log(
      '\x1b[31m%s\x1b[0m',
      '--- Failed POST request for matches occured ---'
    )
    res
      .status(400)
      .send('The supplied object does not contain the correct data')
    return
  }
  let newMatch = req.body
  const addMatch = await addDoc(colRef, newMatch)
  const matchId = { id: addMatch.id }
  console.log(
    '\x1b[33m%s\x1b[0m',
    'POST request for matches occured successfully: ',
    matchId
  )
  res.status(200).send(matchId)
})

router.delete('/:id', async (req, res) => {
  const toBeDeleted = req.params.id
  const docRef = doc(colRef, toBeDeleted)
  const snapshot = await getDoc(docRef)
  console.log('\x1b[33m%s\x1b[0m', 'Match to be deleted: ', toBeDeleted)
  if (snapshot.exists()) {
    await deleteDoc(docRef)
    console.log(
      '\x1b[33m%s\x1b[0m',
      '--- Successful match delete attempt occured ---'
    )
    res.sendStatus(200)
    return
  }
  console.log(
    '\x1b[31m%s\x1b[0m',
    '--- Failed match delete attempt occured ---'
  )
  res.sendStatus(404)
})

export default router
