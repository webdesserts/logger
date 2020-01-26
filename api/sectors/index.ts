import { Types } from '../../server/runtypes'
import { validateRequest } from "../../server/validate";
import { authenticate } from "../../server/authenticate";
import { Router } from "../../server/router";
import { Photon } from '@prisma/photon';
import { SectorModel } from '../../server/models/SectorModel';

const db = new Photon()
const router = Router.create()
const model = SectorModel.create(db)

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.get(Types.Sector.Response.FindAll, async (req, res) => {
  const { user } = await authenticate(req)
  const sectors = await model.findAll(user)
  return res.status(200).json({ sectors })
})

router.post(Types.Sector.Response.Create, async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validateRequest(req, Types.Sector.Request.Create)
  const sector = await model.find(body.name, user)
  if (sector) {
    return res.status(200).json({ sector })
  } else {
    const sector = await model.create(body.name, user)
    return res.status(201).json({ sector })
  }
})

export default router.handler