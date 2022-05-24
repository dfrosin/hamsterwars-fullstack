import './galleryCard.css'
import { useRecoilState } from 'recoil'
import { useState, useEffect } from 'react'
import { Hamster } from '../../models/Hamster'
import { fixUrl, correctImgName } from '../../utils'
import MatchWinners from '../matchWinners/MatchWinners'
import HamstersAtom from '../../atoms/HamstersAtom'
import { AddHamster } from '../../models/AddHamster'
import MatchesAtom from '../../atoms/MatchesAtom'

interface Props {
  hamster: Hamster
  gallery: boolean
}

function GalleryCard({ hamster, gallery }: Props) {
  const [moreInfo, setMoreInfo] = useState(false)
  const [beatenInfo, setBeatenInfo] = useState(false)
  const [hamsters, setHamsters] = useRecoilState(HamstersAtom)
  const [matches, setMatches] = useRecoilState(MatchesAtom)
  const [imgUrl, setImgUrl] = useState('')

  function updateRecoilHamster(toBeUpdated: Hamster[]) {
    if (hamsters) {
      let updatedHamsters: Hamster[] = [...hamsters]
        .map(
          (hamster) =>
            toBeUpdated.find(
              (updatedHamster) => updatedHamster.id === hamster.id
            ) || hamster
        )
        .filter((h) => {
          return h.id !== hamster.id
        })
      console.log('update hamster recoil')
      setHamsters(updatedHamsters)
    }
  }

  async function deleteHamster() {
    let updatedRecoilHamsters: Hamster[] = []
    if (matches && hamster && hamsters) {
      const matchesToBeDeleted = [...matches].filter((m) => {
        return m.loserId === hamster.id || m.winnerId === hamster.id
      })
      console.log('Matches To Be Deleted: ', matchesToBeDeleted)
      const updatedMatches = [...matches].filter((m) => {
        return m.loserId !== hamster.id && m.winnerId !== hamster.id
      })
      for (let match of matchesToBeDeleted) {
        let updatedHamster: AddHamster
        let updateId: string
        if (match.winnerId !== hamster.id) {
          const toBeUpdated = hamsters.find((h) => {
            return h.id === match.winnerId
          })
          updateId = match.winnerId
          console.log('To Be Updated: ', toBeUpdated)
          if (toBeUpdated) {
            updatedHamster = {
              name: toBeUpdated.name,
              age: toBeUpdated.age,
              games: toBeUpdated.games - 1,
              wins: toBeUpdated.wins - 1,
              defeats: toBeUpdated.defeats,
              loves: toBeUpdated.loves,
              favFood: toBeUpdated.favFood,
              imgName: toBeUpdated.imgName
            }
          }
        } else {
          const toBeUpdated = hamsters.find((h) => {
            return h.id === match.loserId
          })
          updateId = match.loserId
          if (toBeUpdated) {
            updatedHamster = {
              name: toBeUpdated.name,
              age: toBeUpdated.age,
              games: toBeUpdated.games - 1,
              wins: toBeUpdated.wins,
              defeats: toBeUpdated.defeats - 1,
              loves: toBeUpdated.loves,
              favFood: toBeUpdated.favFood,
              imgName: toBeUpdated.imgName
            }
          }
        }
        async function updateHamsterDeleteMatch() {
          if (updatedHamster !== null) {
            updatedRecoilHamsters.push({
              name: updatedHamster.name,
              age: updatedHamster.age,
              games: updatedHamster.games,
              wins: updatedHamster.wins,
              defeats: updatedHamster.defeats,
              loves: updatedHamster.loves,
              favFood: updatedHamster.favFood,
              imgName: updatedHamster.imgName,
              id: updateId
            } as Hamster)
            console.log(updatedRecoilHamsters)
            try {
              const response: Response = await fetch(
                fixUrl(`/hamsters/${updateId}`),
                {
                  method: 'PUT',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(updatedHamster)
                }
              )
              const data: any = await response.json()
              console.log(data)
            } catch (e) {
              console.log(e)
            }
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
            console.log('delete match data', data)
          } catch (e) {
            console.log(e)
          }
          if (updatedRecoilHamsters.length === matchesToBeDeleted.length) {
            updateRecoilHamster(updatedRecoilHamsters)
          }
        }
        updateHamsterDeleteMatch()
        console.log(matchesToBeDeleted.length)
      }
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
        fixUrl(`/hamsters/${hamster.id}`),
        settings
      )
      const data: any = await response.json()
      console.log(data)
    } catch (e) {
      console.log(e)
    }
    if (updatedRecoilHamsters.length === 0) {
      updateRecoilHamster(updatedRecoilHamsters)
    }
  }
  useEffect(() => {
    setImgUrl(correctImgName(hamster.imgName))
  }, [])

  return (
    <li
      onMouseEnter={() => {
        setMoreInfo(true)
      }}
      onMouseLeave={() => {
        setMoreInfo(false)
        setBeatenInfo(false)
      }}
      className="gallery-card"
      key={hamster.id}
    >
      <h3>{hamster.name}</h3>
      <img
        className="hamster-image"
        src={imgUrl}
        alt={`picture of ${hamster.name}`}
      />
      {moreInfo ? (
        <div className={`more-information`}>
          {hamster.wins && gallery ? (
            <div
              className="beaten-info"
              onClick={() => setBeatenInfo(!beatenInfo)}
            >
              i
            </div>
          ) : null}
          {beatenInfo ? (
            <div className="beaten-container">
              <MatchWinners winnerId={hamster.id} />
            </div>
          ) : null}
          <h3>{hamster.name}</h3>
          <img
            className="hamster-image"
            src={imgUrl}
            alt={`picture of ${hamster.name}`}
          />
          <p> Ålder: {hamster.age}</p>
          <p>
            Här har vi en hamster som gillar att {hamster.loves} och äter helst
            {` ${hamster.favFood}`}.<br /> {hamster.name}{' '}
            {hamster.games
              ? `har spelat
              ${hamster.games === 1 ? 'en match' : `${hamster.games} matcher`}${
                  hamster.wins
                    ? `, vunnit ${
                        hamster.wins === 1
                          ? 'en gång '
                          : `${hamster.wins} gånger `
                      }`
                    : ' men har inte vunnit någon gång'
                }
              ${
                hamster.defeats
                  ? `och förlorat ${
                      hamster.defeats === 1
                        ? 'en gång'
                        : `${hamster.defeats} gånger`
                    }`
                  : 'och aldrig förlorat'
              }.`
              : 'har inte spelat några matcher.'}
          </p>
          {gallery ? <button onClick={deleteHamster}>Ta bort</button> : null}
        </div>
      ) : null}
    </li>
  )
}

export default GalleryCard
