import { useState, useEffect } from 'react'
import './history.css'
import { useRecoilState } from 'recoil'
import GameCard from '../gameCard/GameCard'
import Loading from '../loading/Loading'
import { Hamster } from '../../models/Hamster'
import { Match } from '../../models/Match'
import { fixUrl } from '../../utils'
import HamstersAtom from '../../atoms/HamstersAtom'
import MatchesAtom from '../../atoms/MatchesAtom'

interface GameInfo {
  winner: Hamster
  loser: Hamster
  matchId: string
  match: Match
}

function History() {
  const [matches, setMatches] = useRecoilState<Match[] | null>(MatchesAtom)
  const [hamsters, setHamsters] = useRecoilState<Hamster[] | null>(HamstersAtom)
  const [games, setGames] = useState<GameInfo[] | null>(null)
  const [render, setRender] = useState(10)
  const [error, setError] = useState<string | null>(null)

  async function getMatches() {
    const matchResponse: Response = await fetch(fixUrl('/matches'))
    const matchData: Match[] = await matchResponse.json()
    setMatches(matchData)
  }

  async function getHamsters() {
    const hamsterResponse: Response = await fetch(fixUrl('/hamsters'))
    const hamsterData: Hamster[] = await hamsterResponse.json()
    setHamsters(hamsterData)
  }

  useEffect(() => {
    async function getData(): Promise<void> {
      if (matches === null) {
        getMatches()
      }
      if (hamsters === null) {
        getHamsters()
      }
    }
    if (matches === null || hamsters === null) {
      getData()
    }
  }, [])
  useEffect(() => {
    // När vi hämtat både matcher och hamstrar
    // Lägg in dem i en separat Array (games)
    // Så det räcker med att göra två fetchanrop för alla matcher

    if (matches && hamsters) {
      let gameArray = matches
        .map((match) => {
          let game: GameInfo
          let winnerHamster: Hamster | null = null
          let loserHamster: Hamster | null = null
          for (let i = 0; i < hamsters.length - 1; i++) {
            if (hamsters[i].id === match.winnerId) {
              winnerHamster = hamsters[i]
            }
            if (hamsters[i].id === match.loserId) {
              loserHamster = hamsters[i]
            }
            if (winnerHamster && loserHamster) {
              break
            }
          }
          if (!winnerHamster || !loserHamster) {
            return null
          } else {
            game = {
              winner: winnerHamster,
              loser: loserHamster,
              matchId: match.id,
              match: match
            }
            return game
          }
        })
        .filter((maybeGame) => maybeGame !== null) as GameInfo[]
      setGames(gameArray)
    }
  }, [matches, hamsters])
  return (
    <div className="history">
      {games ? (
        <h2>{`Visar de ${
          render <= games.length ? render : games.length
        } senaste matcherna`}</h2>
      ) : null}
      {games ? (
        games
          .slice(0, render)
          .map((game) => (
            <GameCard
              key={game.matchId}
              match={game.match}
              winner={game.winner}
              loser={game.loser}
            />
          ))
      ) : (
        <Loading />
      )}
      {games ? (
        <div className="button-container">
          {render === 10 ? null : (
            <button onClick={() => setRender((render) => render - 10)}>
              Visa färre
            </button>
          )}
          {render >= games.length ? null : (
            <button onClick={() => setRender((render) => render + 10)}>
              Visa fler
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default History
