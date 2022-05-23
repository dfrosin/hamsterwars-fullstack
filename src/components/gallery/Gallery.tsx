import { Routes, Route, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import './gallery.css'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { initializeApp } from 'firebase/app'
import { Hamster } from '../../models/Hamster'
import { Match } from '../../models/Match'
import { AddHamster } from '../../models/AddHamster'
import { fixUrl } from '../../utils'
import Loading from '../loading/Loading'
import Rivalry from '../rivalry/Rivalry'
import Slackers from '../slackers/Slackers'
import firebaseConfig from './firebaseConfig.json'
import GalleryCard from '../galleryCard/GalleryCard'
import exampleHamster from '../../hamster-logo.png'
import HamstersAtom from '../../atoms/HamstersAtom'
import MatchesAtom from '../../atoms/MatchesAtom'

function Gallery() {
  const [hamsters, setHamsters] = useRecoilState<Hamster[] | null>(HamstersAtom)
  const [matches, setMatches] = useRecoilState<Match[] | null>(MatchesAtom)
  const [addNew, setAddNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState(0)
  const [newLoves, setNewLoves] = useState('')
  const [newFood, setNewFood] = useState('')
  const [newImage, setNewImage] = useState<Blob | null>(null)
  const [imgUrl, setImgUrl] = useState('')

  async function getHamsters(): Promise<void> {
    console.log('Getting Data')
    const response: Response = await fetch(fixUrl('/hamsters'))
    const apiData: Hamster[] = await response.json()
    setHamsters(apiData)
  }

  async function getMatches() {
    const matchResponse: Response = await fetch(fixUrl('/matches'))
    const matchData: Match[] = await matchResponse.json()
    setMatches(matchData)
  }

  useEffect(() => {
    if (!hamsters) {
      getHamsters()
    }
    if (!matches) {
      getMatches()
    }
  }, [])

  const nameIsValid = newName !== ''
  const ageIsValid = newAge >= 0
  const lovesIsValid = newLoves !== ''
  const foodIsValid = newFood !== ''
  const imgIsValid = newImage !== null

  const formIsValid =
    nameIsValid && ageIsValid && lovesIsValid && foodIsValid && imgIsValid

  function hamsterImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      console.log(e.target.files[0])
      setNewImage(e.target.files[0])
      setImgUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  const app = initializeApp(firebaseConfig)

  const storage = getStorage(app)

  function uploadHamster() {
    let imageName: string
    if (newImage) {
      const image = newImage
      const storageRef = ref(storage, newName)
      uploadBytes(storageRef, image).then(() => {
        getDownloadURL(ref(storage, newName)).then((url) => {
          imageName = url
          postData()
          setNewImage(null)
          setAddNew(false)
          setImgUrl('')
        })
      })

      async function postData(): Promise<any> {
        let newHamster: AddHamster = {
          name: newName,
          age: newAge,
          imgName: imageName,
          favFood: newFood,
          loves: newLoves,
          wins: 0,
          defeats: 0,
          games: 0
        }
        const settings = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newHamster)
        }
        try {
          const response: Response = await fetch(
            'http://localhost:8090/hamsters',
            settings
          )
          const data: any = await response.json()
          getMatches()
          return console.log(data)
        } catch (e: any) {
          console.log(e.message)
          return e
        }
      }
    }
  }

  return (
    <>
      <div className="sub-nav">
        <NavLink to="/gallery" hover-attr="Galleri">
          Galleri
        </NavLink>
        <NavLink to="/gallery/rivalry" hover-attr="Rivalitet">
          Rivalitet
        </NavLink>
        <NavLink to="/gallery/slackers" hover-attr="Pigga & Lata">
          Pigga & Lata
        </NavLink>
      </div>
      <Routes>
        <Route path="/rivalry" element={<Rivalry />}></Route>
        <Route path="/slackers" element={<Slackers />}></Route>
        <Route
          path="/"
          element={
            <div className="Gallery">
              <h2>Alla våra hamstrar</h2>
              <ul className="hamster-list">
                {hamsters ? (
                  hamsters.map((hamster) => (
                    <GalleryCard
                      gallery={true}
                      hamster={hamster}
                      key={hamster.id}
                    />
                  ))
                ) : (
                  <Loading />
                )}
              </ul>
              {addNew ? null : (
                <div className="add-hamster-container">
                  <button
                    className="add-hamster-button"
                    onClick={() => setAddNew((addNew) => !addNew)}
                  >
                    +
                  </button>
                </div>
              )}
              {addNew ? (
                <div className="add-new-hamster">
                  <h2>Lägg till en ny hamster</h2>
                  {imgUrl ? (
                    <img
                      className="hamster-image"
                      src={imgUrl}
                      alt="submitted image"
                    />
                  ) : (
                    <img className="hamster-image" src={exampleHamster} />
                  )}
                  <div className="input-container">
                    <input
                      onChange={(event) => setNewName(event.target.value)}
                      type="text"
                      placeholder="Namn"
                    />
                    {!nameIsValid ? (
                      <div
                        warning-message="Hamstern måste ha ett namn. Helst något fint."
                        className="warning"
                      >
                        !
                      </div>
                    ) : null}
                  </div>
                  <div className="input-container">
                    <input
                      onChange={(event) =>
                        setNewAge(Number(event.target.value))
                      }
                      type="number"
                      placeholder="Ålder"
                    />
                    {!ageIsValid ? (
                      <div
                        warning-message="En hamster kan inte ha en negativ ålder. Hur hade det sett ut?"
                        className="warning"
                      >
                        !
                      </div>
                    ) : null}
                  </div>
                  <div className="input-container">
                    <input
                      onChange={(event) => setNewFood(event.target.value)}
                      type="text"
                      placeholder="Favoritmat"
                    />
                    {!foodIsValid ? (
                      <div
                        warning-message="Alla hamstrar har en favoriträtt. Fyll i med nånting smaskigt!"
                        className="warning"
                      >
                        !
                      </div>
                    ) : null}
                  </div>
                  <div className="input-container">
                    <input
                      onChange={(event) => setNewLoves(event.target.value)}
                      type="text"
                      placeholder="Tycker om att ..."
                    />
                    {!nameIsValid ? (
                      <div
                        warning-message="Nåt tycker väl hamstern om att göra? Fyll i en aktivitet."
                        className="warning"
                      >
                        !
                      </div>
                    ) : null}
                  </div>
                  <div className="input-container">
                    <label className="file-upload">
                      Ladda upp en bild
                      <input
                        className="upload-input"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(event) => hamsterImage(event)}
                      />
                    </label>
                    {!nameIsValid ? (
                      <div
                        warning-message="Vi vill se hur hamstern ser ut! Ladda upp en bild!"
                        className="warning"
                      >
                        !
                      </div>
                    ) : null}
                  </div>
                  <div className="button-container">
                    <button disabled={!formIsValid} onClick={uploadHamster}>
                      Lägg till
                    </button>
                    <button
                      onClick={() => {
                        setAddNew(false)
                        setNewImage(null)
                        setImgUrl('')
                      }}
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          }
        />
      </Routes>
    </>
  )
}

export default Gallery
