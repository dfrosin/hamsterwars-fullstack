import { useState, useEffect } from 'react'
import './fight.css'
import { Hamster } from '../../models/Hamster'
import { Match } from '../../models/Match'
import { NewMatch } from '../../models/NewMatch'
import HamsterCard from '../hamsterCard/HamsterCard'
import Winner from '../winner/Winner'
import { fixUrl } from '../../utils'
import { useRecoilState } from 'recoil'
import HamstersAtom from '../../atoms/HamstersAtom'
import MatchesAtom from '../../atoms/MatchesAtom'

function Fight() {
  const [winnerHamster, setWinnerHamster] = useState<null | Hamster>(null)
  const [winner, setWinner] = useState<boolean>(false)
  const [loserHamster, setLoserHamster] = useState<null | Hamster>(null)
  const [matches, setMatches] = useRecoilState<Match[] | null>(MatchesAtom)
  const [hamsters, setHamsters] = useRecoilState<Hamster[] | null>(HamstersAtom)
  const [loaded, setLoaded] = useState<boolean>(false)
  let newMatch: NewMatch
  useEffect(() => {
    if (winnerHamster !== null && loserHamster !== null) {
      let matchTime = Date.now()
      newMatch = {
        winnerId: winnerHamster.id,
        loserId: loserHamster.id,
        time: matchTime
      }
      console.log('winner', winnerHamster)
      console.log('loser', loserHamster)
    }
    const settings = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMatch)
    }
    async function postMatch() {
      const response: Response = await fetch(fixUrl('/matches'), settings)
      const hamsterResponse: Response = await fetch(fixUrl('/hamsters'))
      const matchResponse: Response = await fetch(fixUrl('/matches'))
      const data: Object = await response.json()
      const matchData: Match[] = await matchResponse.json()
      const hamsterData: Hamster[] = await hamsterResponse.json()
      setMatches(matchData)
      setHamsters(hamsterData)
      setWinner(true)
      console.log('posting match')
      return console.log(data)
    }
    if (loserHamster !== null) {
      postMatch()
    }
  }, [loserHamster])
  return (
    <>
      {winner && winnerHamster ? null : (
        <div className="fight-container">
          <h2>Tryck på den hamster du tycker om mest!</h2>
          <div
            className={`fight${loaded ? ' finish' : ' loading'}${
              winnerHamster ? ' close' : ''
            }`}
          >
            <HamsterCard
              winnerHamster={winnerHamster}
              setWinnerHamster={setWinnerHamster}
              loserHamster={loserHamster}
              setLoserHamster={setLoserHamster}
              loaded={loaded}
              setLoaded={setLoaded}
            />
            <HamsterCard
              winnerHamster={winnerHamster}
              setWinnerHamster={setWinnerHamster}
              loserHamster={loserHamster}
              setLoserHamster={setLoserHamster}
              loaded={loaded}
              setLoaded={setLoaded}
            />
          </div>
        </div>
      )}
      {winner && winnerHamster && loserHamster ? (
        <Winner
          setWinner={setWinner}
          winnerHamster={winnerHamster}
          setWinnerHamster={setWinnerHamster}
          loserHamster={loserHamster}
          setLoserHamster={setLoserHamster}
          setLoaded={setLoaded}
        ></Winner>
      ) : null}
    </>
  )
}

export default Fight
