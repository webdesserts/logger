import * as T from 'io-ts'
import { Request } from './requests'

export const ProjectData = T.type({
  name: T.string
})

export const CreateProjectData = ProjectData
export type CreateProjectData = T.TypeOf<typeof CreateProjectData>

export const FindProjectData = ProjectData
export type FindProjectData = T.TypeOf<typeof FindProjectData>

export const FindAllProjectsData = T.partial({})
export type FindAllProjectsData = T.TypeOf<typeof FindAllProjectsData>

export const CreateProjectRequest = Request(T.type({}), CreateProjectData)
export type CreateProjectRequest = T.TypeOf<typeof CreateProjectRequest>

export const FindProjectRequest = Request(FindProjectData, T.type({}))
export type FindProjectRequest = T.TypeOf<typeof FindProjectRequest>

export const FindAllProjectsRequest = Request(FindAllProjectsData, T.type({}))
export type FindAllProjectsRequest = T.TypeOf<typeof FindAllProjectsRequest>