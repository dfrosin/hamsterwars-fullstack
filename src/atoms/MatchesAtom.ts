import { atom } from 'recoil'
import { Match } from '../models/Match'

const MatchesAtom = atom<Match[] | null>({
  key: 'matches',
  default: null
})

export default MatchesAtom
