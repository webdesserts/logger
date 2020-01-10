import {
  Router,
  validate,
  Types,
  authenticate,
} from "../../../server";
import { Photon } from '@prisma/photon';
import { ActiveEntryModel } from "../../../server/models/ActiveEntryModel";
import { StopActiveEntryResponse } from "../../../server/validation";

const db = new Photon()
const model = ActiveEntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.patch<StopActiveEntryResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validate(req, Types.StopActiveEntryRequest)
  const entry = await model.stop(body, user)
  return res.status(200).json({ activeEntry: null, entry })
})

export default router.handler