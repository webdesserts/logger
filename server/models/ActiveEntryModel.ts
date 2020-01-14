import { ActiveEntryUpdateArgs, ActiveEntryInclude } from '@prisma/photon'
import { API, Types } from '../runtypes'
import { Model } from './Model'
import { SectorModel } from './SectorModel'
import { ProjectModel } from './ProjectModel'
import { DateTime } from 'luxon'

const include: ActiveEntryInclude = { project: true, sector: true }

export class ActiveEntryModel extends Model {
  async start (data: Types.StartActiveEntryData, user: Types.API.UserData) {
    const author = user.id
    const sector = await SectorModel.create(this.db).generateCreateOrConnectQuery(data.sector, user)
    const project = await ProjectModel.create(this.db).generateCreateOrConnectQuery(data.project, user)
    // prisma's "now()" default is broken so we're using this for now
    const start = (data.start || DateTime.local()).toJSDate()
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
    const end = (data.end || DateTime.local()).toJSDate()
    const entry = await this.db.entries.create({
      data: { ...activeEntry, sector, project, end },
      include
    })
    await this.delete(user)

    return entry
  }

  async update (data: Types.UpdateActiveEntryData, user: API.UserData)  {
    const { sector, project, start, ...otherData } = data
    const author = user.id

    const query: ActiveEntryUpdateArgs = {
      where: { author },
      data: {
        ...otherData,
      },
      include
    }
    if (sector) { query.data.sector = await SectorModel.create(this.db).generateCreateOrConnectQuery(sector, user) }
    if (project) { query.data.project = await ProjectModel.create(this.db).generateCreateOrConnectQuery(project, user) }
    if (start) { query.data.start = start.toJSDate() }

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