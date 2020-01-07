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

router.post(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validate(req, Types.StartActiveEntryRequest)
  const activeEntry = await model.start(body, user)
  return res.status(200).json({ activeEntry })
})

export default router.handler