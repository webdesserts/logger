import { EntryInclude, EntryUpdateArgs } from '@prisma/photon'
import { filterUnauthored } from '../authenticate'
import { Model } from './Model'
import { SectorModel } from './SectorModel'
import { ProjectModel } from './ProjectModel'
import { Types, API } from '../runtypes'

const include: EntryInclude = { project: true, sector: true }

export class EntryModel extends Model {
  async create (data: Types.CreateEntryData, user: API.UserData) {
    const author = user.id
    const sector = await SectorModel.create(this.db).generateCreateOrConnectQuery(data.sector, user)
    const project = await ProjectModel.create(this.db).generateCreateOrConnectQuery(data.project, user)
    const start = data.start.toJSDate()
    const end = data.end.toJSDate() 
    return await this.db.entries.create({
      data: { ...data, author, sector, project, start, end }
    })
  }

  async update (id: string, data: Types.UpdateEntryData, user: API.UserData)  {
    const { sector, project, start, end, ...otherData } = data
    const author = user.id
    const query: EntryUpdateArgs = {
      where: { id },
      data: {
        ...otherData,
        author,
      },
      include
    }
    if (sector) { query.data.sector = await SectorModel.create(this.db).generateCreateOrConnectQuery(sector, user) }
    if (project) { query.data.project = await ProjectModel.create(this.db).generateCreateOrConnectQuery(project, user) }
    if (start) { query.data.start = start.toJSDate() }
    if (end) { query.data.end = end.toJSDate() }
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