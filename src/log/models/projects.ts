import nanoid from 'nanoid'
import { Model } from '../../utils/model'

/*=======*\
*  Types  *
\*=======*/

export type ProjectsState = Project[]
export type Project = { id: string, name: string }

/*=======*\
*  Model  *
\*=======*/

export class ProjectsModel extends Model<ProjectsState> {
  create(name: string) {
    this.produceState((draft) => {
      let exists = Boolean(draft.find((project) => project.name === name))
      if (exists) return draft
      else draft.push({ id: nanoid(8), name });
    })
  }
  update(id: string, name: string) {
    this.produceState((draft) => {
      let project = draft.find((project) => project.id === id)
      if (project) project.name = name
    })
  }
  delete(id: string) {
    this.produceState((draft) => {
      let i = draft.findIndex((project) => project.id === id)
      draft.splice(i, 1)
    })
  }
}

let initialState: ProjectsState = []
export let [ ProjectsProvider, useProjects ] = ProjectsModel.createContext(initialState)