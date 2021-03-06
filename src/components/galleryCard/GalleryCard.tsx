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
  const [beatenInfo, setBeatenInfo] = useState(false)
  const [close, setClose] = useState('')
  const [focus, setFocus] = useState('')
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
    <li className="gallery-card-list" key={hamster.id}>
      <div
        className={`gallery-card${focus}`}
        onMouseEnter={() => setFocus(' focus')}
        onMouseLeave={() => {
          setBeatenInfo(false)
          setTimeout(() => {
            setFocus('')
          }, 500)
        }}
      >
        <h3>{hamster.name}</h3>
        <img
          className="hamster-image"
          src={imgUrl}
          alt={`picture of ${hamster.name}`}
        />
        {hamster.wins && gallery ? (
          <div
            className="beaten-info"
            onClick={() => {
              if (!beatenInfo) {
                setBeatenInfo(true)
              } else {
                setClose(' close')
                setTimeout(() => {
                  setBeatenInfo(false)
                  setClose('')
                }, 400)
              }
            }}
          >
            i
          </div>
        ) : null}
        <div className="hover-information">
          {beatenInfo ? (
            <div className={`beaten-container${close}`}>
              <MatchWinners winnerId={hamster.id} />
            </div>
          ) : null}
          <p> ??lder: {hamster.age}</p>
          <p>
            H??r har vi en hamster som gillar att {hamster.loves} och ??ter helst
            {` ${hamster.favFood}`}.<br /> {hamster.name}{' '}
            {hamster.games
              ? `har spelat
              ${hamster.games === 1 ? 'en match' : `${hamster.games} matcher`}${
                  hamster.wins
                    ? `, vunnit ${
                        hamster.wins === 1
                          ? 'en g??ng '
                          : `${hamster.wins} g??nger `
                      }`
                    : ' men har inte vunnit n??gon g??ng'
                }
              ${
                hamster.defeats
                  ? `och f??rlorat ${
                      hamster.defeats === 1
                        ? 'en g??ng'
                        : `${hamster.defeats} g??nger`
                    }`
                  : 'och aldrig f??rlorat'
              }.`
              : 'har inte spelat n??gra matcher.'}
          </p>
          {gallery ? <button onClick={deleteHamster}>Ta bort</button> : null}
        </div>
      </div>
    </li>
  )
}

export default GalleryCard
