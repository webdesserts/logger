import {
  Router,
  validateRequest,
  Types,
  authenticate,
} from "../../../server";
import { Photon } from '@prisma/photon';
import { ActiveEntryModel } from "../../../server/models/ActiveEntryModel";
import { StartActiveEntryResponse } from "../../../server/validation";

const db = new Photon()
const model = ActiveEntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.post<StartActiveEntryResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validateRequest(req, Types.StartActiveEntryRequest)
  const activeEntry = await model.start(body, user)
  return res.status(200).json({ activeEntry })
})

export default router.handler