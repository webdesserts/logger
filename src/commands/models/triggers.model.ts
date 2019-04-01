import { Model } from '../../utils/model';
import { matches as matchesSubject, SubjectPayload } from './context.model';

/*=======*\
*  Types  *
\*=======*/

export type TriggersState = TriggerState[]
export type TriggerState = AutoTriggerState | NodeTriggerState
export type AutoTriggerState = { subject: SubjectPayload, auto: true, $node: null }
export type NodeTriggerState = { subject: SubjectPayload, auto: false, $node: HTMLElement }

/*=======*\
*  Model  *
\*=======*/

function matches(search: TriggerState) {
  return (trigger: TriggerState) => (
    trigger.$node === search.$node &&
    trigger.auto === search.auto,
    matchesSubject(search.subject)(trigger.subject)
  )
}

export class TriggersModel extends Model<TriggersState> {
  static initialState: TriggersState = []

  // init() {
  //   console.log('triggers:', this.state.map((trigger) => trigger.subject.type))
  // }

  add(trigger: TriggerState) {
    this.produceState((draft) => {
      if (!draft.some(matches(trigger))) {
        draft.push(trigger)
      }
    })
  }
  remove(trigger: TriggerState) {
    this.produceState((draft) => {
      let index = draft.findIndex(matches(trigger))
      if (index > -1) draft.splice(index, 1)
    })
  }

  static matchesSubject(trigger: TriggerState, subject: SubjectPayload) {
    return (
      trigger.subject.type === subject.type &&
      trigger.subject.id === subject.id
    )
  }
  findBySubject(subject: SubjectPayload) {
    return this.state.find((trigger) => TriggersModel.matchesSubject(trigger, subject))
  }
}

export const [ TriggersProvider, useTriggers ] = TriggersModel.createContext(TriggersModel.initialState)