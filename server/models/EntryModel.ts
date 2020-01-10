import { EntryInclude, EntryUpdateArgs } from '@prisma/photon'
import { filterUnauthored } from '../authenticate'
import { Model } from './Model'
import { Types } from '..'
import { SectorModel } from './SectorModel'
import { ProjectModel } from './ProjectModel'
import { API } from '../validation'

const include: EntryInclude = { project: true, sector: true }

export class EntryModel extends Model {
  async create (data: Types.CreateEntryData, user: API.UserData) {
    const author = user.id
    const sector = await SectorModel.create(this.db).generateCreateOrConnectQuery(data.sector, user)
    const project = await ProjectModel.create(this.db).generateCreateOrConnectQuery(data.project, user)
    return await this.db.entries.create({
      data: { ...data, author, sector, project }
    })
  }

  async update (id: string, data: Types.UpdateEntryData, user: API.UserData)  {
    const { sector, project,  ...otherData } = data
    const author = user.id
    const query: EntryUpdateArgs = {
      where: { id },
      data: { ...otherData, author },
      include
    }
    if (sector) { query.data.sector = await SectorModel.create(this.db).generateCreateOrConnectQuery(sector, user) }
    if (project) { query.data.project = await ProjectModel.create(this.db).generateCreateOrConnectQuery(project, user) }
    return await this.db.entries.update(query)
  }

  async findAll(user: API.UserData) {
    const where = { author: user.id }
    const orderBy = { end: 'desc' } as const
    return await this.db.entries({ where, orderBy, include })
  }

  async findById(id: string, user: API.UserData) {
    const where = { id }
    const entry = await this.db.entries.findOne({ where, include })
    return filterUnauthored(entry, user)
  }

  async delete(id: string, user: API.UserData) : Promise<boolean> {
    if (await this.findById(id, user)) {
      const where = { id }
      await this.db.entries.delete({ where })
      return true
    }
    return false
  }
}