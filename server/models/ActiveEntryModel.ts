import { ActiveEntryUpdateArgs, ActiveEntryInclude } from '@prisma/photon'
import { API } from '../validation'
import { Model } from './Model'
import { Types } from '..'
import { SectorModel } from './SectorModel'
import { ProjectModel } from './ProjectModel'

const include: ActiveEntryInclude = { project: true, sector: true }

export class ActiveEntryModel extends Model {
  async start (data: Types.StartActiveEntryData, user: API.UserData) {
    const author = user.id
    const sector = await SectorModel.create(this.db).generateCreateOrConnectQuery(data.sector, user)
    const project = await ProjectModel.create(this.db).generateCreateOrConnectQuery(data.project, user)
    // prisma's "now()" default is broken so we're using this for now
    const start = data.start ? data.start : new Date(Date.now())
    return await this.db.activeEntries.create({
      data: { ...data, author, sector, project, start },
      include
    })
  }

  async stop (data: Types.StopActiveEntryData, user: API.UserData) {
    const activeEntry = await this.find(user)
    if (!activeEntry) return null

    // prisma's "now()" default is broken so we're using this for now
    const sector = SectorModel.generateConnectQuery(activeEntry.sector)
    const project = ProjectModel.generateConnectQuery(activeEntry.project)
    const end = data.end || new Date(Date.now())
    const entry = await this.db.entries.create({
      data: { ...activeEntry, sector, project, end },
      include
    })
    await this.delete(user)

    return entry
  }

  async update (data: Types.UpdateActiveEntryData, user: API.UserData)  {
    const { sector, project, ...otherData } = data
    const author = user.id
    const query: ActiveEntryUpdateArgs = {
      where: { author },
      data: { ...otherData },
      include
    }
    if (sector) { query.data.sector = await SectorModel.create(this.db).generateCreateOrConnectQuery(sector, user) }
    if (project) { query.data.project = await ProjectModel.create(this.db).generateCreateOrConnectQuery(project, user) }
    return await this.db.entries.update(query)
  }

  async find(user: API.UserData) {
    const author = user.id
    const where = { author }
    return await this.db.activeEntries.findOne({ where, include })
  }

  async delete(user: API.UserData) : Promise<boolean> {
    if (await this.find(user)) {
      const author = user.id
      const where = { author }
      await this.db.activeEntries.delete({ where })
      return true
    }
    return false
  }
}