import { ActiveEntryUpdateInput, ActiveEntry } from '@prisma/client'
import { API, Types } from '../runtypes'
import { Model } from './Model'
import { SectorModel } from './SectorModel'
import { ProjectModel } from './ProjectModel'
import { DateTime } from 'luxon'
import { pipe } from 'fp-ts/lib/pipeable'
import { mapDatesToISOStrings } from '../runtypes/shared'
import { EntryModel } from './EntryModel'
import * as T from 'io-ts'

const include = { project: true, sector: true } as const

type StartData = T.TypeOf<typeof Types.ActiveEntry.Request.Start.Body>
type StopData = T.TypeOf<typeof Types.ActiveEntry.Request.Stop.Body>
type UpdateData = T.TypeOf<typeof Types.ActiveEntry.Request.Update.Body>

export class ActiveEntryModel extends Model {
  async start (data: StartData, user: Types.API.UserData) {
    const author = user.id
    const sector = await SectorModel.create(this.db).generateCreateOrConnectQuery(data.sector, user)
    const project = await ProjectModel.create(this.db).generateCreateOrConnectQuery(data.project, user)
    // prisma's "now()" default is broken so we're using this for now
    const start = (data.start || DateTime.local()).toJSDate()
    const activeEntry = await this.db.activeEntries.create({
      data: { ...data, author, sector, project, start },
      include
    })
    return ActiveEntryModel.serialize(activeEntry)
  }

  async stop (data: StopData, user: API.UserData) {
    const author = user.id
    const where = { author }
    const activeEntry = await this.db.activeEntries.findOne({ where, include })
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

    return EntryModel.serialize(entry)
  }


  async update (data: UpdateData, user: API.UserData)  {
    const { sector, project, start, ...otherData } = data
    const author = user.id

    const queryData: ActiveEntryUpdateInput = {
      ...otherData
    }

    if (sector) { queryData.sector = await SectorModel.create(this.db).generateCreateOrConnectQuery(sector, user) }
    if (project) { queryData.project = await ProjectModel.create(this.db).generateCreateOrConnectQuery(project, user) }
    if (start) { queryData.start = start.toJSDate() }

    const activeEntry = await this.db.activeEntries.update({
      where: { author },
      data: queryData,
      include
    })
    return ActiveEntryModel.serialize(activeEntry)
  }

  async find(user: API.UserData) {
    const author = user.id
    const where = { author }
    const activeEntry = await this.db.activeEntries.findOne({ where, include })
    return activeEntry && ActiveEntryModel.serialize(activeEntry)
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

  static serialize<T extends ActiveEntry>(activeEntry: T) {
    return pipe(activeEntry, SectorModel.mapToName, ProjectModel.mapToName, mapDatesToISOStrings)
  }
}