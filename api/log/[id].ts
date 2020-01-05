import { NotFoundError } from '../../server/errors'
import {
  Router,
  validate,
  Types,
  authenticate,
} from "../../server";
import { Photon } from '@prisma/photon';
import { EntryModel } from '../../server/models/EntryModel';

const db = new Photon()
const model = EntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.post(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validate(req, Types.CreateEntryRequest)
  const entry = await model.create(body, user)
  return res.status(200).json({ entry })
})

router.patch(async (req, res) => {
  const { user } = await authenticate(req)
  const { query, body } = validate(req, Types.UpdateEntryRequest)
  const entry = await model.update(query.id, body, user)
  return res.status(200).json({ entry })
})

router.get(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validate(req, Types.FindEntryRequest)
  const entry = await model.findById(query.id, user)
  return res.status(200).json({ entry })
})

router.delete(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validate(req, Types.FindEntryRequest)
  const wasDeleted = await model.delete(query.id, user)
  if (wasDeleted) {
    return res.status(204).send(null)
  } else {
    throw NotFoundError.create(req)
  }
})

export default router.handler