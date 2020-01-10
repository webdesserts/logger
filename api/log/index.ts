import {
  Router,
  validate,
  Types,
  authenticate,
} from "../../server";
import { Photon } from '@prisma/photon';
import { EntryModel } from "../../server/models/EntryModel";
import { FindAllEntriesResponse, CreateEntryResponse } from "../../server/validation";

const db = new Photon()
const model = EntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.get<FindAllEntriesResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const entries = await model.findAll(user)
  return res.status(200).json({ entries })
})

router.post<CreateEntryResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validate(req, Types.CreateEntryRequest)
  const entry = await model.create(body, user)
  return res.status(200).json({ entry })
})

export default router.handler

