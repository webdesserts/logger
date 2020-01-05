import { Photon } from '@prisma/photon';
import { Router, Types, validate, authenticate } from '../../server'
import { NotFoundError } from '../../server/errors';
import { SectorModel } from '../../server/models/SectorModel';

const db = new Photon()
const router = Router.create()
const model = SectorModel.create(db)

router.before(async () => { await db.connect() })
router.after(async () => { await db.disconnect() })

router.get(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validate(req, Types.FindSectorRequest)
  const sector = model.find(query.name, user)
  return res.status(200).json({ sector })
})

router.delete(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validate(req, Types.FindSectorRequest)
  const wasDeleted = await model.delete(query.name, user)
  if (wasDeleted) {
    return res.status(204).send(null)
  } else {
    return NotFoundError.create(req).send(res)
  }
})

export default router.handler