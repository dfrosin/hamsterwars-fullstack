import { atom, RecoilState } from 'recoil'
import { Hamster } from '../models/Hamster'

const HamstersAtom = atom<Hamster[] | null>({
  key: 'hamsters',
  default: null
})

export default HamstersAtom
