import express from 'express'
const router = express.Router()

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../database/firebase.js'

const colRef = collection(db, 'hamsters')

router.get('/', async (req, res) => {
  let hamsters = []

  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((snapshot) => {
    hamsters.push({ ...snapshot.data(), id: snapshot.id })
  })
  console.log(
    '\x1b[33m%s\x1b[0m',
    '--- GET request for all hamsters occured ---'
  )
  res.status(200).send(hamsters)
})

let oldRandom = {
  id: 'placeholder'
}

router.get('/:getQuery', async (req, res) => {
  let hamsterData = req.params.getQuery
  if (hamsterData === 'random') {
    let hamsters = []
    const snapshot = await getDocs(colRef)
    snapshot.docs.forEach((snapshot) => {
      hamsters.push({ ...snapshot.data(), id: snapshot.id })
      console.log('Hamsters in forEach: ', snapshot.data)
    })
    let randomHamster = hamsters[Math.floor(Math.random() * hamsters.length)]
    console.log('From random, hamsters: ', hamsters)
    console.log('RandomHamster.id: ', randomHamster.id)
    for (; randomHamster.id === oldRandom.id; ) {
      randomHamster = hamsters[Math.floor(Math.random() * hamsters.length)]
    }
    console.log(
      '\x1b[33m%s\x1b[0m',
      'GET request for a random hamster occured: ',
      randomHamster
    )
    oldRandom = randomHamster
    res.status(200).send(randomHamster)
    return
  }
  if (hamsterData === 'cutest') {
    let hamsters = []
    let cutest = []
    const colRef = query(collection(db, 'hamsters'), orderBy('wins', 'desc'))
    const snapshot = await getDocs(colRef)
    snapshot.docs.forEach((snapshot) => {
      hamsters.push({ ...snapshot.data(), id: snapshot.id })
    })
    let difference = hamsters[0].wins - hamsters[0].defeats
    hamsters.forEach((hamster) => {
      let currentDifference = hamster.wins - hamster.defeats
      if (currentDifference > difference) {
        difference = currentDifference
        cutest = [hamster]
      } else if (currentDifference === difference) {
        cutest.push(hamster)
      }
    })
    res.status(200).send(cutest)
    return
  }
  const docRef = doc(colRef, hamsterData)
  const snapshot = await getDoc(docRef)
  const data = snapshot.data()
  if (snapshot.exists()) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      'GET request for a specific hamster occured',
      data
    )
    res.status(200).send(data)
    return
  }
  res.sendStatus(404)
})

router.post('/', async (req, res) => {
  console.log('\x1b[33m%s\x1b[0m', 'Add hamster attempt: ', req.body)
  if (
    req.body.name === undefined ||
    req.body.age === undefined ||
    req.body.favFood === undefined ||
    req.body.loves === undefined ||
    req.body.imgName === undefined ||
    req.body.wins === undefined ||
    req.body.defeats === undefined ||
    (req.body.games === undefined && req.body.length === 8)
  ) {
    console.log(
      '\x1b[31m%s\x1b[0m',
      '--- Failed POST request for hamsters occured ---'
    )
    res
      .status(400)
      .send('The supplied object does not contain the correct data')
    return
  }
  let newHamster = req.body
  const addHamster = await addDoc(colRef, newHamster)
  const hamsterId = { id: addHamster.id }
  console.log(
    '\x1b[33m%s\x1b[0m',
    'POST request for hamsters occured successfully: ',
    hamsterId
  )
  res.status(200).send(hamsterId)
})

router.put('/:id', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.sendStatus(400)
    return
  }
  const toBeUpdated = req.params.id
  const updateData = req.body
  const docRef = doc(colRef, toBeUpdated)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    await updateDoc(docRef, updateData)
    res.sendStatus(200)
    return
  }
  res.sendStatus(404)
})

router.delete('/:id', async (req, res) => {
  const toBeDeleted = req.params.id
  const docRef = doc(colRef, toBeDeleted)
  const snapshot = await getDoc(docRef)
  console.log('\x1b[33m%s\x1b[0m', 'Hamster to be deleted: ', toBeDeleted)
  if (snapshot.exists()) {
    await deleteDoc(docRef)
    console.log(
      '\x1b[33m%s\x1b[0m',
      '--- Successful hamster delete attempt occured ---'
    )
    res.sendStatus(200)
    return
  }
  console.log(
    '\x1b[31m%s\x1b[0m',
    '--- Failed hamster delete attempt occured ---'
  )
  res.sendStatus(404)
})

export default router
