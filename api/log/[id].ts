import { validateRequest } from "../../server/validate";
import { authenticate } from "../../server/authenticate";
import { Router } from "../../server/router";
import { Photon } from '@prisma/photon';
import { EntryModel } from '../../server/models/EntryModel';
import { ServerError } from "../../server/errors"
import { Types } from "../../server/runtypes";

const db = new Photon()
const model = EntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.patch<Types.Entry.Response.UpdateJSON>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query, body } = validateRequest(req, Types.Entry.Request.Update)
  const entry = await model.update(query.id, body, user)
  return res.status(200).json({ entry })
})

router.get<Types.Entry.Response.FindJSON>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validateRequest(req, Types.Entry.Request.Find)
  const entry = await model.findById(query.id, user)
  return res.status(200).json({ entry })
})

router.delete<Types.Entry.Response.DeleteJSON>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validateRequest(req, Types.Entry.Request.Delete)
  const wasDeleted = await model.delete(query.id, user)
  if (wasDeleted) {
    return res.status(204).json({})
  } else {
    throw ServerError.NotFound.create(req)
  }
})

export default router.handler