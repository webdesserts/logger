import nanoid from 'nanoid'
import { Model } from '../../utils/model'

/*=======*\
*  Types  *
\*=======*/

export type SectorsState = Sector[]
export type Sector = { id: string, name: string }

/*=======*\
*  Model  *
\*=======*/

export class SectorsModel extends Model<SectorsState> {
  static initialState: SectorsState = []

  create(name: string) {
    let exists = this.state.some((sector) => sector.name === name)
    if (!exists) {
      this.produceState((draft) => {
        draft.push({ id: nanoid(8), name });
      })
    }
  }

  update(id: string, name: string) {
    this.produceState((draft) => {
      let project = draft.find((sector) => sector.id === id)
      if (project) project.name = name
    })
  }

  delete(id: string) {
    this.produceState((draft) => {
      let i = draft.findIndex((sector) => sector.id === id)
      draft.splice(i, 1)
    })
  }
}

export let [ SectorsProvider, useSectors ] = SectorsModel.createContext(SectorsModel.initialState)