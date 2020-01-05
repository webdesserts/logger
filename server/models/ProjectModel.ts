import { UserData } from '../validation'
import { Model } from './Model'

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
}