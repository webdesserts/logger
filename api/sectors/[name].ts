import { Types } from '../../server/runtypes'
import { validateRequest } from "../../server/validate";
import { authenticate } from "../../server/authenticate";
import { Router } from "../../server/router";
import { PrismaClient } from '@prisma/client';
import { ServerError } from '../../server/errors';
import { SectorModel } from '../../server/models/SectorModel';

const db = new PrismaClient()
const router = Router.create()
const model = SectorModel.create(db)

router.before(async () => { await db.connect() })
router.after(async () => { await db.disconnect() })

router.get(Types.Sector.Response.Find, async (req, res) => {
  const { user } = await authenticate(req)
  const { params } = validateRequest(req, Types.Sector.Request.Find)
  const sector = await model.find(params.name, user)
  return res.status(200).json({ sector })
})

router.delete(Types.Sector.Response.Delete, async (req, res) => {
  const { user } = await authenticate(req)
  const { params } = validateRequest(req, Types.Sector.Request.Delete)
  const wasDeleted = await model.delete(params.name, user)
  if (wasDeleted) {
    return res.status(204).json({})
  } else {
    return ServerError.NotFound.create(req).send(res)
  }
})

export default router.handler