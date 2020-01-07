import {
  Router,
  validate,
  Types,
  authenticate,
} from "../../../server";
import { Photon } from '@prisma/photon';
import { ActiveEntryModel } from "../../../server/models/ActiveEntryModel";

const db = new Photon()
const model = ActiveEntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.get(async (req, res) => {
  const { user } = await authenticate(req)
  const entries = await model.find(user)
  return res.status(200).json({ entries })
})

router.patch(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validate(req, Types.UpdateActiveEntryRequest)
  const entry = await model.update(body, user)
  return res.status(200).json({ entry })
})

router.delete(async (req, res) => {
  const { user } = await authenticate(req)
  const entry = await model.delete(user)
  return res.status(200).json({ entry })
})

export default router.handler

