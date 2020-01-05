import { Photon } from '@prisma/photon';
import { Router, validate, Types, authenticate } from "../../server";
import { NotFoundError } from '../../server/errors';
import { ProjectModel } from '../../server/models/ProjectModel';

const db = new Photon()
const router = Router.create()
const model = ProjectModel.create(db)

router.before(async () => { await db.connect() })
router.after(async () => { await db.disconnect() })

router.get(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validate(req, Types.FindProjectRequest)
  const project = await model.find(query.name, user)
  return res.status(200).json({ project })
})

router.delete(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validate(req, Types.FindProjectRequest)
  const wasDeleted = await model.delete(query.name, user)
  if (wasDeleted) {
    return res.status(204).send(null)
  } else {
    return NotFoundError.create(req).send(res)
  }
})

export default router.handler