import { Photon } from '@prisma/photon';
import { Router, Types, validateRequest, authenticate } from '../../server'
import { ServerError } from '../../server/errors';
import { SectorModel } from '../../server/models/SectorModel';
import { FindSectorResponse, DeleteSectorResponse } from '../../server/validation';

const db = new Photon()
const router = Router.create()
const model = SectorModel.create(db)

router.before(async () => { await db.connect() })
router.after(async () => { await db.disconnect() })

router.get<FindSectorResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validateRequest(req, Types.FindSectorRequest)
  const sector = await model.find(query.name, user)
  return res.status(200).json({ sector })
})

router.delete<DeleteSectorResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validateRequest(req, Types.FindSectorRequest)
  const wasDeleted = await model.delete(query.name, user)
  if (wasDeleted) {
    return res.status(204).json({})
  } else {
    return ServerError.NotFound.create(req).send(res)
  }
})

export default router.handler