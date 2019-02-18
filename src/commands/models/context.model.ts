import { Model } from '../../utils/model';

/*=======*\
*  Types  *
\*=======*/

export type CommandContextState = Subject[]
export type Subject = { name: string, id?: string }

/*=======*\
*  Model  *
\*=======*/

export function matches(search: Subject) {
  return (subject: Subject) => (
    subject.name === search.name &&
    subject.id === search.id
  )
}

export class CommandContextModel extends Model<CommandContextState> {
  init() {
    console.log('context:', this.state.map((subject) => subject.name))
  }

  add(subject: Subject) {
    this.produceState((draft) => {
      let match = draft.findIndex(matches(subject)) > -1
      if (!match) draft.push(subject)
    })
  }
  remove(subject: Subject) {
    this.produceState((draft) => {
      let index = draft.findIndex(matches(subject))
      if (index > -1) draft.splice(index, 1)
    })
  }
}

const initialState: CommandContextState = []
export const [ CommandContextProvider, useCommandContext ] = CommandContextModel.createContext(initialState)