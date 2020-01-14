import { Types } from '../../server/runtypes'
import { validateRequest } from "../../server/validate";
import { authenticate } from "../../server/authenticate";
import { Router } from "../../server/router";
import { Photon } from '@prisma/photon';
import { EntryModel } from "../../server/models/EntryModel";

const db = new Photon()
const model = EntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.get<Types.FindAllEntriesResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const entries = await model.findAll(user)
  return res.status(200).json({ entries })
})

router.post<Types.CreateEntryResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validateRequest(req, Types.CreateEntryRequest)
  const entry = await model.create(body, user)
  return res.status(200).json({ entry })
})

export default router.handler

