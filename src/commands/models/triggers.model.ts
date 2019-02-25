import { Model } from '../../utils/model';
import { matches as matchesSubject, SubjectPayload } from './context.model';

/*=======*\
*  Types  *
\*=======*/

export type TriggersState = Trigger[]
export type Trigger = { $node: HTMLElement, subject: SubjectPayload }

/*=======*\
*  Model  *
\*=======*/

function matches(search: Trigger) {
  return (trigger: Trigger) => (
    trigger.$node === search.$node &&
    matchesSubject(search.subject)(trigger.subject)
  )
}

export class TriggersModel extends Model<TriggersState> {
  // init() {
  //   console.log('triggers:', this.state.map((trigger) => trigger.subject.type))
  // }

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

  static matchesSubject(trigger: Trigger, subject: SubjectPayload) {
    return (
      trigger.subject.type === subject.type &&
      trigger.subject.id === subject.id
    )
  }
  findBySubject(subject: SubjectPayload) {
    return this.state.find((trigger) => TriggersModel.matchesSubject(trigger, subject))
  }
}

const initialState: TriggersState = []
export const [ TriggersProvider, useTriggers ] = TriggersModel.createContext(initialState)