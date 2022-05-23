import { useState, useEffect } from 'react'
import './hamsterCard.css'
import { Hamster } from '../../models/Hamster'
import { fixUrl, correctImgName } from '../../utils'
import { AddHamster } from '../../models/AddHamster'

interface Props {
  winnerHamster: Hamster | null
  setWinnerHamster: (h: Hamster) => void
  loserHamster: Hamster | null
  setLoserHamster: (h: Hamster) => void
  loaded: boolean
  setLoaded: (b: boolean) => void
}

function HamsterCard(props: Props) {
  let updateHamster: AddHamster
  const [hamster, setHamster] = useState<null | Hamster>(null)
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    async function getData(): Promise<void> {
      if (!hamster) {
        const response: Response = await fetch(fixUrl('/hamsters/random'))
        const data: Hamster = await response.json()
        setHamster(data)
        setImgUrl(correctImgName(data.imgName))
        props.setLoaded(true)
      }
    }
    getData()
  }, [])
  useEffect(() => {
    if (
      hamster !== null &&
      props.winnerHamster &&
      props.winnerHamster.id === hamster.id
    ) {
      updateHamster = {
        name: hamster.name,
        age: hamster.age,
        games: hamster.games + 1,
        wins: hamster.wins + 1,
        defeats: hamster.defeats,
        loves: hamster.loves,
        favFood: hamster.favFood,
        imgName: hamster.imgName
      }
    } else if (hamster !== null) {
      props.setLoserHamster(hamster)
      updateHamster = {
        name: hamster.name,
        age: hamster.age,
        games: hamster.games + 1,
        wins: hamster.wins,
        defeats: hamster.defeats + 1,
        loves: hamster.loves,
        favFood: hamster.favFood,
        imgName: hamster.imgName
      }
    }
    const settings = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateHamster)
    }
    async function putHamster() {
      if (hamster !== null) {
        try {
          const response: Response = await fetch(
            fixUrl(`/hamsters/${hamster.id}`),
            settings
          )
          const data: any = await response.json()
          return console.log(data)
        } catch (e) {
          return e
        }
      }
    }
    putHamster()
  }, [props.winnerHamster])

  return (
    <>
      {hamster ? (
        <div
          className={`hamster-card${props.loaded ? ' loaded-hamster' : ''}`}
          data-before={`Vill du rösta på ${hamster.name}?`}
          onClick={() => props.setWinnerHamster(hamster)}
        >
          <img
            className="hamster-img"
            src={imgUrl}
            alt={`picture of ${hamster.name}`}
          />
          <p> Namn: {hamster.name}</p>
          <p> Ålder: {hamster.age}</p>
          <p>
            {hamster.name} gillar att {hamster.loves} och äter helst
            {` ${hamster.favFood}`}.
          </p>
        </div>
      ) : (
        <div className={`hamster-card`}></div>
      )}
    </>
  )
}

export default HamsterCard
