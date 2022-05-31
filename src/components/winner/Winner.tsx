import { useState, useEffect } from 'react'
import './winner.css'
import { Hamster } from '../../models/Hamster'
import { correctImgName } from '../../utils'

interface Props {
  setWinner: (b: boolean) => void
  winnerHamster: Hamster
  setWinnerHamster: (h: Hamster | null) => void
  loserHamster: Hamster
  setLoserHamster: (h: Hamster | null) => void
  setLoaded: (b: boolean) => void
}

function Winner({
  setWinner,
  winnerHamster,
  setWinnerHamster,
  loserHamster,
  setLoserHamster,
  setLoaded
}: Props) {
  function newGame() {
    setWinner(false)
    setWinnerHamster(null)
    setLoserHamster(null)
    setLoaded(false)
  }
  const [winnerImgUrl, setWinnerImgUrl] = useState('')
  const [loserImgUrl, setLoserImgUrl] = useState('')
  useEffect(() => {
    setWinnerImgUrl(correctImgName(winnerHamster.imgName))
    setLoserImgUrl(correctImgName(loserHamster.imgName))
  }, [])
  return (
    <div className="winner">
      <div className="winner-container">
        <div className="behind-h2"></div>
        <h2>Vinnaren</h2>
        <h3>{winnerHamster.name}</h3>
        <img
          className="hamster-image"
          src={winnerImgUrl}
          alt={`picture of ${winnerHamster.name}`}
        />
        <p> Ålder: {winnerHamster.age}</p>
        <p>
          Här har vi en hamster som gillar att {winnerHamster.loves} och äter
          helst
          {` ${winnerHamster.favFood}`}.<br /> {winnerHamster.name}{' '}
          {winnerHamster.games + 1
            ? `har spelat
              ${
                winnerHamster.games + 1 === 1
                  ? 'en match'
                  : `${winnerHamster.games + 1} matcher`
              }${
                winnerHamster.wins + 1
                  ? `, vunnit ${
                      winnerHamster.wins + 1 === 1
                        ? 'en gång '
                        : `${winnerHamster.wins + 1} gånger `
                    }`
                  : ' men har inte vunnit någon gång'
              }
              ${
                winnerHamster.defeats
                  ? `och förlorat ${
                      winnerHamster.defeats === 1
                        ? 'en gång'
                        : `${winnerHamster.defeats} gånger`
                    }`
                  : 'och aldrig förlorat'
              }.`
            : 'har inte spelat några matcher.'}
        </p>
      </div>
      <div className="loser-container">
        <h2>Förloraren</h2>
        <h3>{loserHamster.name}</h3>
        <img
          className="hamster-image"
          src={loserImgUrl}
          alt={`picture of ${loserHamster.name}`}
        />
        <p> Ålder: {loserHamster.age}</p>
        <p>
          Här har vi en hamster som gillar att {loserHamster.loves} och äter
          helst
          {` ${loserHamster.favFood}`}.<br /> {loserHamster.name}{' '}
          {loserHamster.games + 1
            ? `har spelat
              ${
                loserHamster.games + 1 === 1
                  ? 'en match'
                  : `${loserHamster.games + 1} matcher`
              }${
                loserHamster.wins
                  ? `, vunnit ${
                      loserHamster.wins === 1
                        ? 'en gång '
                        : `${loserHamster.wins} gånger `
                    }`
                  : 'men har inte vunnit någon gång'
              }
              ${
                loserHamster.defeats + 1
                  ? `och förlorat ${
                      loserHamster.defeats + 1 === 1
                        ? 'en gång'
                        : `${loserHamster.defeats + 1} gånger`
                    }`
                  : 'och aldrig förlorat'
              }.`
            : 'har inte spelat några matcher.'}
        </p>
      </div>
      <button className="new-game-button" onClick={newGame}>
        Ny match
      </button>
    </div>
  )
}

export default Winner
