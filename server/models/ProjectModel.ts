import { API } from '../runtypes'
import { Model } from './Model'
import { Project, ProjectCreateOneWithoutActiveEntriesInput, ProjectCreateOneWithoutEntriesInput  } from '@prisma/client'

type ProjectCreateOne = ProjectCreateOneWithoutActiveEntriesInput | ProjectCreateOneWithoutEntriesInput

export class ProjectModel extends Model {
  async create(name: string, user: API.UserData) {
    const data = { name, author: user.id }
    return await this.db.projects.create({ data })
  }

  async find(name: string, user: API.UserData) {
    const author_name = { name, author: user.id }
    const where = { author_name }
    return await this.db.projects.findOne({ where })
  }

  async findAll(user: API.UserData) {
    const where = { author: user.id }
    const projects = await this.db.projects.findMany({ where })
    return projects.map((p) => p.name)
  }

  async delete(name: string, user: API.UserData) {
    const author_name = { name, author: user.id }
    const where = { author_name }
    return await this.db.projects.delete({ where })
  }

  async generateCreateOrConnectQuery(name: string, user: API.UserData) : Promise<ProjectCreateOne> {
    const project = await this.find(name, user)
    if (project) {
      return ProjectModel.generateConnectQuery(project)
    } else {
      const author = user.id
      const create = { name, author }
      return { create }
    }
  }

  static generateConnectQuery(project: Project) : ProjectCreateOne {
    const { author, name } = project
    const author_name = { author, name }
    return { connect: { author_name } }
  }

  static mapToName<O extends { project?: Project, [key: string] : any }>(obj: O) {
    const { project, ...others } = obj
    return {
      ...others,
      ...(project && { project: project.name }),
    }
  }
}