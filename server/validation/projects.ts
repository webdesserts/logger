import * as T from 'io-ts'
import { API } from './api'
import { ProjectModel } from '../models/ProjectModel'

const ProjectData = T.intersection([
  T.string,
  T.type({
    id: T.string
  }),
  T.type({
    name: T.string
  })
])

export const CreateProjectData = ProjectData
export type CreateProjectData = T.TypeOf<typeof CreateProjectData>

export const FindProjectData = ProjectData
export type FindProjectData = T.TypeOf<typeof FindProjectData>

export const FindAllProjectsData = T.partial({})
export type FindAllProjectsData = T.TypeOf<typeof FindAllProjectsData>

export const CreateProjectRequest = API.RequestData(T.type({}), CreateProjectData)
export type CreateProjectRequest = T.TypeOf<typeof CreateProjectRequest>
export type CreateProjectResponse = API.ResponseBody<{
  project: AsyncReturnType<ProjectModel['create']>
}>

export const FindProjectRequest = API.RequestData(FindProjectData, T.type({}))
export type FindProjectRequest = T.TypeOf<typeof FindProjectRequest>
export type FindProjectResponse = API.ResponseBody<{
  project: AsyncReturnType<ProjectModel['find']>
}>

export const FindAllProjectsRequest = API.RequestData(FindAllProjectsData, T.type({}))
export type FindAllProjectsRequest = T.TypeOf<typeof FindAllProjectsRequest>
export type FindAllProjectsResponse = API.ResponseBody<{
  projects: AsyncReturnType<ProjectModel['findAll']>
}>

export type DeleteProjectResponse = API.ResponseBody<{}>