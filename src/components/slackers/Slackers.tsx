import './slackers.css'
import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { Hamster } from '../../models/Hamster'
import { fixUrl } from '../../utils'
import HamstersAtom from '../../atoms/HamstersAtom'
import GalleryCard from '../galleryCard/GalleryCard'
import Loading from '../loading/Loading'

function Slackers() {
  const [hamsters, setHamsters] = useRecoilState<Hamster[] | null>(HamstersAtom)
  const [mostHamsters, setMostHamsters] = useState<Hamster[] | null>(null)
  const [fewestHamsters, setFewestHamsters] = useState<Hamster[] | null>(null)

  useEffect(() => {
    async function getData(): Promise<void> {
      const manyResponse: Response = await fetch(fixUrl('/manyMatches'))
      const manyData: string[] = await manyResponse.json()
      const fewestResponse: Response = await fetch(fixUrl('/fewMatches'))
      const fewestData: string[] = await fewestResponse.json()
      if (hamsters) {
        setMostHamsters(
          [...hamsters].filter((hamster) =>
            manyData.find((id) => id === hamster.id)
          )
        )
        setFewestHamsters(
          [...hamsters].filter((hamster) =>
            fewestData.find((id) => id === hamster.id)
          )
        )
      }
    }
    getData()
  }, [])
  return (
    <div className="slackers">
      {mostHamsters && fewestHamsters ? (
        <>
          <h2>Pigga hamstrar</h2>
          <h3>{mostHamsters[0].games} spelade matcher</h3>
          <div className="fighter-hamsters">
            {mostHamsters.slice(0, 5).map((hamster) => (
              <GalleryCard hamster={hamster} gallery={false} key={hamster.id} />
            ))}
          </div>
          <h2>Lata hamstrar</h2>
          <h3>{fewestHamsters[0].games} spelade matcher</h3>
          <div className="slacker-hamsters">
            {fewestHamsters.slice(0, 5).map((hamster) => (
              <GalleryCard hamster={hamster} gallery={false} key={hamster.id} />
            ))}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Slackers
