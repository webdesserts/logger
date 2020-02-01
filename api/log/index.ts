import { Types } from '../../server/runtypes'
import { validateRequest } from "../../server/validate";
import { authenticate } from "../../server/authenticate";
import { Router } from "../../server/router";
import { PrismaClient } from '@prisma/client';
import { EntryModel } from "../../server/models/EntryModel";

const db = new PrismaClient()
const model = EntryModel.create(db)
const router = Router.create()

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.get(Types.Entry.Response.FindAll, async (req, res) => {
  const { user } = await authenticate(req)
  const entries = await model.findAll(user)
  return res.status(200).json({ entries })
})

router.post(Types.Entry.Response.Create, async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validateRequest(req, Types.Entry.Request.Create)
  const entry = await model.create(body, user)
  return res.status(200).json({ entry })
})

export default router.handler

