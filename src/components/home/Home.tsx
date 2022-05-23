import { useEffect, useState } from 'react'
import './home.css'
import { Hamster } from '../../models/Hamster'
import { fixUrl, correctImgName } from '../../utils'
import exampleHamster from '../../hamster-logo.png'

function Home() {
  const [cutest, setCutest] = useState<Hamster | null>(null)
  const [imgUrl, setImgUrl] = useState('')
  const [error, setError] = useState()
  async function getData(): Promise<void> {
    const response: Response = await fetch(fixUrl('/hamsters/cutest'))
    try {
      const data: Hamster[] | Hamster = await response.json()
      let hamster: Hamster
      if (Array.isArray(data)) {
        hamster = data[Math.floor(Math.random() * data.length)]
      } else {
        hamster = data
      }
      setImgUrl(correctImgName(hamster.imgName))
      setCutest(hamster)
    } catch (e: any) {
      setError(e)
    }
  }
  useEffect(() => {
    getData()
  }, [])
  return (
    <div className="home">
      <h2>Vår mest framgångsrika hamster</h2>
      {cutest !== null ? (
        <div className="cutest-container">
          <h3>{cutest.name}</h3>
          <img
            className="hamster-image"
            src={imgUrl}
            alt={`picture of ${cutest.name}`}
          />
          <p> Ålder: {cutest.age}</p>
          <p>
            Här har vi en hamster som gillar att {cutest.loves} och äter helst
            {` ${cutest.favFood}`}.<br /> {cutest.name}{' '}
            {cutest.games
              ? `har spelat
              ${cutest.games === 1 ? 'en match' : `${cutest.games} matcher`}${
                  cutest.wins
                    ? `, vunnit ${
                        cutest.wins === 1
                          ? 'en gång '
                          : `${cutest.wins} gånger `
                      }`
                    : 'men har inte vunnit någon gång'
                }
              ${
                cutest.defeats
                  ? `och förlorat ${
                      cutest.defeats === 1
                        ? 'en gång'
                        : `${cutest.defeats} gånger`
                    }`
                  : 'och aldrig förlorat'
              }.`
              : 'har inte spelat några matcher.'}
          </p>
        </div>
      ) : (
        <>
          <p> Det går inte att nå servern just nu </p>
          <img className="try-again-img" src={exampleHamster} alt="" />
          <button className="try-again" onClick={getData}>
            Försök igen
          </button>
        </>
      )}
    </div>
  )
}

export default Home
