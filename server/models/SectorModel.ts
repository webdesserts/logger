import { UserData } from '../validation'
import { Model } from './Model'
import { Sector, SectorCreateOneWithoutSectorInput } from '@prisma/photon'

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

  async generateCreateOrConnectQuery(name: string, user: UserData) : Promise<SectorCreateOneWithoutSectorInput> {
    const sector = await this.find(name, user)
    if (sector) {
      return { connect: { author_name: sector } }
    } else {
      const author = user.id
      const create = { name, author }
      return { create }
    }
  }
  static generateConnectQuery(sector: Sector) : SectorCreateOneWithoutSectorInput {
    const { author, name, id } = sector
    const author_name = { author, name }
    return { connect: { id, author_name } }
  }
}