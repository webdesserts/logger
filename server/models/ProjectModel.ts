import { UserData } from '../validation'
import { Model } from './Model'
import { ProjectCreateOneWithoutProjectInput, Project } from '@prisma/photon'

export class ProjectModel extends Model {
  async create(name: string, user: UserData) {
    const data = { name, author: user.id }
    return await this.db.projects.create({ data })
  }

  async find(name: string, user: UserData) {
    const author_name = { name, author: user.id }
    const where = { author_name }
    return await this.db.projects.findOne({ where })
  }

  async findAll(user: UserData) {
    const where = { author: user.id }
    return await this.db.projects.findMany({ where })
  }

  async delete(name: string, user: UserData) {
    const author_name = { name, author: user.id }
    const where = { author_name }
    return await this.db.projects.delete({ where })
  }

  async generateCreateOrConnectQuery(name: string, user: UserData) : Promise<ProjectCreateOneWithoutProjectInput> {
    const sector = await this.find(name, user)
    if (sector) {
      return { connect: { author_name: sector } }
    } else {
      const author = user.id
      const create = { name, author }
      return { create }
    }
  }

  static generateConnectQuery(project: Project) : ProjectCreateOneWithoutProjectInput {
    const { author, name, id } = project
    const author_name = { author, name }
    return { connect: { id, author_name } }
  }
}