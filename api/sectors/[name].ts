import { Types } from '../../server/runtypes'
import { validateRequest } from "../../server/validate";
import { authenticate } from "../../server/authenticate";
import { Router } from "../../server/router";
import { Photon } from '@prisma/photon';
import { ServerError } from '../../server/errors';
import { SectorModel } from '../../server/models/SectorModel';

const db = new Photon()
const router = Router.create()
const model = SectorModel.create(db)

router.before(async () => { await db.connect() })
router.after(async () => { await db.disconnect() })

router.get<Types.Sector.Response.FindJSON>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validateRequest(req, Types.Sector.Request.Find)
  const sector = await model.find(query.name, user)
  return res.status(200).json({ sector })
})

router.delete<Types.Sector.Response.DeleteJSON>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validateRequest(req, Types.Sector.Request.Delete)
  const wasDeleted = await model.delete(query.name, user)
  if (wasDeleted) {
    return res.status(204).json({})
  } else {
    return ServerError.NotFound.create(req).send(res)
  }
})

export default router.handler