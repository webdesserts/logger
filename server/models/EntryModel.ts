import { EntryInclude, SectorCreateOneWithoutSectorInput, ProjectCreateOneWithoutProjectInput, EntryUpdateArgs } from '@prisma/photon'
import { UserData } from '../validation'
import { filterUnauthored } from '../authenticate'
import { Model } from './Model'
import { Types } from '..'
import { SectorModel } from './SectorModel'
import { ProjectModel } from './ProjectModel'

const include: EntryInclude = { project: true, sector: true }

export class EntryModel extends Model {
  async create (data: Types.CreateEntryData, user: UserData) {
    const author = user.id
    const sector = await this.createOrConnectSector(data.sector, user)
    const project = await this.createOrConnectProject(data.project, user)
    return await this.db.entries.create({
      data: { ...data, author, sector, project }
    })
  }

  async update (id: string, data: Types.UpdateEntryData, user: UserData)  {
    const { sector, project,  ...otherData } = data
    const author = user.id
    const query: EntryUpdateArgs = {
      where: { id },
      data: { ...otherData, author },
      include
    }
    if (sector) { query.data.sector = await this.createOrConnectSector(sector, user) }
    if (project) { query.data.sector = await this.createOrConnectSector(project, user) }
    return await this.db.entries.update(query)
  }

  async findAll(user: UserData) {
    const where = { author: user.id }
    const orderBy = { end: 'desc' } as const
    return await this.db.entries({ where, orderBy, include })
  }

  async findById(id: string, user: UserData) {
    const where = { id }
    const entry = await this.db.entries.findOne({ where, include })
    return filterUnauthored(entry, user)
  }

  async delete(id: string, user: UserData) : Promise<boolean> {
    if (await this.findById(id, user)) {
      const where = { id }
      await this.db.entries.delete({ where })
      return true
    }
    return false
  }

  private async createOrConnectSector(name: string, user: UserData) : Promise<SectorCreateOneWithoutSectorInput> {
    const sector = await SectorModel.create(this.db).find(name, user)
    if (sector) {
      return { connect: { author_name: sector } }
    } else {
      const create = { name, author: user.id }
      return { create }
    }
  }

  private async createOrConnectProject(name: string, user: UserData) : Promise<ProjectCreateOneWithoutProjectInput> {
    const project = await ProjectModel.create(this.db).find(name, user)
    if (project) {
      return { connect: { author_name: project } }
    } else {
      const create = { name, author: user.id }
      return { create }
    }
  }
}