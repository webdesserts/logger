import { Types } from '../../../server/runtypes'
import { validateRequest } from "../../../server/validate";
import { authenticate } from "../../../server/authenticate";
import { Router } from "../../../server/router";
import { PrismaClient } from '@prisma/client';
import { ActiveEntryModel } from "../../../server/models/ActiveEntryModel";
import { DateTime } from 'luxon';

const db = new PrismaClient()
const model = ActiveEntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.post(Types.ActiveEntry.Response.Start, async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validateRequest(req, Types.ActiveEntry.Request.Start)
  const entry = await model.stop({ end: DateTime.local() }, user)
  const activeEntry = await model.start(body, user)
  return res.status(200).json({ entry, activeEntry })
})

export default router.handler