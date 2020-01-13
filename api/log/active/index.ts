import {
  Router,
  validateRequest,
  Types,
  authenticate,
} from "../../../server";
import { Photon } from '@prisma/photon';
import { ActiveEntryModel } from "../../../server/models/ActiveEntryModel";
import { UpdateActiveEntryResponse, DeleteActiveEntryResponse, FindActiveEntryResponse } from "../../../server/validation";
import { ServerError } from '../../../server/errors'

const db = new Photon()
const model = ActiveEntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.get<FindActiveEntryResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const activeEntry = await model.find(user)
  return res.status(200).json({ activeEntry })
})

router.patch<UpdateActiveEntryResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validateRequest(req, Types.UpdateActiveEntryRequest)
  const activeEntry = await model.update(body, user)
  return res.status(200).json({ activeEntry })
})

router.delete<DeleteActiveEntryResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const wasDeleted = await model.delete(user)
  if (wasDeleted) return res.status(204).json({})
  else throw ServerError.NotFound.create(req)
})

export default router.handler

