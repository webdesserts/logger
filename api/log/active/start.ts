import { Types } from '../../../server/runtypes'
import { validateRequest } from "../../../server/validate";
import { authenticate } from "../../../server/authenticate";
import { Router } from "../../../server/router";
import { Photon } from '@prisma/photon';
import { ActiveEntryModel } from "../../../server/models/ActiveEntryModel";

const db = new Photon()
const model = ActiveEntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.post<Types.ActiveEntry.Response.StartJSON>(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validateRequest(req, Types.ActiveEntry.Request.Start)
  const activeEntry = await model.start(body, user)
  return res.status(200).json({ activeEntry })
})

export default router.handler