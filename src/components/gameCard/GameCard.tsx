import { useState, useEffect } from 'react'
import './gameCard.css'
import { useRecoilState } from 'recoil'
import { Hamster } from '../../models/Hamster'
import { AddHamster } from '../../models/AddHamster'
import { Match } from '../../models/Match'
import { fixUrl, correctImgName } from '../../utils'
import MatchesAtom from '../../atoms/MatchesAtom'
import HamstersAtom from '../../atoms/HamstersAtom'

interface Props {
  winner: Hamster
  loser: Hamster
  match: Match
}

function GameCard({ winner, loser, match }: Props) {
  const [winnerImg, setWinnerImg] = useState('')
  const [loserImg, setLoserImg] = useState('')
  const [matches, setMatches] = useRecoilState(MatchesAtom)
  const [hamsters, setHamsters] = useRecoilState(HamstersAtom)
  useEffect(() => {
    setWinnerImg(correctImgName(winner.imgName))
    setLoserImg(correctImgName(loser.imgName))
  }, [])
  async function deleteMatch() {
    let winnerHamster: AddHamster = {
      name: winner.name,
      age: winner.age,
      games: winner.games - 1,
      wins: winner.wins - 1,
      defeats: winner.defeats,
      loves: winner.loves,
      favFood: winner.favFood,
      imgName: winner.imgName
    }
    let loserHamster: AddHamster = {
      name: loser.name,
      age: loser.age,
      games: loser.games - 1,
      wins: loser.wins,
      defeats: loser.defeats - 1,
      loves: loser.loves,
      favFood: loser.favFood,
      imgName: loser.imgName
    }
    async function putWinner() {
      if (winnerHamster !== null) {
        try {
          const response: Response = await fetch(
            fixUrl(`/hamsters/${winner.id}`),
            {
              method: 'PUT',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(winnerHamster)
            }
          )
          const data: any = await response.json()
          return console.log(data)
        } catch (e) {
          return e
        }
      }
    }
    async function putLoser() {
      if (loserHamster !== null) {
        try {
          const response: Response = await fetch(
            fixUrl(`/hamsters/${loser.id}`),
            {
              method: 'PUT',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(loserHamster)
            }
          )
          const data: any = await response.json()
          return console.log(data)
        } catch (e) {
          return e
        }
      }
    }
    putWinner()
    putLoser()
    if (hamsters) {
      let updatedHamsters = [...hamsters].filter((h) => {
        return h.id !== winner.id && h.id !== loser.id
      })
      const winnerWithId: Hamster = {
        name: winner.name,
        age: winner.age,
        games: winner.games - 1,
        wins: winner.wins - 1,
        defeats: winner.defeats,
        loves: winner.loves,
        favFood: winner.favFood,
        imgName: winner.imgName,
        id: winner.id
      }
      const loserWithId: Hamster = {
        name: loser.name,
        age: loser.age,
        games: loser.games - 1,
        wins: loser.wins,
        defeats: loser.defeats - 1,
        loves: loser.loves,
        favFood: loser.favFood,
        imgName: loser.imgName,
        id: loser.id
      }
      updatedHamsters.push(winnerWithId, loserWithId)
      setHamsters(updatedHamsters)
    }
    if (matches) {
      let updatedMatches = [...matches].filter((m) => {
        return m.id !== match.id
      })
      setMatches(updatedMatches)
    }
    const settings = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    try {
      const response: Response = await fetch(
        fixUrl(`/matches/${match.id}`),
        settings
      )
      const data: any = await response.json()
      return console.log(data)
    } catch (e) {
      return e
    }
  }
  return (
    <>
      <div className="game-card">
        <div className="game-winner-container">
          <img
            className="game-image"
            src={winnerImg}
            alt={`picture of ${winner.name}`}
          />
          <p>{winner.name}</p>
          <h3 className="results">vinnare</h3>
        </div>
        <div className="game-loser-container">
          <h3 className="results">förlorare</h3>
          <p>{loser.name}</p>
          <img
            className="game-image"
            src={loserImg}
            alt={`picture of ${loser.name}`}
          />
          <button onClick={deleteMatch} className="delete-match-button">
            x
          </button>
        </div>
      </div>
    </>
  )
}

export default GameCard
