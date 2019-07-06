import { Model } from '../../utils/model';
import produce from 'immer';

/*=======*\
*  Types  *
\*=======*/

export type PaletteContextState = SubjectPayload[]
export type SubjectPayload = { type: string, id: string | null  }

/*=========*\
*  Helpers  *
\*=========*/

export function matches(search: SubjectPayload) {
  return (subject: SubjectPayload) => (
    subject.type === search.type &&
    subject.id === search.id
  )
}

/*=======*\
*  Model  *
\*=======*/

export class PaletteContextModel extends Model<PaletteContextState> {
  static initialState: PaletteContextState = []

  static displayName(subject: SubjectPayload) {
    return `${subject.type}+${subject.id || ''}`
  }

  init() {
    console.log('context:', this.state.map(PaletteContextModel.displayName))
  }

  add(subject: SubjectPayload) {
    let match = this.state.findIndex(matches(subject)) > -1
    if (!match) {
      console.log('add', PaletteContextModel.displayName(subject))
      this.produceState((draft) => {
        draft.push(subject)
      })
    }
  }

  remove(subject: SubjectPayload) {
    let index = this.state.findIndex(matches(subject))
    if (index > -1) {
      console.log('remove',PaletteContextModel.displayName(subject))
      this.produceState((draft) => {
        draft.splice(index, 1)
      })
    }
  }
}

export const [ PaletteContextProvider, usePaletteContext ] = PaletteContextModel.createContext(PaletteContextModel.initialState)