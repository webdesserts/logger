import { Model } from '../../utils/model';
import { matches as matchesSubject, Subject } from './context.model';

/*=======*\
*  Types  *
\*=======*/

export type ContextTriggersState = Trigger[]
export type Trigger = { $node: HTMLElement, subject: Subject }

/*=======*\
*  Model  *
\*=======*/

function matches(search: Trigger) {
  return (trigger: Trigger) => (
    trigger.$node === search.$node &&
    matchesSubject(search.subject)(trigger.subject)
  )
}

export class ContextTriggersModel extends Model<ContextTriggersState> {
  init() {
    console.log('triggers:', this.state.map((trigger) => trigger.subject.name))
  }

  add(trigger: Trigger) {
    this.produceState((draft) => {
      if (!draft.some(matches(trigger))) {
        console.log('adding trigger', trigger)
        draft.push(trigger)
      }
    })
  }
  remove(trigger: Trigger) {
    this.produceState((draft) => {
      let index = draft.findIndex(matches(trigger))
      if (index > -1) draft.splice(index, 1)
    })
  }
}

const initialState: ContextTriggersState = []
export const [ ContextTriggersProvider, useContextTriggers ] = ContextTriggersModel.createContext(initialState)