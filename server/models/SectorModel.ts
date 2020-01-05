import { UserData } from '../validation'
import { Model } from './Model'

export class SectorModel extends Model {
  async create(name: string, user: UserData) {
    const data = { name, author: user.id }
    return await this.db.sectors.create({ data })
  }

  async find(name: string, user: UserData) {
    const author_name = { name, author: user.id }
    const where = { author_name }
    return await this.db.sectors.findOne({ where })
  }

  async findAll(user: UserData) {
    const where = { author: user.id }
    return await this.db.sectors.findMany({ where })
  }

  async delete(name: string, user: UserData) {
    const author_name = { name, author: user.id }
    const where = { author_name }
    return await this.db.sectors.delete({ where })
  }
}