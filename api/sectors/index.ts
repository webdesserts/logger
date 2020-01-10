import { Photon } from '@prisma/photon';
import { Router, validate, Types, authenticate } from '../../server'
import { SectorModel } from '../../server/models/SectorModel';
import { FindAllSectorsResponse, CreateSectorResponse } from '../../server/validation';

const db = new Photon()
const router = Router.create()
const model = SectorModel.create(db)

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.get<FindAllSectorsResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const sectors = await model.findAll(user)
  return res.status(200).json({ sectors })
})

router.post<CreateSectorResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validate(req, Types.CreateSectorRequest)
  const sector = await model.find(body.name, user)
  if (sector) {
    return res.status(200).json({ sector })
  } else {
    const sector = await model.create(body.name, user)
    return res.status(201).json({ sector })
  }
})

export default router.handler