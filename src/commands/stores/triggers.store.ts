import { Store } from '../../utils/store';
import { PaletteContextStore, SubjectPayload } from './context.store';

/*=======*\
*  Types  *
\*=======*/

export type TriggersState = TriggerState[]
export type TriggerState = AutoTriggerState | NodeTriggerState
export type AutoTriggerState = { subject: SubjectPayload, auto: true, $node: null }
export type NodeTriggerState = { subject: SubjectPayload, auto: false, $node: HTMLElement }

/*=========*\
*  Helpers  *
\*=========*/

function isEqual(search: TriggerState, trigger: TriggerState) {
  return (
    trigger.$node === search.$node &&
    trigger.auto === search.auto,
    PaletteContextStore.isEqual(search.subject, trigger.subject)
  )
}

/*=======*\
*  Store  *
\*=======*/

export class TriggersStore extends Store<TriggersState> {
  static initialState: TriggersState = []
  static isEqual = isEqual

  // init() {
  //   console.log('Triggers:', this.state.map(trigger => PaletteContextStore.display(trigger.subject)))
  // }

  add(trigger: TriggerState) {
    this.produceState((draft) => {
      if (!draft.some((t) => isEqual(t, trigger))) {
        draft.push(trigger)
      }
    })
  }
  remove(trigger: TriggerState) {
    this.produceState((draft) => {
      let index = draft.findIndex((t) => isEqual(t, trigger))
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
    return this.state.find((trigger) => TriggersStore.matchesSubject(trigger, subject))
  }
}

export const [ TriggersProvider, useTriggers ] = TriggersStore.createContext(TriggersStore.initialState)