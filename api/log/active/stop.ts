import { Types } from '../../../server/runtypes'
import { validateRequest } from "../../../server/validate";
import { authenticate } from "../../../server/authenticate";
import { Router } from "../../../server/router";
import { Photon } from '@prisma/photon';
import { ActiveEntryModel } from "../../../server/models/ActiveEntryModel";
import { ServerError } from '../../../server/errors';

const db = new Photon()
const model = ActiveEntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.patch(Types.ActiveEntry.Response.Stop, async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validateRequest(req, Types.ActiveEntry.Request.Stop)
  const entry = await model.stop(body, user)
  if (entry) {
    return res.status(200).json({ activeEntry: null, entry })
  } else {
    throw ServerError.NotFound.create(req)
  }
})

export default router.handler