import './matchWinners.css'
import { useState, useEffect } from 'react'
import { fixUrl, correctImgName } from '../../utils'
import { useRecoilState } from 'recoil'
import { Hamster } from '../../models/Hamster'
import { NewMatch } from '../../models/NewMatch'
import HamstersAtom from '../../atoms/HamstersAtom'
import Loading from '../loading/Loading'

interface Props {
  winnerId: string
}

function MatchWinners({ winnerId }: Props) {
  const [data, setData] = useState<NewMatch[] | null>(null)
  const [error, setError] = useState<boolean>(false)
  const [hamsters, setHamsters] = useRecoilState<Hamster[] | null>(HamstersAtom)
  const [beatenHamsters, setBeatenHamsters] = useState<Hamster[] | null>(null)
  useEffect(() => {
    async function getData(): Promise<void> {
      try {
        const response: Response = await fetch(
          fixUrl(`/matchWinners/${winnerId}`)
        )
        const apiData: NewMatch[] = await response.json()
        console.log(apiData)
        setData(apiData)
      } catch (e: any) {
        setError(true)
        console.log(e)
      }
    }
    getData()
  }, [])
  useEffect(() => {
    if (data && hamsters) {
      let hamsterArray = data
        .map((beaten) => {
          let hamster: Hamster | null = null
          for (let i = 0; i < hamsters.length - 1; i++) {
            if (hamsters[i].id === beaten.loserId) {
              hamster = hamsters[i]
            }
            if (hamster) {
              break
            }
          }
          if (!hamster) {
            return null
          } else {
            return hamster
          }
        })
        .filter((maybeHamster) => maybeHamster !== null) as Hamster[]
      setBeatenHamsters(hamsterArray)
    }
  }, [data])
  return (
    <div className="match-winners">
      <h3>Besegrade Hamstrar</h3>
      {beatenHamsters !== null && !error ? (
        beatenHamsters.map((hamster) => (
          <div key={hamster.id} className="beaten-hamster">
            <p>{hamster.name}</p>
            <img
              src={correctImgName(hamster.imgName)}
              alt={`picture of ${hamster.name}`}
            />
          </div>
        ))
      ) : (
        <p className="not-able">Kunde inte hämta besegrade hamstrar</p>
      )}
    </div>
  )
}

export default MatchWinners
