import { Types } from '../../../server/runtypes'
import { validateRequest } from "../../../server/validate";
import { authenticate } from "../../../server/authenticate";
import { Router } from "../../../server/router";
import { Photon } from '@prisma/photon';
import { ActiveEntryModel } from "../../../server/models/ActiveEntryModel";
import { ServerError } from '../../../server/errors'

const db = new Photon()
const model = ActiveEntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.get<Types.ActiveEntry.Response.FindJSON>(async (req, res) => {
  const { user } = await authenticate(req)
  const activeEntry = await model.find(user)
  return res.status(200).json({ activeEntry })
})

router.patch<Types.ActiveEntry.Response.UpdateJSON>(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validateRequest(req, Types.ActiveEntry.Request.Update)
  const activeEntry = await model.update(body, user)
  return res.status(200).json({ activeEntry })
})

router.delete<Types.ActiveEntry.Response.DeleteJSON>(async (req, res) => {
  const { user } = await authenticate(req)
  const wasDeleted = await model.delete(user)
  if (wasDeleted) return res.status(204).json({})
  else throw ServerError.NotFound.create(req)
})

export default router.handler

