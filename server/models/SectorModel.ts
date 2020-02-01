import { API } from '../runtypes'
import { Model } from './Model'
import { Sector, SectorCreateOneWithoutActiveEntriesInput, SectorCreateOneWithoutEntriesInput } from '@prisma/client'

type SectorCreateOne = SectorCreateOneWithoutActiveEntriesInput | SectorCreateOneWithoutEntriesInput

export class SectorModel extends Model {
  async create(name: string, user: API.UserData) {
    const data = { name, author: user.id }
    return await this.db.sectors.create({ data })
  }

  async find(name: string, user: API.UserData) {
    const author_name = { name, author: user.id }
    const where = { author_name }
    return await this.db.sectors.findOne({ where })
  }

  async findAll(user: API.UserData) {
    const where = { author: user.id }
    const sectors = await this.db.sectors.findMany({ where })
    return sectors.map((s) => s.name)
  }

  async delete(name: string, user: API.UserData) {
    const author_name = { name, author: user.id }
    const where = { author_name }
    return await this.db.sectors.delete({ where })
  }

  async generateCreateOrConnectQuery(name: string, user: API.UserData) : Promise<SectorCreateOne> {
    const sector = await this.find(name, user)
    if (sector) {
      return SectorModel.generateConnectQuery(sector)
    } else {
      const author = user.id
      const create = { name, author }
      return { create }
    }
  }

  static generateConnectQuery(sector: Sector) : SectorCreateOne {
    const { author, name } = sector
    const author_name = { author, name }
    return { connect: { author_name } }
  }

  static mapToName<O extends { sector?: Sector, [key: string] : any }>(obj: O) {
    const { sector, ...others } = obj
    return {
      ...others,
      ...(sector && { sector: sector.name }),
    }
  }
}