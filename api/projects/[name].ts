import { Photon } from '@prisma/photon';
import { Router, validate, Types, authenticate } from "../../server";
import { ServerError } from '../../server/errors';
import { ProjectModel } from '../../server/models/ProjectModel';
import { FindProjectResponse, DeleteProjectResponse } from '../../server/validation';

const db = new Photon()
const router = Router.create()
const model = ProjectModel.create(db)

router.before(async () => { await db.connect() })
router.after(async () => { await db.disconnect() })

router.get<FindProjectResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validate(req, Types.FindProjectRequest)
  const project = await model.find(query.name, user)
  return res.status(200).json({ project })
})

router.delete<DeleteProjectResponse>(async (req, res) => {
  const { user } = await authenticate(req)
  const { query } = validate(req, Types.FindProjectRequest)
  const wasDeleted = await model.delete(query.name, user)
  if (wasDeleted) {
    return res.status(204).json({})
  } else {
    return ServerError.NotFound.create(req).send(res)
  }
})

export default router.handler