import './stats.css'
import { useState, useEffect } from 'react'
import { Hamster } from '../../models/Hamster'
import { fixUrl } from '../../utils'
import GalleryCard from '../galleryCard/GalleryCard'
import Loading from '../loading/Loading'

function Stats() {
  const [bestFive, setBestFive] = useState<Hamster[] | null>(null)
  const [worstFive, setWorstFive] = useState<Hamster[] | null>(null)
  useEffect(() => {
    async function getData(): Promise<void> {
      const bestResponse: Response = await fetch(fixUrl('/winners'))
      const worstResponse: Response = await fetch(fixUrl('/losers'))
      const bestData: Hamster[] = await bestResponse.json()
      const worstData: Hamster[] = await worstResponse.json()
      setBestFive(bestData)
      setWorstFive(worstData)
    }
    getData()
  }, [])
  return (
    <div className="stats">
      {bestFive ? (
        <>
          <div className="best-container">
            <h2>Fem av våra bästa hamstrar</h2>
            {bestFive ? (
              bestFive.map((hamster) => (
                <GalleryCard
                  gallery={false}
                  hamster={hamster}
                  key={hamster.id}
                />
              ))
            ) : (
              <Loading />
            )}
          </div>
          <div className="worst-container">
            <h2>Fem av våra sämsta hamstrar</h2>
            {worstFive ? (
              worstFive.map((hamster) => (
                <GalleryCard
                  gallery={false}
                  hamster={hamster}
                  key={hamster.id}
                />
              ))
            ) : (
              <Loading />
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Stats
