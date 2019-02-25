import { Model } from '../../utils/model';

/*=======*\
*  Types  *
\*=======*/

export type PaletteContextState = SubjectPayload[]
export type SubjectPayload = { type: string, id?: string  }

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
  init() {
    console.log('context:', this.state.map((subject) => `${subject.type}+${subject.id || ''}`))
  }

  add(subject: SubjectPayload) {
    this.produceState((draft) => {
      let match = draft.findIndex(matches(subject)) > -1
      if (!match) draft.push(subject)
    })
  }
  remove(subject: SubjectPayload) {
    this.produceState((draft) => {
      let index = draft.findIndex(matches(subject))
      if (index > -1) draft.splice(index, 1)
    })
  }
}

const initialState: PaletteContextState = []
export const [ PaletteContextProvider, usePaletteContext ] = PaletteContextModel.createContext(initialState)