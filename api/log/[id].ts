import {
  Router,
  validateRequest,
  Types,
  authenticate,
} from "../../server";
import { Photon } from '@prisma/photon';
import { EntryModel } from '../../server/models/EntryModel';
import { ServerError } from "../../server/errors"
import { UpdateEntryResponse, FindEntryResponse, DeleteEntryResponse } from "../../server/validation";

const db = new Photon()
const model = EntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.patch<UpdateEntryResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query, body } = validateRequest(req, Types.UpdateEntryRequest)
  const entry = await model.update(query.id, body, user)
  return res.status(200).json({ entry })
})

router.get<FindEntryResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validateRequest(req, Types.FindEntryRequest)
  const entry = await model.findById(query.id, user)
  return res.status(200).json({ entry })
})

router.delete<DeleteEntryResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validateRequest(req, Types.FindEntryRequest)
  const wasDeleted = await model.delete(query.id, user)
  if (wasDeleted) {
    return res.status(204).json({})
  } else {
    throw ServerError.NotFound.create(req)
  }
})

export default router.handler