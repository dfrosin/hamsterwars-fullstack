import './rivalry.css'
import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { Hamster } from '../../models/Hamster'
import HamstersAtom from '../../atoms/HamstersAtom'
import { fixUrl, correctImgName } from '../../utils'
import GalleryCard from '../galleryCard/GalleryCard'
import Loading from '../loading/Loading'

interface ChallengeResult {
  challengerWins: number
  defenderWins: number
}

function Rivalry() {
  const [hamsters, setHamsters] = useRecoilState<Hamster[] | null>(HamstersAtom)
  const [defenderArray, setDefenderArray] = useState<Hamster[] | null>(null)
  const [challenger, setChallenger] = useState<Hamster | null>(null)
  const [defender, setDefender] = useState<Hamster | null>(null)
  const [challengeResult, setChallengeResult] =
    useState<ChallengeResult | null>(null)

  useEffect(() => {
    async function getData(): Promise<void> {
      if (challenger && defender) {
        const response: Response = await fetch(
          fixUrl(`/score/${challenger.id}/${defender.id}`)
        )
        const data: ChallengeResult = await response.json()
        setChallengeResult(data)
      }
    }
    getData()
  }, [defender])

  return (
    <div className="rivalry">
      {challengeResult ? (
        <>
          <h2>Resultat</h2>
          {challengeResult.challengerWins === 0 &&
          challengeResult.defenderWins === 0 ? (
            <h3>Dessa hamstrar har aldrig tävlat mot varann</h3>
          ) : null}
          <div className="result-container">
            {challenger && defender ? (
              <>
                <GalleryCard hamster={challenger} gallery={false}></GalleryCard>
                <p>{`${challengeResult.challengerWins} - ${challengeResult.defenderWins}`}</p>
                <GalleryCard hamster={defender} gallery={false}></GalleryCard>
              </>
            ) : (
              <Loading />
            )}
          </div>
        </>
      ) : (
        <>
          {!challenger ? (
            <>
              <h2>Välj en hamster</h2>
              <div className="choose-challenger">
                {hamsters ? (
                  hamsters.map((hamster) => (
                    <div
                      key={hamster.id}
                      className="rivalry-hamster"
                      onClick={() => {
                        setChallenger(hamster)
                        setDefenderArray(
                          [...hamsters].filter((h) => {
                            return h.id !== hamster.id
                          })
                        )
                      }}
                    >
                      <h3>{hamster.name}</h3>
                      <img
                        src={correctImgName(hamster.imgName)}
                        alt={`picture of ${hamster.name}`}
                      />
                    </div>
                  ))
                ) : (
                  <Loading />
                )}
              </div>
            </>
          ) : (
            <>
              <h2>Välj en utmanare</h2>
              <div className="choose-defender">
                {defenderArray ? (
                  defenderArray.map((hamster) => (
                    <div
                      key={hamster.id}
                      className="rivalry-hamster"
                      onClick={() => {
                        setDefender(hamster)
                      }}
                    >
                      <h3>{hamster.name}</h3>
                      <img
                        src={correctImgName(hamster.imgName)}
                        alt={`picture of ${hamster.name}`}
                      />
                    </div>
                  ))
                ) : (
                  <Loading />
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
export default Rivalry
